import logging

from langchain_core.prompts import ChatPromptTemplate

from agents.base import BaseAgent
from utils.json_utils import extract_json_object

logger = logging.getLogger(__name__)


TIMELINE_RULES = {
    "civil": {
        "timeline_estimate": "3-7 years",
        "timeline_stages": [
            {"stage": "Filing", "description": "Plaint is filed and admitted by the court."},
            {"stage": "Notice & Reply", "description": "Defendant receives notice and files written statement."},
            {"stage": "Evidence", "description": "Parties submit documents and witness examination."},
            {"stage": "Arguments", "description": "Final arguments are heard."},
            {"stage": "Judgment", "description": "Court pronounces final order."},
        ],
    },
    "criminal": {
        "timeline_estimate": "2-5 years",
        "timeline_stages": [
            {"stage": "FIR/Complaint", "description": "Police complaint or FIR registration."},
            {"stage": "Investigation", "description": "Collection of evidence and charge sheet."},
            {"stage": "Trial", "description": "Charges framed, witnesses examined, cross-examined."},
            {"stage": "Arguments", "description": "Prosecution and defense present final submissions."},
            {"stage": "Judgment", "description": "Court convicts/acquits and may pass sentence."},
        ],
    },
    "property": {
        "timeline_estimate": "4-10 years",
        "timeline_stages": [
            {"stage": "Title Pleadings", "description": "Title dispute and claims are filed."},
            {"stage": "Document Scrutiny", "description": "Revenue and title records are examined."},
            {"stage": "Evidence", "description": "Oral and documentary evidence is recorded."},
            {"stage": "Arguments", "description": "Legal ownership and possession arguments heard."},
            {"stage": "Judgment", "description": "Final decree on title/possession passed."},
        ],
    },
}


class TimelineAgent(BaseAgent):
    def _detect_case_type(self, text: str) -> str:
        corpus = text.lower()
        if any(token in corpus for token in ["fir", "accused", "bail", "ipc", "criminal"]):
            return "criminal"
        if any(token in corpus for token in ["property", "title", "possession", "land", "deed"]):
            return "property"
        return "civil"

    async def run(self, text: str) -> dict:
        logger.info("[Timeline] Predicting...")
        case_type = self._detect_case_type(text)
        mapped = TIMELINE_RULES[case_type]

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You explain legal timeline estimates in Indian judiciary context. Return JSON with keys: case_type, llm_reasoning.",
                ),
                (
                    "human",
                    "Case text (short):\n{content}\n\nRule-based estimate: {estimate}. Explain why this estimate is reasonable.",
                ),
            ]
        )
        chain = prompt | self.llm
        response = await chain.ainvoke(
            {"content": text[:8000], "estimate": mapped["timeline_estimate"]}
        )
        try:
            reasoning_data = extract_json_object(response.content)
            llm_reasoning = reasoning_data.get("llm_reasoning", "Based on case complexity and court process.")
        except ValueError:
            logger.warning("[Timeline] Model returned non-JSON output, using fallback")
            llm_reasoning = response.content.strip() or "Based on case complexity and court process."

        return {
            "case_type": case_type,
            "timeline_estimate": mapped["timeline_estimate"],
            "timeline_stages": mapped["timeline_stages"],
            "llm_reasoning": llm_reasoning,
        }
