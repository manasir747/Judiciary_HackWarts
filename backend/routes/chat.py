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
    supabase_service = getattr(app_request.app.state, "supabase_service", None)
    
    if orchestrator is None or supabase_service is None:
        raise HTTPException(status_code=500, detail="Dependencies are not configured")

    resolved_document_id = request.document_id
    has_supabase_client = bool(getattr(supabase_service, "client", None))

    if resolved_document_id and has_supabase_client and not supabase_service.is_valid_document(resolved_document_id):
        logger.warning("[Chat] document_id not found in Supabase, falling back to general chat: %s", resolved_document_id)
        resolved_document_id = None

    reply = await orchestrator.answer_question(resolved_document_id, request.message)
    trigger_email_automation(None, reply, resolved_document_id)
    logger.info("[Chat] Answered query (doc_id=%s)", resolved_document_id)
    return ChatResponse(reply=reply)
