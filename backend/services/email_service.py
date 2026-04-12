import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self) -> None:
        logger.info("[EmailService] Email functionality is disabled.")

    def send_report(self, to_email: str, analysis: dict) -> bool:
        logger.info("[EmailService] send_report called but email is disabled for %s", to_email)
        return True
