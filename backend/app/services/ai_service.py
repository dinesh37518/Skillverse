import json
import logging
from typing import Dict, Any, List
from groq import Groq
from app.core.config import settings

logger = logging.getLogger("ai_service")

class AIService:
    def __init__(self):
        # Initializing the Groq Client with api keys
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama3-70b-8192" # Enterprise scale high quality model

    def generate_quiz(self, content_text: str, title: str) -> List[Dict[str, Any]]:
        """
        Sends content to Groq and requests a structured list of questions.
        """
        prompt = f"""
        Analyze the following educational content and generate a multiple choice quiz in JSON format.
        Content: "{content_text}"
        
        Generate exactly 3 quiz questions based on the text.
        Your response MUST be a valid JSON array of objects, with no other text around it.
        Each object must have these exact keys:
        - "question": The question text string.
        - "options": An array of exactly 4 strings for the answer options.
        - "correct_index": An integer (0, 1, 2, or 3) representing the index of the correct option.
        """
        try:
            # Mocking api response if key is default/placeholder
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                return [
                    {
                        "question": "What is the primary topic discussed in the content?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct_index": 0
                    },
                    {
                        "question": "Based on the content, which component is critical?",
                        "options": ["First Component", "Second Component", "Third Component", "Fourth Component"],
                        "correct_index": 2
                    }
                ]

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an AI assistant that only outputs valid JSON arrays."},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
                temperature=0.2
            )
            response_text = chat_completion.choices[0].message.content
            return json.loads(response_text)
        except Exception as e:
            logger.error(f"Error calling Groq for Quiz generation: {str(e)}")
            # Fallback mock
            return [
                {
                    "question": f"Self-check question about: {title[:20]}...",
                    "options": ["Correct Answer", "Incorrect Option 1", "Incorrect Option 2", "Incorrect Option 3"],
                    "correct_index": 0
                }
            ]

    def generate_flashcards(self, content_text: str) -> List[Dict[str, str]]:
        """
        Generates deck of Q&A flashcards from lesson content.
        """
        prompt = f"""
        Extract key terms and definitions from the educational text below and format as flashcards in JSON.
        Content: "{content_text}"
        
        Generate exactly 3 flashcards.
        Response must be a valid JSON array of objects. Keys for each object:
        - "front": Simple question or term.
        - "back": Answer or explanation.
        """
        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                return [
                    {"front": "Flashcard front term 1", "back": "Flashcard back definition 1"},
                    {"front": "Flashcard front term 2", "back": "Flashcard back definition 2"}
                ]

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an AI assistant that only outputs valid JSON arrays."},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
                temperature=0.2
            )
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            logger.error(f"Error calling Groq for flashcard generation: {str(e)}")
            return [
                {"front": "Placeholder Card front", "back": "Placeholder Card back"}
            ]

    def generate_summary(self, content_text: str) -> str:
        """
        Extract summary points from educational text.
        """
        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                return "This is a summary of the uploaded lesson, covering the key architectural components and core definitions."

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an expert tutor summary compiler."},
                    {"role": "user", "content": f"Summarize the following content in 3 bullet points: {content_text}"}
                ],
                model=self.model,
                temperature=0.3
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling Groq for Summary generation: {str(e)}")
            return "Unable to generate summary at this time."

    def generate_notes(self, content_text: str) -> str:
        """
        Expands lesson outline into clean readable notes with hierarchy.
        """
        try:
            if settings.GROQ_API_KEY == "gsk_mock_api_key_placeholder":
                return "# Lecture Notes\n\n- ## Core Concepts\n- ## Detail Explanations"

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an assistant formatting educational lecture notes into markdown."},
                    {"role": "user", "content": f"Create detailed study notes from: {content_text}"}
                ],
                model=self.model,
                temperature=0.3
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling Groq for notes generation: {str(e)}")
            return "# Lecture Notes\n\nError formatting notes."

ai_service = AIService()
