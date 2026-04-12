import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from utils.email_automation import trigger_email_automation
logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["chat"])


class ChatRequest(BaseModel):
    document_id: str | None = None
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, app_request: Request):
    orchestrator = getattr(app_request.app.state, "orchestrator", None)
    document_service = getattr(app_request.app.state, "document_service", None)
    
    if orchestrator is None or document_service is None:
        raise HTTPException(status_code=500, detail="Dependencies are not configured")

    resolved_document_id = request.document_id
    document_text = None

    if resolved_document_id:
        document_text = document_service.get_document_text(resolved_document_id)
        if not document_text:
            logger.warning("[Chat] document_id not found in memory, falling back to general chat: %s", resolved_document_id)
            resolved_document_id = None

    reply = await orchestrator.answer_question(document_text, request.message)
    logger.info("[Chat] Answered query (doc_id=%s)", resolved_document_id)
    return ChatResponse(reply=reply)
