import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import get_settings
from routes.analyse import router as analyse_router
from routes.chat import router as chat_router
from services.document_service import DocumentService
from services.orchestrator import AgentOrchestrator
from services.vector_store import VectorStoreService
from services.supabase_service import SupabaseService
from services.email_service import EmailService
from utils.logger import setup_logging

setup_logging()
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s in %s mode", settings.app_name, settings.app_env)

    vector_store = VectorStoreService()
    supabase_service = SupabaseService()
    document_service = DocumentService(vector_store)
    orchestrator = AgentOrchestrator(vector_store)
    email_service = EmailService()

    app.state.vector_store = vector_store
    app.state.document_service = document_service
    app.state.orchestrator = orchestrator
    app.state.supabase_service = supabase_service
    app.state.email_service = email_service

    yield

    logger.info("Shutting down %s", settings.app_name)


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Document-Id"],
)


@app.exception_handler(Exception)
async def global_exception_handler(_request: Request, exc: Exception):
    logger.exception("Unhandled exception: %s", str(exc))
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": settings.app_name}

@app.post("/send-report")
async def send_report(data: dict, request: Request):
    email = data.get("email")
    analysis = data.get("analysis")
    if not email or not analysis:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Missing email or data")
    
    success = request.app.state.email_service.send_report(email, analysis)
    if success:
        return {"status": "success"}
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Failed to send email")


app.include_router(analyse_router)
app.include_router(chat_router)
