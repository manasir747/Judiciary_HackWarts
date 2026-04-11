import logging

from langchain_core.prompts import ChatPromptTemplate

from agents.base import BaseAgent
from utils.json_utils import extract_json_object

logger = logging.getLogger(__name__)


class SummarizerAgent(BaseAgent):
    async def run(self, text: str) -> dict:
        logger.info("[Summarizer] Extracting facts...")
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a legal summarization expert. Return STRICT JSON only with keys: document_type, facts, parties, legal_issue, judgment, key_points (array), summary.",
                ),
                (
                    "human",
                    "Analyze this legal document and extract structured information.\n\n{text}",
                ),
            ]
        )
        chain = prompt | self.llm
        response = await chain.ainvoke({"text": text[:30000]})
        try:
            data = extract_json_object(response.content)
        except ValueError:
            logger.warning("[Summarizer] Model returned non-JSON output, using fallback")
            data = {"summary": response.content.strip()}
        return {
            "document_type": data.get("document_type", "Legal Document"),
            "facts": data.get("facts", ""),
            "parties": data.get("parties", ""),
            "legal_issue": data.get("legal_issue", ""),
            "judgment": data.get("judgment", ""),
            "key_points": data.get("key_points", []),
            "summary": data.get("summary", ""),
        }
