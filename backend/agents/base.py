from langchain_groq import ChatGroq

from config.settings import get_settings


class BaseAgent:
    def __init__(self, model_name: str | None = None) -> None:
        settings = get_settings()
        if not settings.groq_api_key:
            raise ValueError("GROQ_API_KEY is not configured")
        
        selected_model = model_name if model_name else settings.groq_model
        
        self.llm = ChatGroq(
            groq_api_key=settings.groq_api_key,
            model=selected_model,
            temperature=0,
            max_tokens=2048,
        )
