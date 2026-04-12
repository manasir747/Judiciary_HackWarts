from dataclasses import dataclass


@dataclass
class RetrievedChunk:
    page_content: str


class VectorStoreService:
    """Lightweight in-memory placeholder service.

    This keeps the public interface intact while removing vector DB and
    embedding dependencies from runtime.
    """

    def __init__(self) -> None:
        self._docs: dict[str, list[str]] = {}

    def add_document_chunks(self, document_id: str, chunks: list[str]) -> None:
        self._docs[document_id] = list(chunks)

    def retrieve(self, document_id: str, query: str, k: int = 4) -> list[RetrievedChunk]:
        chunks = self._docs.get(document_id, [])
        if not chunks:
            return []

        query_lower = (query or "").lower()
        ranked = sorted(
            chunks,
            key=lambda text: (query_lower in text.lower(), len(text)),
            reverse=True,
        )
        return [RetrievedChunk(page_content=chunk) for chunk in ranked[:k]]
