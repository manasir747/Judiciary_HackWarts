import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["analysis"])




class TimelineStage(BaseModel):
    stage: str
    description: str

class RiskItem(BaseModel):
    risk: str
    severity: str
    mitigation: str

class StrategyStep(BaseModel):
    step: str
    priority: str
    description: str

class Scenario(BaseModel):
    scenario: str
    probability: str
    reasoning: str


class AnalyseResponse(BaseModel):
    document_id: str
    document_type: str
    summary: str
    key_points: list[str]
    risks: list[RiskItem]
    strategy: list[StrategyStep]
    simulations: list[Scenario]
    case_type: str
    timeline_estimate: str
    timeline_stages: list[TimelineStage]


@router.post("/analyse", response_model=AnalyseResponse)
async def analyse_document(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    request: Request = None,
):
    if request is None:
        raise HTTPException(status_code=500, detail="Request context unavailable")

    document_service = getattr(request.app.state, "document_service", None)
    orchestrator = getattr(request.app.state, "orchestrator", None)
    supabase_service = getattr(request.app.state, "supabase_service", None)
    
    if document_service is None or orchestrator is None or supabase_service is None:
        raise HTTPException(status_code=500, detail="Dependencies are not configured")

    document_id, text, _chunks = await document_service.ingest_pdf(file)
    
    # Check Supabase Cache first
    cached_result = supabase_service.get_analysis(document_id)
    # Only use cache if it was generated with the new agents (must have risks, strategy, and simulations)
    if cached_result and all(k in cached_result for k in ["risks", "strategy", "simulations"]):
        logger.info("[Analyse] Cache hit (Supabase) for document_id=%s", document_id)
        return JSONResponse(content=cached_result, headers={"X-Document-Id": document_id})

    # If not in cache, run analysis
    result = await orchestrator.analyse(text)

    response = AnalyseResponse(
        document_id=document_id,
        document_type=result.get("document_type", "Legal Document"),
        summary=result.get("summary", ""),
        key_points=result.get("key_points", []),
        risks=result.get("risks", []),
        strategy=result.get("strategy", []),
        simulations=result.get("simulations", []),
        case_type=result.get("case_type", "civil"),
        timeline_estimate=result.get("timeline_estimate", "Unknown"),
        timeline_stages=result.get("timeline_stages", []),
    )

    data = response.model_dump()
    
    # Persist to Supabase
    supabase_service.save_analysis(user_id, document_id, file.filename, data)
    
    logger.info("[Analyse] Completed and persisted to Supabase for doc_id=%s", document_id)
    return JSONResponse(content=data, headers={"X-Document-Id": document_id})
