import json
import logging
import re
from typing import Dict, List

from langchain_core.messages import HumanMessage, SystemMessage

from agents.base import BaseAgent
from config.settings import get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a Senior Strategic Legal Consultant. "
    "Based on a document summary and identified risks, provide a clear step-by-step action plan. "
    'Respond ONLY with valid JSON in this exact structure (no markdown, no extra text):\n'
    '{"next_steps": [{"step": "...", "priority": "Critical", "description": "..."}]}'
)


class StrategyAgent(BaseAgent):
    def __init__(self) -> None:
        settings = get_settings()
        super().__init__(model_name=settings.groq_gemma_model)

    async def run(self, summary: str, risks: List[Dict]) -> Dict:
        logger.info("[StrategyAgent] Formulating legal strategy using Gemma 2...")

        risks_text = "\n".join(
            [f"- {r.get('risk', '')} ({r.get('severity', '')})" for r in risks]
        ) or "No specific risks identified."

        human_text = (
            f"Case Summary:\n{summary}\n\n"
            f"Identified Risks:\n{risks_text}\n\n"
            "Formulate a prioritized legal strategy."
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
            steps = data.get("next_steps", [])
            logger.info("[StrategyAgent] Generated %d strategy steps.", len(steps))
            return {"next_steps": steps}

        except json.JSONDecodeError as e:
            logger.error("[StrategyAgent] JSON parse error: %s | Raw: %s", str(e), content[:300])
            return {"next_steps": []}
        except Exception as e:
            logger.error("[StrategyAgent] Unexpected error: %s", str(e))
            return {"next_steps": []}
