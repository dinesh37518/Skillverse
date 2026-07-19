import logging
from typing import Dict, List
from sqlalchemy.orm import Session
from app.services.translation_service import translation_service

logger = logging.getLogger("subtitle_service")

class SubtitleService:
    def translate_live_subtitles(
        self, transcript: str, original_lang: str, target_languages: List[str]
    ) -> Dict[str, str]:
        """
        Translates a transcript chunk into a map of target languages.
        Example output: {"Hindi": "ग्राउंड केबल...", "Tamil": "தரை வடம்..."}
        """
        subtitles_map = {}
        for lang in target_languages:
            try:
                # If target language equals original language, skip translation
                if lang.lower() == original_lang.lower():
                    subtitles_map[lang] = transcript
                else:
                    translated = translation_service.translate(
                        transcript, source_lang=original_lang, target_lang=lang
                    )
                    subtitles_map[lang] = translated
            except Exception as e:
                logger.error(f"Failed to translate subtitles to {lang}: {str(e)}")
                subtitles_map[lang] = transcript  # Fallback to original text

        return subtitles_map

subtitle_service = SubtitleService()
