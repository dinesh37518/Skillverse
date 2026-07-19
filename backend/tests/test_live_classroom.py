import pytest
import datetime
import uuid
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

def mock_db():
    db = MagicMock()
    return db

@pytest.fixture(autouse=True)
def run_around_tests():
    app.dependency_overrides.clear()
    yield

# ==========================================
# TEST: LIVE CLASS SCHEDULE & READ
# ==========================================
def test_schedule_live_class(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_educator
    app.dependency_overrides[get_db] = mock_db

    mock_class = MagicMock()
    mock_class.id = "00000000-0000-0000-0000-111111111111"
    mock_class.course_id = "00000000-0000-0000-0000-222222222222"
    mock_class.educator_id = "00000000-0000-0000-0000-000000000002"
    mock_class.title = "High-Voltage Breakers Live Prep"
    mock_class.description = "Practice setup guidelines live"
    mock_class.scheduled_at = datetime.datetime.fromisoformat("2026-07-12T10:00:00")
    mock_class.status = "scheduled"
    mock_class.webrtc_room_id = "room-prep-101"
    mock_class.created_at = datetime.datetime.utcnow()
    mock_class.updated_at = datetime.datetime.utcnow()

    from app.services.live_class_service import live_class_service
    monkeypatch.setattr(live_class_service, "create_live_class", lambda db, cid, eid, t, d, sa: mock_class)

    response = client.post("/api/v1/live-classes", json={
        "course_id": "00000000-0000-0000-0000-222222222222",
        "title": "High-Voltage Breakers Live Prep",
        "description": "Practice setup guidelines live",
        "scheduled_at": "2026-07-12T10:00:00Z"
    })

    assert response.status_code == 200
    assert response.json()["title"] == "High-Voltage Breakers Live Prep"
    assert response.json()["status"] == "scheduled"

def test_list_live_classes(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db

    mock_class = MagicMock()
    mock_class.id = "00000000-0000-0000-0000-111111111111"
    mock_class.course_id = "00000000-0000-0000-0000-222222222222"
    mock_class.educator_id = "00000000-0000-0000-0000-000000000002"
    mock_class.title = "High-Voltage Breakers Live Prep"
    mock_class.description = "Practice setup guidelines live"
    mock_class.scheduled_at = datetime.datetime.fromisoformat("2026-07-12T10:00:00")
    mock_class.status = "scheduled"
    mock_class.webrtc_room_id = "room-prep-101"
    mock_class.created_at = datetime.datetime.utcnow()
    mock_class.updated_at = datetime.datetime.utcnow()

    from app.services.live_class_service import live_class_service
    monkeypatch.setattr(live_class_service, "get_live_classes", lambda db, cid: [mock_class])

    response = client.get("/api/v1/live-classes")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["webrtc_room_id"] == "room-prep-101"

def test_get_live_class_outputs(monkeypatch):
    app.dependency_overrides[get_current_user] = mock_current_student
    app.dependency_overrides[get_db] = mock_db

    mock_outputs = {
        "session_id": "00000000-0000-0000-0000-111111111111",
        "transcript": "Instructor speech content",
        "summary": "Summary points",
        "notes": "Lecture notes",
        "flashcards": [],
        "quiz": []
    }

    from app.services.live_class_service import live_class_service
    monkeypatch.setattr(live_class_service, "get_live_class_outputs", lambda db, cid: mock_outputs)

    response = client.get("/api/v1/live-classes/00000000-0000-0000-0000-111111111111/outputs")
    assert response.status_code == 200
    assert response.json()["transcript"] == "Instructor speech content"
    assert response.json()["summary"] == "Summary points"

# ==========================================
# TEST: LIVE CLASSROOM WEBSOCKET ROUTING
# ==========================================
def test_websocket_classroom(monkeypatch):
    # Mock attendance_service methods to avoid real DB calls
    from app.services.attendance_service import attendance_service
    monkeypatch.setattr(attendance_service, "record_join", lambda db, sid, uid, lang: None)
    monkeypatch.setattr(attendance_service, "record_leave", lambda db, sid, uid: None)

    # Mock translation_service to return the message as-is
    from app.services.translation_service import translation_service
    monkeypatch.setattr(translation_service, "translate", lambda text, source_lang, target_lang: text)

    # Mock SessionLocal to return a MagicMock DB session
    from unittest.mock import MagicMock
    monkeypatch.setattr("app.api.websocket_classroom.SessionLocal", lambda: MagicMock())

    # Use FastAPI TestClient to connect to websocket
    with client.websocket_connect("/ws/classroom/00000000-0000-0000-0000-111111111111?role=student&language=English") as websocket:
        # Receive connection notification message
        data = websocket.receive_json()
        assert data["type"] == "notification"
        assert "joined the session" in data["message"]

        # Send chat message
        websocket.send_json({
            "type": "chat",
            "sender": "Amit",
            "message": "Hello instructor"
        })
        
        # Receive translated chat back
        chat_reply = websocket.receive_json()
        assert chat_reply["type"] == "chat"
        assert chat_reply["sender"] == "Amit"
        assert "Hello instructor" in chat_reply["original_message"]

