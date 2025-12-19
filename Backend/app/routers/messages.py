import json
import os
import re

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY not found in environment variables")

if os.getenv("OPENAI_API_BASE_URL"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), base_url=os.getenv("OPENAI_API_BASE_URL"))
else:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter(tags=["messages"])


class ComponentRequest(BaseModel):
    message: str


class LLMComponentResponse(BaseModel):
    component_name: str
    summary: str
    html: str


def response_schema() -> str:
    return json.dumps(LLMComponentResponse.model_json_schema(), indent=2)


def generate_prompt(message: str):
    schema = response_schema()
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


@router.post("/messages/create_component", response_class=PlainTextResponse)
def create_component(payload: ComponentRequest):
    prompt = generate_prompt(payload.message)

    try:
        model = os.getenv("MODEL", "gpt-4o-mini")
        completion = client.chat.completions.create(
            model=model,
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
        llm_response = LLMComponentResponse(**payload_dict)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unable to parse LLM response: {exc}") from exc

    return llm_response.html


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