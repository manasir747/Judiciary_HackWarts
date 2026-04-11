import logging
from supabase import create_client, Client
from config.settings import get_settings

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_key:
            logger.warning("Supabase credentials missing. Persistence disabled.")
            self.client = None
        else:
            self.client: Client = create_client(settings.supabase_url, settings.supabase_key)
            logger.info("Supabase client initialized.")

    def save_analysis(self, user_id: str, document_id: str, file_name: str, analysis: dict) -> None:
        if not self.client:
            return
        
        try:
            # Matching your 'documents_analysis' table columns
            data = {
                "user_id": user_id,
                "document_id": document_id,
                "file_name": file_name,
                "document_type": analysis.get("document_type", "Legal Document"),
                "summary": analysis.get("summary", ""),
                "key_points": analysis.get("key_points", []),
                "risks": analysis.get("risks", []),
                "strategy": analysis.get("strategy", []),
                "simulations": analysis.get("simulations", []),
                "case_type": analysis.get("case_type", "civil"),
                "timeline_estimate": analysis.get("timeline_estimate", "Unknown"),
                "timeline_stages": analysis.get("timeline_stages", []),
            }
            # We use document_id check or just insert. 
            # If you want to avoid duplicates for the same user/file, we can upsert by document_id if you add a unique constraint.
            self.client.table("documents_analysis").insert(data).execute()
            logger.info("[Supabase] Saved analysis for %s in documents_analysis", document_id)
        except Exception as e:
            logger.error("[Supabase] Failed to save analysis: %s", str(e))

    def get_analysis(self, document_id: str) -> dict | None:
        if not self.client:
            return None
            
        try:
            # Look up by document_id (the hash)
            response = self.client.table("documents_analysis").select("*").eq("document_id", document_id).order("created_at", desc=True).limit(1).execute()
            if response.data and len(response.data) > 0:
                row = response.data[0]
                logger.info("[Supabase] Found analysis for %s", document_id)
                # Reconstruct the analysis object for the frontend
                return {
                    "document_type": row.get("document_type"),
                    "summary": row.get("summary"),
                    "key_points": row.get("key_points"),
                    "risks": row.get("risks"),
                    "strategy": row.get("strategy"),
                    "simulations": row.get("simulations"),
                    "case_type": row.get("case_type"),
                    "timeline_estimate": row.get("timeline_estimate"),
                    "timeline_stages": row.get("timeline_stages"),
                }
        except Exception as e:
            logger.error("[Supabase] Failed to fetch analysis: %s", str(e))
        return None

    def is_valid_document(self, document_id: str) -> bool:
        if not self.client:
            return False
            
        try:
            response = self.client.table("documents_analysis").select("document_id").eq("document_id", document_id).execute()
            return len(response.data) > 0
        except Exception:
            return False
