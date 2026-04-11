import logging

from langchain_core.prompts import ChatPromptTemplate

from agents.base import BaseAgent
from utils.json_utils import extract_json_object

logger = logging.getLogger(__name__)


class CriticAgent(BaseAgent):
    async def run(self, payload: dict) -> dict:
        logger.info("[Critic] Validating output quality...")
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a strict QA critic. Validate legal assistant output for clarity, consistency, and correctness. Return JSON keys: verdict (pass/fail), improved_summary, notes.",
                ),
                ("human", "Review this payload:\n{payload}"),
            ]
        )
        chain = prompt | self.llm
        response = await chain.ainvoke({"payload": str(payload)})
        try:
            data = extract_json_object(response.content)
        except ValueError:
            logger.warning("[Critic] Model returned non-JSON output, skipping critic rewrite")
            return payload

        if data.get("verdict", "pass").lower() == "pass":
            return payload

        improved_summary = data.get("improved_summary") or payload.get("summary", "")
        payload["summary"] = improved_summary
        payload["critic_notes"] = data.get("notes", "No notes")
        return payload
