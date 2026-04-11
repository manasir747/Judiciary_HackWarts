import logging

from langchain_core.prompts import ChatPromptTemplate

from agents.base import BaseAgent

logger = logging.getLogger(__name__)


class RAGAgent(BaseAgent):
    async def run(self, query: str, context_chunks: list[str]) -> str:
        logger.info("[RAG] Thinking...")
        
        context = "\n\n---\n\n".join(context_chunks) if context_chunks else "No document context available."
        
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are LexAI, a highly intelligent and professional legal assistant. "
                    "Use Markdown formatting for ALL responses to ensure they are professional and easy to read. "
                    "Use bullet points, numbered lists, and bold text where appropriate. "
                    "If document context is provided, prioritize it for answering questions. "
                    "If no context is provided or the question is general, answer professionally as a legal expert."
                ),
                (
                    "human",
                    "Context:\n{context}\n\nQuestion:\n{query}",
                ),
            ]
        )
        chain = prompt | self.llm
        response = await chain.ainvoke({"context": context, "query": query})
        return response.content.strip()
