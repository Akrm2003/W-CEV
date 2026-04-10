import json
import re

from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from app.core.config import get_settings

settings = get_settings()

if not settings.OPENAI_API_KEY:
    import warnings
    warnings.warn("OPENAI_API_KEY not set — AI generation will not work")
    client = None
else:
    client_kwargs = {"api_key": settings.OPENAI_API_KEY}
    if settings.OPENAI_API_BASE_URL:
        client_kwargs["base_url"] = settings.OPENAI_API_BASE_URL
    client = OpenAI(**client_kwargs)

router = APIRouter(tags=["messages"])


class ComponentRequest(BaseModel):
    message: str


class GeneratedComponent(BaseModel):
    component_name: str
    summary: str
    html: str


class GenerateResponse(BaseModel):
    component_name: str
    summary: str
    html: str


def _response_schema() -> str:
    return json.dumps(GeneratedComponent.model_json_schema(), indent=2)


def _generate_prompt(message: str) -> str:
    schema = _response_schema()
    return f"""
    You are a meticulous front-end engineer who delivers a single self-contained HTML document.
    Requirements:
    - Inline CSS inside a <style> tag in the <head>
    - Inline JavaScript in a <script> tag at the end of <body>
    - Responsive layout (mobile-friendly)
    - Semantic HTML structure with clear sections
    - Use modern CSS (flexbox or grid) and subtle animations
    - Include a distinct color palette, typography choices, and spacing scale
    - Avoid referencing external assets (fonts, images, CDNs). Use base64 data URIs if needed.
    - Comment tricky parts of CSS/JS
    - Ensure the component works standalone when saved as index.html
    - Make it visually stunning and production-quality

    User request:
    {message}

    Output format:
    \"\"\"
    <!DOCTYPE html>
    <html lang="en">
    ...
    </html>
    \"\"\"

    Provide only the HTML file content, nothing else.

    Respond strictly as JSON matching this schema:
    {schema}
    """


@router.post("/messages/create_component", response_model=GenerateResponse)
def create_component(payload: ComponentRequest):
    """Generate a web component using AI."""
    if client is None:
        raise HTTPException(status_code=503, detail="AI service not configured — set OPENAI_API_KEY")

    prompt = _generate_prompt(payload.message)

    try:
        completion = client.chat.completions.create(
            model=settings.MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a senior front-end engineer. "
                        "Always respond with a JSON object matching the provided schema."
                    ),
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {exc}") from exc

    try:
        raw_content = completion.choices[0].message.content
        payload_dict = _extract_json_payload(raw_content)
        llm_response = GeneratedComponent(**payload_dict)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unable to parse LLM response: {exc}") from exc

    return GenerateResponse(
        component_name=llm_response.component_name,
        summary=llm_response.summary,
        html=llm_response.html,
    )


JSON_BLOCK_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL)


def _extract_json_payload(content: str) -> dict:
    """
    LLMs sometimes wrap JSON in code fences or prepend text.
    Attempt to isolate the JSON object before decoding.
    """
    match = JSON_BLOCK_RE.search(content or "")
    if match:
        candidate = match.group(1)
    else:
        candidate = content or ""
    candidate = candidate.strip()
    candidate = candidate.replace("\u201c", '"').replace("\u201d", '"')
    return json.loads(candidate)