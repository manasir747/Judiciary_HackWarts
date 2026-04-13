from langchain_groq import ChatGroq

from config.settings import get_settings


class BaseAgent:
    def __init__(self, model_name: str | None = None, provider: str = "groq") -> None:
        settings = get_settings()
        
        if provider == "groq":
            if not settings.groq_api_key:
                raise ValueError("GROQ_API_KEY is not configured")
            selected_model = model_name if model_name else settings.groq_model
            self.llm = ChatGroq(
                groq_api_key=settings.groq_api_key,
                model=selected_model,
                temperature=0,
                max_tokens=2048,
            )
        elif provider == "google":
            from langchain_openai import ChatOpenAI
            if not settings.gemma_api_key:
                # Fallback to Groq if key is missing
                selected_model = model_name if model_name else settings.groq_model
                self.llm = ChatGroq(
                    groq_api_key=settings.groq_api_key,
                    model=selected_model,
                    temperature=0,
                )
            else:
                selected_model = model_name if model_name else settings.gemma_model
                self.llm = ChatOpenAI(
                    model=selected_model,
                    openai_api_key=settings.gemma_api_key,
                    base_url=settings.openrouter_base_url,
                    temperature=0,
                )
        else:
            raise ValueError(f"Unsupported provider: {provider}")
