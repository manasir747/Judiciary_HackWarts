import json
import logging
import re
from typing import Dict, List

from langchain_core.messages import HumanMessage, SystemMessage

from agents.base import BaseAgent
from config.settings import get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a Predictive Legal Analyst. "
    "Based on a case summary and a proposed legal strategy, simulate 3 potential legal outcomes. "
    'Respond ONLY with valid JSON in this exact structure (no markdown, no extra text):\n'
    '{"scenarios": [{"scenario": "...", "probability": "High", "reasoning": "..."}]}'
)


class SimulatorAgent(BaseAgent):
    def __init__(self, provider: str = "groq") -> None:
        super().__init__(provider=provider)

    async def run(self, summary: str, strategy: List[Dict]) -> Dict:
        logger.info("[SimulatorAgent] Running legal simulations using Gemma 2...")

        strategy_text = "\n".join(
            [f"- {s.get('step', '')}" for s in strategy]
        ) or "No specific strategy provided."

        human_text = (
            f"Case Summary:\n{summary}\n\n"
            f"Proposed Strategy:\n{strategy_text}\n\n"
            "Simulate 3 potential legal outcomes."
        )

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

            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                content = match.group(0)

            data = json.loads(content)
            scenarios = data.get("scenarios", [])
            logger.info("[SimulatorAgent] Generated %d scenarios.", len(scenarios))
            return {"scenarios": scenarios}

        except json.JSONDecodeError as e:
            logger.error("[SimulatorAgent] JSON parse error: %s | Raw: %s", str(e), content[:300])
            return {"scenarios": []}
        except Exception as e:
            logger.error("[SimulatorAgent] Unexpected error: %s", str(e))
            return {"scenarios": []}
