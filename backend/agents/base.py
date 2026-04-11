from langchain_groq import ChatGroq

from config.settings import get_settings


class BaseAgent:
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.groq_api_key:
            raise ValueError("GROQ_API_KEY is not configured")
        self.llm = ChatGroq(
            groq_api_key=settings.groq_api_key,
            model=settings.groq_model,
            temperature=0,
            max_tokens=1200,
        )
