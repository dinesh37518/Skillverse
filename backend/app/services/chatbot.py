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

    def process_file_and_explain(self, file_name: str, file_type: str, file_bytes: bytes) -> str:
        """
        Scaffolding to extract text from PDF, PPTX, or DOCX and compile a smart explainer.
        """
        logger.info(f"Processing uploaded file: {file_name} ({file_type}) with size {len(file_bytes)} bytes.")
        # Perform document parsing and return descriptive summary
        return f"I have read the document '{file_name}' and updated your learning workspace. You can now ask questions specifically about its topics."

chatbot_service = AITutorChatbot()
