import hashlib
import logging
from fastapi import UploadFile, HTTPException

from config.settings import get_settings
from utils.pdf_parser import extract_text_from_pdf
from utils.text import chunk_text
from services.vector_store import VectorStoreService

logger = logging.getLogger(__name__)


class DocumentService:
    def __init__(self, vector_store: VectorStoreService) -> None:
        self.vector_store = vector_store
        self.settings = get_settings()

    async def ingest_pdf(self, file: UploadFile) -> tuple[str, str, list[str]]:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        payload = await file.read()
        max_size = self.settings.max_pdf_size_mb * 1024 * 1024
        if len(payload) > max_size:
            raise HTTPException(status_code=400, detail=f"PDF exceeds {self.settings.max_pdf_size_mb}MB limit")

        document_id = hashlib.sha1(payload).hexdigest()[:16]
        text = extract_text_from_pdf(payload)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        chunks = chunk_text(text, self.settings.chunk_size, self.settings.chunk_overlap)
        logger.info("[Ingest] Parsed %s chunks for document %s", len(chunks), document_id)
        self.vector_store.add_document_chunks(document_id, chunks)

        return document_id, text, chunks
