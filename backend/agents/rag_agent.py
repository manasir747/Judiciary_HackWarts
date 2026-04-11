import logging

from langchain_core.prompts import ChatPromptTemplate

from agents.base import BaseAgent

logger = logging.getLogger(__name__)


class RAGAgent(BaseAgent):
    async def run(self, query: str, context_chunks: list[str]) -> str:
        logger.info("[RAG] Retrieving context...")
        if not context_chunks:
            return "I could not find relevant context in this uploaded document."

        context = "\n\n---\n\n".join(context_chunks)
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a legal Q&A assistant. Answer using ONLY the provided context. If context lacks answer, say you don't know based on document.",
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
