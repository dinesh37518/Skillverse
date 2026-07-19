# pyrefly: ignore [missing-import]
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import endpoints, search, websocket_classroom

app = FastAPI(
    title=settings.APP_NAME,
    description="Multilingual AI Vocational Learning Management System Backend.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Setup CORS middleware to allow portals connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register main API Routers
app.include_router(endpoints.router, prefix=settings.API_V1_STR, tags=["Core Modules"])
app.include_router(search.router, prefix=settings.API_V1_STR, tags=["Search Engine"])
app.include_router(websocket_classroom.router, tags=["Live Classroom WebSockets"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "tagline": "Learn in Your Language. Grow with AI.",
        "supported_languages_count": len(settings.SUPPORTED_LANGUAGES)
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
