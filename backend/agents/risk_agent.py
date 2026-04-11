import logging
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from config.settings import get_settings
from agents.base import BaseAgent

logger = logging.getLogger(__name__)

class RiskItem(BaseModel):
    risk: str = Field(description="The identified legal or procedural risk")
    severity: str = Field(description="Severity: Low, Medium, or High")
    mitigation: str = Field(description="Brief suggestion to mitigate this risk")

class RiskAnalysis(BaseModel):
    risks: List[RiskItem]

class RiskAgent(BaseAgent):
    def __init__(self) -> None:
        settings = get_settings()
        super().__init__(model_name=settings.groq_gemma_model)

    async def run(self, text: str) -> Dict:
        logger.info("[RiskAgent] Analyzing legal risks...")
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are a Senior Legal Risk Auditor. Your task is to analyze legal documents for potential risks, "
             "liabilities, or procedural weaknesses. "
             "Respond ONLY with a valid JSON object matching this structure: "
             "{'risks': [{'risk': '...', 'severity': 'High/Medium/Low', 'mitigation': '...'}]}"),
            ("human", "Analyze the following legal text for risks:\n\n{text}")
        ])
        
        chain = prompt | self.llm
        response = await chain.ainvoke({"text": text})
        
        # Parse JSON from response
        try:
            import json
            import re
            content = response.content.strip()
            # Clean up potential markdown code blocks
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                content = match.group(0)
            data = json.loads(content)
            return data
        except Exception as e:
            logger.error("[RiskAgent] Failed to parse JSON: %s", str(e))
            return {"risks": []}
