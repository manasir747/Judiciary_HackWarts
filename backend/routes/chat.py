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

    if request.document_id and not supabase_service.is_valid_document(request.document_id):
        raise HTTPException(status_code=404, detail="document_id not found")

    trigger_email_automation(None, reply, request.document_id)
    logger.info("[Chat] Answered query (doc_id=%s)", request.document_id)
    return ChatResponse(reply=reply)
