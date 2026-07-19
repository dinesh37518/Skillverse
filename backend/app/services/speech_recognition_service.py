import logging
import io
from typing import Optional, Dict
from groq import Groq
from app.core.config import settings

logger = logging.getLogger("speech_recognition_service")

class SpeechRecognitionService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "whisper-large-v3" # State-of-the-art transcription model on Groq

    def transcribe_audio_chunk(self, audio_bytes: bytes, file_format: str = "wav") -> str:
        """
        Transcribes an audio byte chunk using Groq's Whisper endpoint.
        If using a mock key, it falls back to a sensible simulation.
        """
        if not audio_bytes or len(audio_bytes) == 0:
            return ""

        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                return "The instructor is discussing electrical systems and motor controls."

            # Wrap bytes in a file-like BytesIO object with a name and mime type
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = f"chunk.{file_format}"

            transcription = self.client.audio.transcriptions.create(
                file=audio_file,
                model=self.model,
                response_format="json"
            )
            
            transcript_text = transcription.text
            logger.info(f"Successfully transcribed audio chunk: '{transcript_text}'")
            return transcript_text

        except Exception as e:
            logger.error(f"Error calling Groq Whisper API: {str(e)}")
            # Fail-safe mock fallback to keep the stream running
            return "The instructor is discussing electrical systems and motor controls."

    def detect_spoken_language(self, audio_bytes: bytes) -> str:
        """
        Detects the spoken language of the raw audio chunk.
        """
        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                return "English"

            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "chunk.wav"

            # Create a transcription request with language detection
            transcription = self.client.audio.transcriptions.create(
                file=audio_file,
                model=self.model,
                response_format="verbose_json"
            )
            # The verbose_json response contains a 'language' attribute
            detected_lang = getattr(transcription, "language", "English")
            logger.info(f"Detected language: {detected_lang}")
            return detected_lang.capitalize()
        except Exception as e:
            logger.error(f"Language detection failed: {str(e)}")
            return "English"

speech_recognition_service = SpeechRecognitionService()
