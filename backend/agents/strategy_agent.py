import logging
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from agents.base import BaseAgent
from config.settings import get_settings

logger = logging.getLogger(__name__)

class StrategyStep(BaseModel):
    step: str = Field(description="The recommended action step")
    priority: str = Field(description="Priority: Critical, Standard, or Long-term")
    description: str = Field(description="Explanation of why this step is necessary")

class LegalStrategy(BaseModel):
    next_steps: List[StrategyStep]

class StrategyAgent(BaseAgent):
    def __init__(self) -> None:
        settings = get_settings()
        super().__init__(model_name=settings.groq_gemma_model)

    async def run(self, summary: str, risks: List[Dict]) -> Dict:
        logger.info("[StrategyAgent] Formulating legal strategy using Gemma 2...")
        
        risks_text = "\n".join([f"- {r.get('risk')} ({r.get('severity')})" for r in risks])
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are a Senior Strategic Legal Consultant. Based on a document summary and identified risks, "
             "provide a clear, step-by-step action plan. "
             "Respond ONLY with a valid JSON object matching this structure: "
             "{'next_steps': [{'step': '...', 'priority': '...', 'description': '...'}]}"),
            ("human", "Summary:\n{summary}\n\nIdentified Risks:\n{risks}\n\nFormulate a strategy:")
        ])
        
        chain = prompt | self.llm
        response = await chain.ainvoke({"summary": summary, "risks": risks_text})
        
        try:
            import json
            import re
            content = response.content.strip()
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                content = match.group(0)
            return json.loads(content)
        except Exception as e:
            logger.error("[StrategyAgent] Failed to parse JSON: %s", str(e))
            return {"next_steps": []}
