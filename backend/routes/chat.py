import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from routes.analyse import document_registry

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["chat"])


class ChatRequest(BaseModel):
    document_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, app_request: Request):
    orchestrator = getattr(app_request.app.state, "orchestrator", None)
    if orchestrator is None:
        raise HTTPException(status_code=500, detail="Dependencies are not configured")

    if request.document_id not in document_registry:
        raise HTTPException(status_code=404, detail="document_id not found")

    reply = await orchestrator.answer_question(request.document_id, request.message)
    logger.info("[Chat] Answered query for document_id=%s", request.document_id)
    return ChatResponse(reply=reply)
