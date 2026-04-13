import json
import logging
import re
from typing import Dict, List
from agents.base import BaseAgent
from config.settings import get_settings
from langchain_core.messages import HumanMessage, SystemMessage

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a Senior Legal Strategy & Outcome Simulator. "
    "Based on the provided case summary and risks, perform TWO tasks at once:\n"
    "1. Formulate a prioritized step-by-step legal strategy.\n"
    "2. Simulate 3 potential legal outcomes based on that strategy.\n\n"
    "Respond ONLY with valid JSON in this structure:\n"
    "{\n"
    "  \"next_steps\": [{\"step\": \"...\", \"priority\": \"Critical\", \"description\": \"...\"}],\n"
    "  \"scenarios\": [{\"scenario\": \"...\", \"probability\": \"High\", \"reasoning\": \"...\"}]\n"
    "}"
)

class NexusAgent(BaseAgent):
    def __init__(self, provider: str = "google") -> None:
        super().__init__(provider=provider)

    async def run(self, summary: str, risks: List[Dict]) -> Dict:
        logger.info("[NexusAgent] Synthesizing Strategy and Simulations at once...")
        
        risks_text = "\n".join([f"- {r.get('risk', '')} ({r.get('severity', '')})" for r in risks]) or "No specifically identified risks."
        
        human_text = (
            f"Case Summary Context:\n{summary}\n\n"
            f"Identified Risks:\n{risks_text}\n\n"
            "Generate the strategic roadmap and outcome simulations together."
        )

        try:
            response = await self.llm.ainvoke([SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=human_text)])
            content = response.content.strip()
            
            # Clean JSON
            content = re.sub(r"^```(?:json)?", "", content, flags=re.MULTILINE).strip()
            content = re.sub(r"```$", "", content, flags=re.MULTILINE).strip()
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match: content = match.group(0)
            
            data = json.loads(content)
            return {
                "next_steps": data.get("next_steps", []),
                "scenarios": data.get("scenarios", [])
            }
        except Exception as e:
            logger.error("[NexusAgent] Error: %s", str(e))
            return {"next_steps": [], "scenarios": []}
