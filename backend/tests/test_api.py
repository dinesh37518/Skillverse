import pytest
import datetime
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from app.main import app
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.schemas.schemas import UserRoleEnum

client = TestClient(app)

# Helper mock current user
def mock_current_student():
    return CurrentUser(id="00000000-0000-0000-0000-000000000001", email="student@test.com", role="student")

def mock_current_educator():
    return CurrentUser(id="00000000-0000-0000-0000-000000000002", email="educator@test.com", role="educator")

def mock_current_admin():
    return CurrentUser(id="00000000-0000-0000-0000-000000000003", email="admin@test.com", role="admin")

# Helper mock DB session
def mock_db():
    db = MagicMock()
    return db

@pytest.fixture(autouse=True)
def run_around_tests():
    # Clean overrides before each test
    app.dependency_overrides.clear()
    yield

# ==========================================
# TEST: ROOT
# ==========================================
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "online"
    assert "app" in json_data

# ==========================================
# TEST: AUTHENTICATION
# ==========================================
def test_login(monkeypatch):
    mock_login = MagicMock(return_value={
        "access_token": "mock-access-token",
        "token_type": "bearer",
        "refresh_token": "mock-refresh-token",
        "role": "student"
    })
    
    from app.services.auth_service import auth_service
    monkeypatch.setattr(auth_service, "login", mock_login)
    
    app.dependency_overrides[get_db] = mock_db
    
    response = client.post("/api/v1/auth/login", json={
        "email": "student@test.com",
        "password": "securepassword"
    })
    
    assert response.status_code == 200
    assert response.json()["access_token"] == "mock-access-token"
    assert response.json()["role"] == "student"

def test_signup(monkeypatch):
    mock_signup = MagicMock(return_value={
        "id": "new-user-uuid",
        "email": "newuser@test.com",
        "role": "student",
        "message": "User registered successfully."
    })
    
    from app.services.auth_service import auth_service
    monkeypatch.setattr(auth_service, "signup", mock_signup)
    
    response = client.post("/api/v1/auth/signup", json={
        "email": "newuser@test.com",
        "password": "securepassword",
        "full_name": "Test User",
        "role": "student"
    })
    
    assert response.status_code == 200
    assert response.json()["id"] == "new-user-uuid"

