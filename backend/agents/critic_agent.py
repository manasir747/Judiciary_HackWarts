import logging

from langchain_core.messages import HumanMessage, SystemMessage

from agents.base import BaseAgent
from utils.json_utils import extract_json_object

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a strict QA critic for a legal AI assistant. "
    "Review the provided summary for clarity, accuracy, and legal correctness. "
    'Respond ONLY with valid JSON: {"verdict": "pass", "improved_summary": "...", "notes": "..."}\n'
    'If the summary is acceptable, set verdict to "pass" and copy it unchanged into improved_summary. '
    'If it needs improvement, set verdict to "fail" and provide a better version in improved_summary.'
)


class CriticAgent(BaseAgent):
    async def run(self, payload: dict) -> dict:
        logger.info("[Critic] Validating output quality...")

        summary = payload.get("summary", "")
        if not summary:
            return payload

        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"Review this legal summary:\n\n{summary}"),
        ]

        try:
            response = await self.llm.ainvoke(messages)
            data = extract_json_object(response.content)

            # ONLY update summary — never replace the full payload
            if data.get("verdict", "pass").lower() == "fail":
                improved = data.get("improved_summary", "").strip()
                if improved:
                    payload["summary"] = improved
                    payload["critic_notes"] = data.get("notes", "")
                    logger.info("[Critic] Summary improved by critic.")
            else:
                logger.info("[Critic] Summary passed QA check.")

        except (ValueError, Exception) as e:
            logger.warning("[Critic] Skipping rewrite — %s", str(e))

        # Always return the full payload untouched (except possibly summary)
        return payload
