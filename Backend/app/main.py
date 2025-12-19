from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import health_router, messages_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.PROJECT_NAME)

    if settings.BACKEND_CORS_ORIGINS.strip() == "*":
        allow_origins = ["*"]
    else:
        allow_origins = [
            o.strip()
            for o in settings.BACKEND_CORS_ORIGINS.split(",")
            if o.strip()
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router, prefix=settings.API_V1_STR)
    app.include_router(messages_router, prefix=settings.API_V1_STR)

    @app.get("/")
    def root() -> dict:
        return {"name": settings.PROJECT_NAME}

    return app


app = create_app()
