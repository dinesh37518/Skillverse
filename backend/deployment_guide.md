# Production Deployment Guide - SkillVerse AI

This document provides deployment configurations, environment settings, and best practices for moving the **SkillVerse AI** backend and web portals into production.

---

## 1. Directory Structure & Repositories

SkillVerse AI is structured as a monorepo or modular directories:
- **`backend`**: FastAPI Web API and WebSockets server.
- **`admin_web_portal`**: Next.js administrator statistics and configurations.
- **`educator_web_portal`**: Next.js educator curriculum and live stream scheduler.
- **`student_mobile_app`**: Flutter mobile application.
- **`supabase`**: Database migrations and configuration schemas.

---

## 2. Environment Variables Configuration

Ensure the following variables are defined in your deployment settings:

### Backend (Railway / Docker Container)

```bash
# General
APP_NAME="SkillVerse AI"
API_V1_STR="/api/v1"

# Database Configuration (Supabase PostgreSQL Connection String)
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"

# Real-time WebSockets state server (Redis cache URL)
REDIS_URL="redis://default:[password]@[redis-host]:6379/0"

# AI Integrations
GROQ_API_KEY="gsk_your_production_groq_api_key_here"

# Supabase Auth Settings
SUPABASE_URL="https://[project-id].supabase.co"
SUPABASE_JWT_SECRET="your-production-jwt-signing-secret"
SUPABASE_ANON_KEY="your-production-client-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-production-service-role-key"
STORAGE_BUCKET_NAME="skillverse-storage"
```

### Next.js Portals (Vercel / Amplify)

```bash
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-production-client-anon-key"
NEXT_PUBLIC_BACKEND_API_URL="https://skillverse-backend.railway.app/api/v1"
NEXT_PUBLIC_WEBSOCKET_API_URL="wss://skillverse-backend.railway.app/ws"
```

---

## 3. Database Migration Deployment

To deploy migrations to production Supabase:
1. Connect via the Supabase SQL Editor.
2. Run the DDL scripts from:
   - [20260707000000_schema.sql](file:///c:/Users/Dineshkumar%20M/OneDrive/Desktop/Skillverse%20AI/supabase/migrations/20260707000000_schema.sql)
   - [20260711000000_live_classroom.sql](file:///c:/Users/Dineshkumar%20M/OneDrive/Desktop/Skillverse%20AI/supabase/migrations/20260711000000_live_classroom.sql)
3. Ensure row-level security (RLS) policies are active and that standard profile-syncing database triggers exist.

---

## 4. Docker Production Containerization

Use the following docker setup for containerizing the FastAPI backend.

### `Dockerfile`

```dockerfile
FROM python:3.10-slim

WORKDIR /workspace

# Install system dependencies needed for audio/math libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 5. Security & Rate-Limiting

1. **CORS Policy**: Restrict `BACKEND_CORS_ORIGINS` in your environment config strictly to verified Next.js domain paths and web testing URLs.
2. **JWT Audience**: Ensure the Jose JWT decoder validates that token audience targets `"authenticated"` to avoid cross-claim auth exploits.
3. **Database Security**: Enforce PostgreSQL role privileges ensuring the `anon` role has restricted access.
