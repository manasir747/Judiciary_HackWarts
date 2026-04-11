from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LexAI Backend"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"

    chroma_persist_directory: str = "./chroma_db"
    chunk_size: int = 1200
    chunk_overlap: int = 160
    max_pdf_size_mb: int = 10

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
