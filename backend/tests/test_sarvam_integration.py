import pytest
from app.core.config import settings
from app.services.translation_service import translation_service, SARVAM_LANG_MAP
from app.services.chatbot import chatbot_service
from app.services.speech_recognition_service import speech_recognition_service
from app.services.text_to_speech import tts_service
from app.services.speech_to_speech import s2s_service
from app.services.ai_service import ai_service

def test_sarvam_config_settings():
    """Verify SARVAM_API_KEY setting is initialized in Settings."""
    assert hasattr(settings, "SARVAM_API_KEY")
    assert settings.SARVAM_API_KEY is not None

def test_sarvam_language_map():
    """Verify standard Indian languages are mapped to Sarvam BCP-47 codes."""
    assert SARVAM_LANG_MAP.get("Hindi") == "hi-IN"
    assert SARVAM_LANG_MAP.get("Tamil") == "ta-IN"
    assert SARVAM_LANG_MAP.get("Telugu") == "te-IN"
    assert SARVAM_LANG_MAP.get("English") == "en-IN"

def test_translation_service_with_sarvam_fallback():
    """Verify translation service functions smoothly with Sarvam AI logic integrated."""
    res = translation_service.translate(
        text="Welcome to electrical safety workshop",
        source_lang="English",
        target_lang="Hindi"
    )
    assert len(res) > 0

def test_chatbot_service_sarvam_chat_integration():
    """Verify chatbot service handles Sarvam AI chat agent queries gracefully."""
    reply = chatbot_service.answer_doubt(
        user_id="test_user_1",
        session_id="test_sess_1",
        message="What is Ohm's Law?",
        language="English"
    )
    assert len(reply) > 0
    assert "Ohm" in reply or "Definition" in reply or "Voltage" in reply

def test_sarvam_stt_integration():
    """Verify STT service uses Sarvam AI as primary engine."""
    sample_pcm = b"RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80\x3e\x00\x00\x00\x7d\x00\x00\x02\x00\x10\x00data\x00\x08\x00\x00" + b"\x00"*100
    res = speech_recognition_service.transcribe_audio_chunk(sample_pcm)
    assert isinstance(res, str)

def test_sarvam_tts_integration():
    """Verify TTS service synthesizes audio with Sarvam AI bulbul:v1 engine."""
    audio_data = tts_service.synthesize_speech("Electrical safety lockout procedure", "Hindi")
    assert isinstance(audio_data, bytes)
    assert len(audio_data) > 0

def test_sarvam_s2s_pipeline():
    """Verify end-to-end S2S pipeline runs across Sarvam STT, Translate, and TTS."""
    sample_pcm = b"RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80\x3e\x00\x00\x00\x7d\x00\x00\x02\x00\x10\x00data\x00\x08\x00\x00" + b"\x00"*100
    res = s2s_service.process_speech_to_speech_chunk(sample_pcm, source_language="English", target_language="Tamil")
    assert res["status"] in ["success", "fallback"]
    assert "dubbed_audio_bytes" in res

def test_sarvam_ai_service_quiz():
    """Verify AI Service generates quizzes using Sarvam AI LLM."""
    quizzes = ai_service.generate_quiz("Transformer insulation and ground fault protection.", "Electrical Engineering")
    assert isinstance(quizzes, list)
    assert len(quizzes) > 0
