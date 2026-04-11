import logging

from langchain_core.prompts import ChatPromptTemplate

from agents.base import BaseAgent

logger = logging.getLogger(__name__)


class SimplifierAgent(BaseAgent):
    async def run(self, summary: str) -> str:
        logger.info("[Simplifier] Simplifying...")
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Rewrite legal content in plain English for a 10th-grade student. Keep it accurate and concise.",
                ),
                ("human", "Simplify this legal summary:\n\n{summary}"),
            ]
        )
        chain = prompt | self.llm
        response = await chain.ainvoke({"summary": summary})
        return response.content.strip()
