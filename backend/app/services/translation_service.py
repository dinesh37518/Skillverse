import logging
from groq import Groq
from app.core.config import settings

logger = logging.getLogger("translation_service")

class IndianLanguagesTranslator:
    def __init__(self):
        # List of 22 Scheduled Indian Languages supported
        self.supported_languages = settings.SUPPORTED_LANGUAGES
        self.client = None
        if settings.GROQ_API_KEY != "gsk_mock_api_key_placeholder":
            try:
                self.client = Groq(api_key=settings.GROQ_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize Groq client in Translation Service: {str(e)}")
        logger.info("Initializing Translation Service supporting 22 Indian Languages.")

    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text from source_lang to target_lang.
        If source_lang equals target_lang, it skips computation and returns original text.
        """
        if not text or text.strip() == "":
            return text
            
        src = source_lang.strip().capitalize()
        tgt = target_lang.strip().capitalize()
        
        if src == tgt:
            return text
            
        # Normalization check
        if src == "Manipuri (meitei)" or src.startswith("Manipuri"):
            src = "Manipuri"
        if tgt == "Manipuri (meitei)" or tgt.startswith("Manipuri"):
            tgt = "Manipuri"
            
        supported_names = [l.split(" ")[0].capitalize() for l in self.supported_languages]
        
        # Verify supported languages
        src_base = src.split(" ")[0]
        tgt_base = tgt.split(" ")[0]
        if src_base not in supported_names or tgt_base not in supported_names:
            logger.warning(f"Unsupported translation language requested: {src} -> {tgt}. Falling back to original.")
            return text

        # If Groq client is available and active, call it for real translations
        if self.client:
            try:
                prompt = f"""
                Translate the following text from {src} to {tgt}.
                Do not explain the translation, do not include pronunciation guides, and do not add any additional context.
                Only output the exact translated text in the target language's native script.

                Text to translate: "{text}"
                """
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "You are a professional multilingual translator specialized in Indian scheduled languages."},
                        {"role": "user", "content": prompt}
                    ],
                    model="llama3-8b-8192",  # Fast model optimized for translation latency
                    temperature=0.1
                )
                translated_text = chat_completion.choices[0].message.content.strip()
                logger.info(f"Groq translated: '{text}' ({src}) -> '{translated_text}' ({tgt})")
                return translated_text
            except Exception as e:
                logger.error(f"Groq translation failed: {str(e)}. Falling back to mock.")

        # Enterprise fallback mock string
        translated_mock = f"[{tgt} Translation of: '{text}']"
        logger.info(f"Translated (Mock): '{text}' ({src}) -> '{translated_mock}' ({tgt})")
        return translated_mock

translation_service = IndianLanguagesTranslator()
