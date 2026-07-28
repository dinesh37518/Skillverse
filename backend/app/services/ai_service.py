import json
import logging
from typing import Dict, Any, List
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("ai_service")

class AIService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def generate_quiz(self, content_text: str, title: str) -> List[Dict[str, Any]]:
        """
        Sends content to Gemini AI and requests a structured list of quiz questions.
        """
        prompt = f"""
        Analyze the following educational content and generate a multiple choice quiz in JSON format.
        Content: "{content_text}"
        
        Generate exactly 3 quiz questions based on the text.
        Your response MUST be a valid JSON array of objects, with no markdown backticks or other text around it.
        Each object must have these exact keys:
        - "question": The question text string.
        - "options": An array of exactly 4 strings for the answer options.
        - "correct_index": An integer (0, 1, 2, or 3) representing the index of the correct option.
        """
        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
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

            response = self.model.generate_content(prompt)
            clean_text = response.text.replace("```json", "").replace("```", "").strip() if response and response.text else "[]"
            return json.loads(clean_text)
        except Exception as e:
            logger.error(f"Error calling Gemini AI for Quiz generation: {str(e)}")
            return [
                {
                    "question": f"Self-check question about: {title[:20]}...",
                    "options": ["Correct Answer", "Incorrect Option 1", "Incorrect Option 2", "Incorrect Option 3"],
                    "correct_index": 0
                }
            ]

    def generate_flashcards(self, content_text: str) -> List[Dict[str, str]]:
        """
        Generates deck of Q&A flashcards from lesson content via Gemini AI.
        """
        prompt = f"""
        Extract key terms and definitions from the educational text below and format as flashcards in JSON.
        Content: "{content_text}"
        
        Generate exactly 3 flashcards.
        Response must be a valid JSON array of objects with no backticks. Keys for each object:
        - "front": Simple question or term.
        - "back": Answer or explanation.
        """
        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                return [
                    {"front": "Flashcard front term 1", "back": "Flashcard back definition 1"},
                    {"front": "Flashcard front term 2", "back": "Flashcard back definition 2"}
                ]

            response = self.model.generate_content(prompt)
            clean_text = response.text.replace("```json", "").replace("```", "").strip() if response and response.text else "[]"
            return json.loads(clean_text)
        except Exception as e:
            logger.error(f"Error calling Gemini AI for flashcard generation: {str(e)}")
            return [
                {"front": "Placeholder Card front", "back": "Placeholder Card back"}
            ]

    def generate_summary(self, content_text: str) -> str:
        """
        Extract summary points from educational text using Gemini AI.
        """
        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                return "This is a summary of the uploaded lesson, covering the key architectural components and core definitions."

            response = self.model.generate_content(f"Summarize the following content in 3 bullet points: {content_text}")
            return response.text if response and response.text else "Summary unavailable."
        except Exception as e:
            logger.error(f"Error calling Gemini AI for Summary generation: {str(e)}")
            return "Unable to generate summary at this time."

    def generate_notes(self, content_text: str) -> str:
        """
        Expands lesson outline into clean readable notes using Gemini AI.
        """
        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                return "# Lecture Notes\n\n- ## Core Concepts\n- ## Detail Explanations"

            response = self.model.generate_content(f"Create detailed Markdown study notes from: {content_text}")
            return response.text if response and response.text else "# Lecture Notes"
        except Exception as e:
            logger.error(f"Error calling Gemini AI for notes generation: {str(e)}")
            return "# Lecture Notes\n\nError formatting notes."

ai_service = AIService()

