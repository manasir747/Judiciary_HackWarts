import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["analysis"])


document_registry: dict[str, dict] = {}


class TimelineStage(BaseModel):
    stage: str
    description: str


class AnalyseResponse(BaseModel):
    document_type: str
    summary: str
    key_points: list[str]
    case_type: str
    timeline_estimate: str
    timeline_stages: list[TimelineStage]


@router.post("/analyse", response_model=AnalyseResponse)
async def analyse_document(
    file: UploadFile = File(...),
    request: Request = None,
):
    if request is None:
        raise HTTPException(status_code=500, detail="Request context unavailable")

    document_service = getattr(request.app.state, "document_service", None)
    orchestrator = getattr(request.app.state, "orchestrator", None)
    if document_service is None or orchestrator is None:
        raise HTTPException(status_code=500, detail="Dependencies are not configured")

    document_id, text, _chunks = await document_service.ingest_pdf(file)
    result = await orchestrator.analyse(text)

    document_registry[document_id] = {
        "document_type": result.get("document_type", "Legal Document"),
        "case_type": result.get("case_type", "civil"),
    }

    logger.info("[Analyse] Completed for document_id=%s", document_id)

    response = AnalyseResponse(
        document_type=result.get("document_type", "Legal Document"),
        summary=result.get("summary", ""),
        key_points=result.get("key_points", []),
        case_type=result.get("case_type", "civil"),
        timeline_estimate=result.get("timeline_estimate", "Unknown"),
        timeline_stages=result.get("timeline_stages", []),
    )

    return JSONResponse(content=response.model_dump(), headers={"X-Document-Id": document_id})
