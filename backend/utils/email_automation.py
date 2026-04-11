import os
import re
import logging
import threading
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from services.supabase_service import SupabaseService

logger = logging.getLogger(__name__)

def trigger_email_automation(user_id: str | None, ai_response: str, document_id: str | None = None):
    """
    Main entry point for email automation. 
    Spawns a background thread to ensure it's non-blocking.
    """
    if not ai_response:
        return

    # Run the actual work in a background thread to stay invisible and non-intrusive
    thread = threading.Thread(target=_process_email_automation, args=(user_id, ai_response, document_id))
    thread.daemon = True
    thread.start()

def _process_email_automation(user_id: str | None, ai_response: str, document_id: str | None):
    try:
        # 1. Extract summary section safely
        # Matches "SUMMARY:" followed by text until end of string or next major section
        summary_match = re.search(r"SUMMARY:\s*(.*)", ai_response, re.DOTALL | re.IGNORECASE)
        if not summary_match:
            return
        
        summary_text = summary_match.group(1).strip()
        if not summary_text:
            return

        supabase = SupabaseService()
        if not supabase.client:
            return

        # 2. Resolve user_id if missing (using document_id)
        if not user_id and document_id:
            # Try to find user_id from previous analysis of this document
            doc_query = supabase.client.table("documents_analysis").select("user_id").eq("document_id", document_id).limit(1).execute()
            if doc_query.data and len(doc_query.data) > 0:
                user_id = doc_query.data[0].get("user_id")

        if not user_id:
            return

        # 3. Fetch user email from Supabase
        user_query = supabase.client.table("users").select("email").eq("id", user_id).execute()
        
        if not user_query.data or len(user_query.data) == 0:
            logger.warning(f"[EmailAutomation] User {user_id} not found in 'users' table.")
            return
            
        user_email = user_query.data[0].get("email")
        if not user_email:
            return

        # 4. Send email using SendGrid
        api_key = os.environ.get("SENDGRID_API_KEY")
        if not api_key:
            logger.warning("[EmailAutomation] SENDGRID_API_KEY missing.")
            return

        message = Mail(
            from_email="noreply@yourdomain.com", # Must be verified sender
            to_emails=user_email,
            subject="Your Legal Summary",
            html_content=f"<h2>Summary</h2><pre>{summary_text}</pre>"
        )

        sg = SendGridAPIClient(api_key)
        sg.send(message)
        logger.info(f"[EmailAutomation] Summary sent to {user_email}")

    except Exception as e:
        # Safety rule: fail silently
        logger.error(f"[EmailAutomation] Error: {str(e)}")
