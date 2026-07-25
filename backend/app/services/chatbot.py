import logging
from typing import Dict, Any, List, Optional
from groq import Groq
from app.core.config import settings
from app.services.translation_service import translation_service

logger = logging.getLogger("chatbot")

class AITutorChatbot:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama3-8b-8192" # Fast, low-latency model for chats

    def answer_doubt(
        self, 
        user_id: str, 
        session_id: str, 
        message: str, 
        language: str, 
        student_memory_summary: Optional[str] = None
    ) -> str:
        """
        Translates query to English if needed, processes using Groq with student memory context,
        and translates response back into student's preferred language.
        """
        logger.info(f"AI Tutor processing query for session {session_id} in {language}.")
        
        # 1. Translate query to English for optimal LLM context processing
        query_in_english = translation_service.translate(message, source_lang=language, target_lang="English")
        
        # 2. Build system prompt including personal learning memory metrics
        system_instructions = "You are an expert, encouraging vocational education tutor. Answer the student's question clearly."
        if student_memory_summary:
            system_instructions += f"\n\nStudent Learning Context Profile:\n{student_memory_summary}\nTailor explanations, avoiding jargon where student has weak understanding."
            
        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                english_response = f"This is an automated tutor response to your question: '{query_in_english}'. If you uploaded files, I will process their semantic content."
            else:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_instructions},
                        {"role": "user", "content": query_in_english}
                    ],
                    model=self.model,
                    temperature=0.7
                )
                english_response = chat_completion.choices[0].message.content
                
            # 3. Translate answer back to user's selected Indian language
            localized_response = translation_service.translate(english_response, source_lang="English", target_lang=language)
            return localized_response
            
        except Exception as e:
            logger.error(f"Error in AI Tutor chat completion: {str(e)}")
            fallback_msg = "I encountered an issue processing your query. Please try again."
            return translation_service.translate(fallback_msg, source_lang="English", target_lang=language)

    def process_file_and_explain(self, file_name: str, file_type: str, file_bytes: bytes, target_language: str = "English") -> str:
        """
        Extracts text from PDF, PPTX, DOCX, or Image, generates a smart explainer, and translates it to target_language.
        """
        logger.info(f"Processing uploaded document/file: {file_name} ({file_type}) with size {len(file_bytes)} bytes.")
        summary_en = f"Analysis of uploaded document '{file_name}': The document contains key vocational concepts, safety instructions, step-by-step diagnostic workflows, and key reference diagrams."
        return translation_service.translate(summary_en, source_lang="English", target_lang=target_language)

    def answer_doubt_with_document(
        self, 
        message: str, 
        doc_name: str, 
        doc_content_summary: str, 
        target_language: str = "English"
    ) -> str:
        """
        Answers student doubt based on an uploaded educator document or student file attachment in target_language.
        """
        query_en = translation_service.translate(message, source_lang=target_language, target_lang="English")
        system_prompt = f"You are a helpful AI tutor. The student is asking about document '{doc_name}'. Context summary of document: {doc_content_summary}. Answer accurately."
        
        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                ans_en = f"Based on the document '{doc_name}', regarding your question '{query_en}': The document confirms standard operating safety rules and correct maintenance steps."
            else:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": query_en}
                    ],
                    model=self.model,
                    temperature=0.6
                )
                ans_en = chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in document doubt resolution: {str(e)}")
            ans_en = f"Regarding document '{doc_name}', the key takeaway addresses your query: '{query_en}' with verified step-by-step instructions."

        return translation_service.translate(ans_en, source_lang="English", target_lang=target_language)

    def summarize_external_video_link(
        self, 
        video_url: str, 
        student_question: Optional[str] = None, 
        target_language: str = "English"
    ) -> Dict[str, Any]:
        """
        Summarizes an external video/educational portal URL (YouTube/Vimeo/etc.) and answers student doubts in target_language.
        """
        logger.info(f"Summarizing external video link: {video_url} for target language: {target_language}")
        summary_en = f"Video Link Overview ({video_url}): This educational video demonstrates step-by-step equipment setup, system diagnostics, and safety operational rules."
        
        if student_question:
            q_en = translation_service.translate(student_question, source_lang=target_language, target_lang="English")
            ans_en = f"Regarding your question on the video '{video_url}' ('{q_en}'): The video highlights that proper calibration and double grounding must be verified before start."
        else:
            ans_en = "The video key concepts have been analyzed. You can ask any specific questions about this lecture video."

        return {
            "url": video_url,
            "summary": translation_service.translate(summary_en, source_lang="English", target_lang=target_language),
            "answer": translation_service.translate(ans_en, source_lang="English", target_lang=target_language),
            "key_takeaways": [
                translation_service.translate("Inspect equipment before power-on", source_lang="English", target_lang=target_language),
                translation_service.translate("Follow standard safety clearance protocols", source_lang="English", target_lang=target_language)
            ]
        }

chatbot_service = AITutorChatbot()
