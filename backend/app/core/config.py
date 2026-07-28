from typing import List
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "SkillVerse AI"
    API_V1_STR: str = "/api/v1"
    
    # Database Configuration (Supabase PostgreSQL)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:54322/postgres"
    
    # Redis Configuration for realtime channels & cache
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Engine API Key (Google Gemini AI)
    GEMINI_API_KEY: str = "your_gemini_api_key_placeholder"
    
    # SMTP Email Verification Gateway Configurations
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "noreply@skillverse.ai"
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@skillverse.ai"
    SMTP_FROM_NAME: str = "SkillVerse AI Verification"
    EMAIL_VERIFICATION_REQUIRED: bool = True

    # Supabase authentication details
    SUPABASE_URL: str = "https://mock.supabase.co"
    SUPABASE_JWT_SECRET: str = "super-secret-jwt-token-key-placeholder"
    SUPABASE_ANON_KEY: str = "mock-anon-key-placeholder"
    SUPABASE_SERVICE_ROLE_KEY: str = "mock-service-role-key-placeholder"
    STORAGE_BUCKET_NAME: str = "skillverse-storage"
    
    # CORS Origins configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Educator Web Portal
        "http://localhost:3001",  # Admin Web Portal
        "http://localhost:8080",  # Flutter Web Client (if testing locally)
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
    
    # Supported Languages List
    SUPPORTED_LANGUAGES: List[str] = [
        "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", 
        "Hindi", "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", 
        "Manipuri (Meitei)", "Marathi", "Nepali", "Odia", "Punjabi", 
        "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()
