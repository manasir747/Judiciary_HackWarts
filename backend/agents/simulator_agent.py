import logging
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from agents.base import BaseAgent
from config.settings import get_settings

logger = logging.getLogger(__name__)

class Scenario(BaseModel):
    scenario: str = Field(description="The potential legal outcome or scenario")
    probability: str = Field(description="Likelihood: High, Moderate, or Low")
    reasoning: str = Field(description="Why this outcome might occur")

class SimulationResult(BaseModel):
    scenarios: List[Scenario]

class SimulatorAgent(BaseAgent):
    def __init__(self) -> None:
        settings = get_settings()
        super().__init__(model_name=settings.groq_gemma_model)

    async def run(self, summary: str, strategy: List[Dict]) -> Dict:
        logger.info("[SimulatorAgent] Running legal simulations using Gemma 2...")
        
        strategy_text = "\n".join([f"- {s.get('step')}" for s in strategy])
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are a Predictive Legal Analyst. Based on a case summary and a proposed legal strategy, "
             "simulate 3 potential outcomes (Scenarios). "
             "Respond ONLY with a valid JSON object matching this structure: "
             "{'scenarios': [{'scenario': '...', 'probability': '...', 'reasoning': '...'}]}"),
            ("human", "Case Summary:\n{summary}\n\nProposed Strategy:\n{strategy}\n\nSimulate outcomes:")
        ])
        
        chain = prompt | self.llm
        response = await chain.ainvoke({"summary": summary, "strategy": strategy_text})
        
        try:
            import json
            import re
            content = response.content.strip()
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                content = match.group(0)
            return json.loads(content)
        except Exception as e:
            logger.error("[SimulatorAgent] Failed to parse JSON: %s", str(e))
            return {"scenarios": []}
