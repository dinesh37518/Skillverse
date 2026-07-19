import pytest
import datetime
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser

client = TestClient(app)

def mock_current_student():
    return CurrentUser(id="00000000-0000-0000-0000-000000000001", email="student@test.com", role="student")

def mock_current_educator():
    return CurrentUser(id="00000000-0000-0000-0000-000000000002", email="educator@test.com", role="educator")

def mock_current_admin():
    return CurrentUser(id="00000000-0000-0000-0000-000000000003", email="admin@test.com", role="admin")

def mock_db():
    db = MagicMock()
    return db

@pytest.fixture(autouse=True)
def run_around_tests():
    app.dependency_overrides.clear()
    yield

# ==========================================
# TEST: ADVANCED DASHBOARDS ANALYTICS
# ==========================================
def test_admin_advanced_analytics():
    app.dependency_overrides[get_current_user] = mock_current_admin
    app.dependency_overrides[get_db] = mock_db
    
    response = client.get("/api/v1/admin/advanced-analytics")
    assert response.status_code == 200
    assert "groq_usage" in response.json()
    assert "supabase_usage" in response.json()

def test_educator_advanced_analytics():
    app.dependency_overrides[get_current_user] = mock_current_educator
    app.dependency_overrides[get_db] = mock_db
    
    response = client.get("/api/v1/educator/advanced-analytics")
    assert response.status_code == 200
    assert "attendance_rate_percent" in response.json()
    assert "student_engagement_index" in response.json()

def test_student_advanced_analytics():
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db
    
    response = client.get("/api/v1/student/advanced-analytics")
    assert response.status_code == 200
    assert "learning_streak_days" in response.json()
    assert "ai_mentor_suggestions" in response.json()

# ==========================================
# TEST: REPORTS
# ==========================================
def test_generate_report(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_admin
    app.dependency_overrides[get_db] = mock_db

    mock_report = MagicMock()
    mock_report.id = "report-1"
    mock_report.report_type = "attendance"
    mock_report.generated_by = "00000000-0000-0000-0000-000000000003"
    mock_report.content = {"average_watch_minutes": 22}
    mock_report.created_at = datetime.datetime.utcnow()

    from app.services.report_service import report_service
    monkeypatch.setattr(report_service, "generate_report", lambda db, rtype, gid: mock_report)

    response = client.post("/api/v1/reports/generate?report_type=attendance")
    assert response.status_code == 200
    assert response.json()["report_type"] == "attendance"
    assert response.json()["content"]["average_watch_minutes"] == 22

# ==========================================
# TEST: AI SKILL PASSPORT
# ==========================================
def test_skill_passport_retrieve(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db

    mock_passport = MagicMock()
    mock_passport.id = "pass-1"
    mock_passport.student_id = "00000000-0000-0000-0000-000000000001"
    mock_passport.completed_courses = ["Wiring Safety 101"]
    mock_passport.completed_lessons = []
    mock_passport.quiz_scores = []
    mock_passport.certificates = []
    mock_passport.skills_learned = ["Wiring Calibration"]
    mock_passport.projects_completed = []
    mock_passport.competency_summary = "Vocation electrical student competence."
    mock_passport.skill_growth_timeline = []
    mock_passport.recommended_skills = []
    mock_passport.career_recommendation = "Technician Assistant"
    mock_passport.progress_timeline = []
    mock_passport.created_at = datetime.datetime.utcnow()
    mock_passport.updated_at = datetime.datetime.utcnow()

    from app.services.skill_passport_service import skill_passport_service
    monkeypatch.setattr(skill_passport_service, "get_or_create_passport", lambda db, sid: mock_passport)

    response = client.get("/api/v1/student/skill-passport")
    assert response.status_code == 200
    assert response.json()["completed_courses"] == ["Wiring Safety 101"]
    assert response.json()["career_recommendation"] == "Technician Assistant"
