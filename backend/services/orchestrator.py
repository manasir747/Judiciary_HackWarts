from agents.input_processor_agent import InputProcessorAgent
from agents.critic_agent import CriticAgent
from agents.rag_agent import RAGAgent
from agents.simplifier_agent import SimplifierAgent
from agents.summarizer_agent import SummarizerAgent
from agents.timeline_agent import TimelineAgent
from services.vector_store import VectorStoreService


class AgentOrchestrator:
    def __init__(self, vector_store: VectorStoreService) -> None:
        self.input_processor = InputProcessorAgent()
        self.summarizer = SummarizerAgent()
        self.simplifier = SimplifierAgent()
        self.timeline = TimelineAgent()
        self.rag = RAGAgent()
        self.critic = CriticAgent()
        self.vector_store = vector_store

    async def analyse(self, document_text: str) -> dict:
        # Preprocess input (Must be first)
        processed_data = await self.input_processor.run(document_text)
        clean_text = processed_data.get("processed_input", {}).get("clean_text", document_text)
        
        # Run Summarizer and Timeline in parallel as they are independent
        import asyncio
        summary_task = self.summarizer.run(clean_text)
        timeline_task = self.timeline.run(clean_text)
        
        summary_data, timeline_data = await asyncio.gather(summary_task, timeline_task)
        
        # Simplifier depends on summary results
        simplified = await self.simplifier.run(summary_data.get("summary", ""))

        draft = {
            "document_type": summary_data.get("document_type", "Legal Document"),
            "summary": simplified,
            "key_points": summary_data.get("key_points", []),
            "case_type": timeline_data.get("case_type", "civil"),
            "timeline_estimate": timeline_data.get("timeline_estimate", "Unknown"),
            "timeline_stages": timeline_data.get("timeline_stages", []),
            "input_metadata": {
                "input_type": processed_data.get("processed_input", {}).get("input_type", "UNKNOWN"),
                "language": processed_data.get("processed_input", {}).get("language", "Unknown"),
                "confidence": processed_data.get("processed_input", {}).get("confidence", 0.0),
            }
        }

        # Critic runs last to review the final draft
        reviewed = await self.critic.run(draft)
        return reviewed

    async def answer_question(self, document_id: str | None, message: str) -> str:
        # Preprocess question
        processed_data = await self.input_processor.run(message)
        clean_message = processed_data.get("processed_input", {}).get("clean_text", message)
        
        chunks = []
        if document_id:
            docs = self.vector_store.retrieve(document_id=document_id, query=clean_message, k=4)
            chunks = [doc.page_content for doc in docs]
        
        return await self.rag.run(clean_message, chunks)