# ==========================================
# TEST: PROFILES
# ==========================================
def test_get_profiles_me(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db
    
    # Mock UserService response
    mock_profile = MagicMock()
    mock_profile.id = "00000000-0000-0000-0000-000000000001"
    mock_profile.full_name = "Test Student"
    mock_profile.created_at = "2026-07-07T12:00:00"
    
    from app.services.user_service import user_service
    monkeypatch.setattr(user_service, "get_profile", lambda db, uid: mock_profile)
    monkeypatch.setattr(user_service, "get_language_preference", lambda db, uid: None)

    response = client.get("/api/v1/profiles/me")
    assert response.status_code == 200
    assert response.json()["full_name"] == "Test Student"
    assert response.json()["role"] == "student"

# ==========================================
# TEST: STUDENT PANEL - COURSE ACCESS
# ==========================================
def test_list_student_courses(monkeypatch):
    mock_courses = [
        MagicMock(id="c1", title="Industrial DC Motors", description="DC motor wiring", category="Electrical", language="Hindi", is_published=True, created_at="2026-07-07")
    ]
    # convert mock to match serializer expectations
    for m in mock_courses:
        m.educator_id = "educator1"
    
    from app.services.course_service import course_service
    monkeypatch.setattr(course_service, "list_courses", lambda db, category, language, is_published: mock_courses)
    app.dependency_overrides[get_db] = mock_db
    
    response = client.get("/api/v1/student/courses")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Industrial DC Motors"

# ==========================================
# TEST: NOTIFICATIONS
# ==========================================
def test_list_notifications(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db
    
    mock_notif = MagicMock()
    mock_notif.id = "notif1"
    mock_notif.user_id = "00000000-0000-0000-0000-000000000001"
    mock_notif.title = "Welcome"
    mock_notif.message = "Welcome to Skillverse"
    mock_notif.is_read = False
    mock_notif.created_at = "2026-07-07T12:00:00"

    from app.services.notification_service import notification_service
    monkeypatch.setattr(notification_service, "list_notifications", lambda db, uid, unread: [mock_notif])

    response = client.get("/api/v1/notifications")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Welcome"

# ==========================================
# TEST: SEARCH
# ==========================================
def test_universal_search(monkeypatch):
    from app.schemas.schemas import SearchResultItem
    mock_search_results = [
        SearchResultItem(id="r1", type="video", title="Motor Safety", description="Safety guidelines", relevance_score=0.95, url="videos/safety.mp4")
    ]
    
    from app.services.search_service import search_service
    monkeypatch.setattr(search_service, "universal_search", lambda db, q, lang: mock_search_results)
    app.dependency_overrides[get_db] = mock_db

    response = client.get("/api/v1/search?query=motor")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Motor Safety"


# ==========================================
# TEST: AI PERSONAL MENTOR
# ==========================================
def test_mentor_dashboard(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db
    
    mock_dashboard_data = {
        "learning_progress": 70.0,
        "today_goal": {"text": "Learn logic gates", "completed": False, "progress": 0.5},
        "weekly_goal": {"text": "Complete 3 wiring lessons", "completed": False, "progress": 0.8},
        "skill_growth": [{"skill": "Electrical", "level": 60}],
        "learning_streak": 3,
        "recommended_lessons": [{"id": "lesson-1", "title": "Tripping circuits", "course_title": "DC Motor Wiring Basics", "type": "Next Lesson"}],
        "recommended_revisions": [],
        "ai_suggestions": {
            "predicted_weak_areas": ["Calibrating analog trippers"],
            "predicted_learning_difficulties": ["Interpretation of multimeters"],
            "career_pathways": ["High Voltage Transformer Technician"],
            "additional_resources": [],
            "motivational_messages": ["Keep up the streak!"]
        },
        "upcoming_live_sessions": [],
        "recently_weak_topics": [],
        "recently_improved_topics": [],
        "motivational_messages": ["Keep up the streak!"],
        "badges": [{"name": "Streak Starter", "description": "3-day streak", "icon": "local_fire_department"}]
    }

    from app.services.mentor_service import mentor_service
    monkeypatch.setattr(mentor_service, "get_mentor_dashboard", lambda db, uid: mock_dashboard_data)

    response = client.get("/api/v1/student/mentor/dashboard")
    assert response.status_code == 200
    assert response.json()["learning_progress"] == 70.0
    assert response.json()["learning_streak"] == 3


# ==========================================
# TEST: EDUCATIONAL VIDEO ANALYSIS
# ==========================================
def test_video_analysis(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db

    mock_analysis_result = MagicMock()
    mock_analysis_result.id = "mock-uuid-val"
    mock_analysis_result.video_url = "https://www.youtube.com/watch?v=safety101"
    mock_analysis_result.title = "High Voltage Safety"
    mock_analysis_result.description = "Safety checks"
    mock_analysis_result.duration = "10:30"
    mock_analysis_result.spoken_language = "English"
    mock_analysis_result.transcript = "Test transcript content"
    mock_analysis_result.subtitles = []
    mock_analysis_result.summary = "Test summary"
    mock_analysis_result.notes = "Test notes"
    mock_analysis_result.flashcards = []
    mock_analysis_result.quiz = []
    mock_analysis_result.interview_questions = []
    mock_analysis_result.learning_objectives = []
    mock_analysis_result.key_concepts = []
    mock_analysis_result.estimated_difficulty = "Intermediate"
    mock_analysis_result.revision_notes = "Test revision notes"
    mock_analysis_result.created_at = datetime.datetime.utcnow()

    from app.services.video_analysis_service import video_analysis_service
    monkeypatch.setattr(video_analysis_service, "analyze_video_url", lambda db, url: mock_analysis_result)

    response = client.post("/api/v1/student/video/analyze", json={
        "url": "https://www.youtube.com/watch?v=safety101"
    })
    
    assert response.status_code == 200
    assert response.json()["title"] == "High Voltage Safety"
    assert response.json()["estimated_difficulty"] == "Intermediate"

def test_video_chat(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db

    from app.services.video_analysis_service import video_analysis_service
    monkeypatch.setattr(video_analysis_service, "answer_video_doubt", lambda db, vid, q, lang: "Grounding prevents shock.")

    response = client.post("/api/v1/student/video/chat", json={
        "video_id": "mock-uuid-val",
        "question": "What does grounding do?",
        "language": "English"
    })

    assert response.status_code == 200
    assert response.json()["reply"] == "Grounding prevents shock."


