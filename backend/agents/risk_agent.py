import json
import logging
import re
from typing import Dict, List

from langchain_core.messages import HumanMessage, SystemMessage

from agents.base import BaseAgent
from config.settings import get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a Senior Legal Risk Auditor. "
    "Analyze legal documents for risks, liabilities, or procedural weaknesses. "
    "Use the provided summary to focus on key concern areas. "
    'Respond ONLY with valid JSON in this exact structure (no markdown, no extra text):\n'
    '{"risks": [{"risk": "...", "severity": "High", "mitigation": "..."}]}'
)


class RiskAgent(BaseAgent):
    def __init__(self, provider: str = "groq") -> None:
        super().__init__(provider=provider)

    async def run(self, text: str, summary: str = "") -> Dict:
        logger.info("[RiskAgent] Analyzing legal risks with Gemma 2...")

        # Build messages directly — no template parsing, no curly-brace issues
        human_text = f"Summary context:\n{summary}\n\nFull legal text:\n{text[:6000]}"
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=human_text),
        ]

        try:
            response = await self.llm.ainvoke(messages)
            content = response.content.strip()

            # Strip markdown code fences if present
            content = re.sub(r"^```(?:json)?", "", content, flags=re.MULTILINE).strip()
            content = re.sub(r"```$", "", content, flags=re.MULTILINE).strip()

            # Extract the first JSON object
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                content = match.group(0)

            data = json.loads(content)
            risks = data.get("risks", [])
            logger.info("[RiskAgent] Identified %d risks.", len(risks))
            return {"risks": risks}

        except json.JSONDecodeError as e:
            logger.error("[RiskAgent] JSON parse error: %s | Raw: %s", str(e), content[:300])
            return {"risks": []}
        except Exception as e:
            logger.error("[RiskAgent] Unexpected error: %s", str(e))
            return {"risks": []}
