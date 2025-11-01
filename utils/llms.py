from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings

class GeminiModel:
    
    @staticmethod
    def model():
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-pro",
            google_api_key=settings.gemini_api_key
        )

