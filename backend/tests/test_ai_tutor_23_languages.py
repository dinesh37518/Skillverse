import pytest
from app.services.chatbot import chatbot_service
from app.services.resource_bank import resource_bank, MultilingualResourceBank

def test_resource_bank_23_languages():
    """Verify resource bank supports all 23 official languages and returns greetings."""
    supported = resource_bank.SUPPORTED_23_LANGUAGES
    assert len(supported) == 23
    assert "English" in supported
    assert "Tamil" in supported
    assert "Hindi" in supported
    assert "Assamese" in supported
    assert "Bengali" in supported
    assert "Bodo" in supported
    assert "Dogri" in supported
    assert "Gujarati" in supported
    assert "Kannada" in supported
    assert "Kashmiri" in supported
    assert "Konkani" in supported
    assert "Maithili" in supported
    assert "Malayalam" in supported
    assert "Manipuri (Meitei)" in supported
    assert "Marathi" in supported
    assert "Nepali" in supported
    assert "Odia" in supported
    assert "Punjabi" in supported
    assert "Sanskrit" in supported
    assert "Santali" in supported
    assert "Sindhi" in supported
    assert "Telugu" in supported
    assert "Urdu" in supported

    context_hi = resource_bank.get_resource_context(topic="electrical wiring", language="Hindi")
    assert "PREFERRED LANGUAGE: Hindi" in context_hi
    assert "Electrical Engineering" in context_hi

def test_emotional_state_detection():
    """Verify sentiment detection triggers appropriate emotional support pep talk."""
    emotion_anxious = chatbot_service._detect_emotional_state("I am stressed and worried about my exam failure")
    assert emotion_anxious["state"] == "anxious"
    assert "4-4-4 breathing" in emotion_anxious["pep_talk"].lower()

    emotion_confused = chatbot_service._detect_emotional_state("I don't understand how relay tripping works")
    assert emotion_confused["state"] == "confused"

    emotion_motivated = chatbot_service._detect_emotional_state("I am ready and got it! quiz me now!")
    assert emotion_motivated["state"] == "motivated"

def test_answer_doubt_multilingual():
    """Verify doubt resolution across languages."""
    reply_ta = chatbot_service.answer_doubt(
        user_id="user_123",
        session_id="sess_123",
        message="Explain transformer grounding safety",
        language="Tamil"
    )
    assert len(reply_ta) > 0

    reply_hi = chatbot_service.answer_doubt(
        user_id="user_123",
        session_id="sess_123",
        message="How to calibrate digital multimeter?",
        language="Hindi"
    )
    assert len(reply_hi) > 0

def test_generate_practice_question_23_languages():
    """Verify practice quiz generation in selected preferred language."""
    practice_kn = chatbot_service.generate_practice_question(
        topic="AC Motor Tripping",
        language="Kannada",
        difficulty="Medium"
    )
    assert practice_kn["language"] == "Kannada"
    assert len(practice_kn["options"]) == 4
    assert "explanation" in practice_kn
    assert "emotional_pep_talk" in practice_kn
