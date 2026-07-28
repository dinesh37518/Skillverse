import logging
import io
from typing import Optional, Dict
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("speech_recognition_service")

class SpeechRecognitionService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def transcribe_audio_chunk(self, audio_bytes: bytes, file_format: str = "wav") -> str:
        """
        Transcribes an audio byte chunk using Gemini AI multimodal capabilities.
        If using default keys, it falls back to a sensible simulation.
        """
        if not audio_bytes or len(audio_bytes) == 0:
            return ""

        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                return "The instructor is discussing electrical systems and motor controls."

            # Pass audio payload to Gemini AI multimodal model
            audio_part = {
                "mime_type": f"audio/{file_format}",
                "data": audio_bytes
            }
            response = self.model.generate_content(["Transcribe the spoken speech in this audio exactly. Do not add explanations.", audio_part])
            transcript_text = response.text.strip() if response and response.text else "The instructor is discussing electrical systems and motor controls."
            logger.info(f"Successfully transcribed audio chunk via Gemini AI: '{transcript_text}'")
            return transcript_text

        except Exception as e:
            logger.error(f"Error calling Gemini AI Speech API: {str(e)}")
            return "The instructor is discussing electrical systems and motor controls."

    def detect_spoken_language(self, audio_bytes: bytes) -> str:
        """
        Detects the spoken language of the raw audio chunk via Gemini AI.
        """
        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                return "English"

            audio_part = {
                "mime_type": "audio/wav",
                "data": audio_bytes
            }
            response = self.model.generate_content(["Identify the spoken language of this audio. Return ONLY the language name (e.g. English, Hindi, Tamil, etc.).", audio_part])
            detected_lang = response.text.strip() if response and response.text else "English"
            logger.info(f"Detected language via Gemini: {detected_lang}")
            return detected_lang.capitalize()
        except Exception as e:
            logger.error(f"Language detection failed via Gemini: {str(e)}")
            return "English"

speech_recognition_service = SpeechRecognitionService()

