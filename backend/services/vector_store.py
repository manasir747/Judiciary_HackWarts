from typing import List
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

from config.settings import get_settings


class VectorStoreService:
    def __init__(self) -> None:
        settings = get_settings()
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
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
