from agents.critic_agent import CriticAgent
from agents.rag_agent import RAGAgent
from agents.simplifier_agent import SimplifierAgent
from agents.summarizer_agent import SummarizerAgent
from agents.timeline_agent import TimelineAgent
from services.vector_store import VectorStoreService


class AgentOrchestrator:
    def __init__(self, vector_store: VectorStoreService) -> None:
        self.summarizer = SummarizerAgent()
        self.simplifier = SimplifierAgent()
        self.timeline = TimelineAgent()
        self.rag = RAGAgent()
        self.critic = CriticAgent()
        self.vector_store = vector_store

    async def analyse(self, document_text: str) -> dict:
        summary_data = await self.summarizer.run(document_text)
        simplified = await self.simplifier.run(summary_data.get("summary", ""))
        timeline_data = await self.timeline.run(document_text)

        draft = {
            "document_type": summary_data.get("document_type", "Legal Document"),
            "summary": simplified,
            "key_points": summary_data.get("key_points", []),
            "case_type": timeline_data.get("case_type", "civil"),
            "timeline_estimate": timeline_data.get("timeline_estimate", "Unknown"),
            "timeline_stages": timeline_data.get("timeline_stages", []),
        }

        reviewed = await self.critic.run(draft)
        return reviewed

    async def answer_question(self, document_id: str, message: str) -> str:
        docs = self.vector_store.retrieve(document_id=document_id, query=message, k=4)
        chunks = [doc.page_content for doc in docs]
        return await self.rag.run(message, chunks)
