import logging
from typing import Dict, Any, List
from app.services.speech_to_text import stt_service
from app.services.translation_service import translation_service
from app.services.text_to_speech import tts_service
from app.services.speech_to_speech import s2s_service
from app.services.ai_service import ai_service

logger = logging.getLogger("video_localization")

class VideoLocalizationPipeline:
    def __init__(self):
        logger.info("Initializing Video Localization Pipeline Orchestrator with Speech-to-Speech (S2S).")

    def run_pipeline(self, video_id: str, original_video_url: str, original_lang: str, target_languages: List[str]) -> Dict[str, Any]:
        """
        Runs full async Speech-to-Speech (S2S) localization process:
        1. Transcribe original audio (STT).
        2. Translate transcripts to 22 targets (Translation).
        3. Synthesize voice dubbed files (S2S TTS).
        4. Draft learning assets: summary, quiz, note documents (AI).
        """
        logger.info(f"Starting S2S localization pipeline on video {video_id} (original language: {original_lang})")
        
        # 1. Transcribe audio chunk (Stub output)
        transcript_original = "Welcome to the tutorial on electrical safety and circuit configurations."
        
        results = {
            "video_id": video_id,
            "original_language": original_lang,
            "transcript_original": transcript_original,
            "translations": []
        }
        
        # 2. Iterate and localize for each target Indian language requested
        for lang in target_languages:
            if lang.lower() == original_lang.lower():
                continue
                
            # Perform Speech-to-Speech Dubbing Generation
            s2s_data = s2s_service.process_full_video_speech_to_speech(
                video_id=video_id, 
                source_audio_url=original_video_url, 
                source_language=original_lang, 
                target_language=lang
            )
            
            translated_transcript = s2s_data["translated_transcript"]
            subtitles_vtt_url = s2s_data["subtitles_vtt_url"]
            dubbed_audio_url = s2s_data["dubbed_audio_url"]
            
            # Generate study assets using LLM services
            notes = ai_service.generate_notes(translated_transcript)
            summary = ai_service.generate_summary(translated_transcript)
            
            results["translations"].append({
                "language": lang,
                "subtitles_url": subtitles_vtt_url,
                "dubbed_audio_url": dubbed_audio_url,
                "translated_transcript": translated_transcript,
                "summary": summary,
                "notes": notes
            })
            logger.info(f"Completed Speech-to-Speech (S2S) voice dubbing for: {lang}")
            
        return results

video_localizer = VideoLocalizationPipeline()
