from typing import List
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

from config.settings import get_settings


model = None


def get_model():
    global model
    if model is None:
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model


class LazySentenceTransformerEmbeddings(Embeddings):
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        model_instance = get_model()
        vectors = model_instance.encode(texts, show_progress_bar=False)
        return vectors.tolist()

    def embed_query(self, text: str) -> list[float]:
        model_instance = get_model()
        vector = model_instance.encode(text, show_progress_bar=False)
        return vector.tolist()


class VectorStoreService:
    def __init__(self) -> None:
        settings = get_settings()
        self.embeddings = LazySentenceTransformerEmbeddings()
        self.store = Chroma(
            collection_name="lexai_docs",
            embedding_function=self.embeddings,
            persist_directory=settings.chroma_persist_directory,
        )

    def add_document_chunks(self, document_id: str, chunks: list[str]) -> None:
        docs: List[Document] = [
            Document(page_content=chunk, metadata={"document_id": document_id})
            for chunk in chunks
        ]
        self.store.add_documents(docs)

    def retrieve(self, document_id: str, query: str, k: int = 4) -> list[Document]:
        return self.store.similarity_search(query, k=k, filter={"document_id": document_id})
