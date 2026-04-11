from agents.input_processor_agent import InputProcessorAgent
from agents.critic_agent import CriticAgent
from agents.rag_agent import RAGAgent
from agents.risk_agent import RiskAgent
from agents.simulator_agent import SimulatorAgent
from agents.strategy_agent import StrategyAgent
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
        self.risk_agent = RiskAgent()
        self.strategy_agent = StrategyAgent()
        self.simulator_agent = SimulatorAgent()
        self.rag = RAGAgent()
        self.critic = CriticAgent()
        self.vector_store = vector_store

    async def analyse(self, document_text: str) -> dict:
        processed_data = await self.input_processor.run(document_text)
        clean_text = processed_data.get("processed_input", {}).get("clean_text", document_text)
        
        import asyncio
        # 1. Start with Analyst (Summary) and Timeline in parallel
        summary_task = self.summarizer.run(clean_text)
        timeline_task = self.timeline.run(clean_text)
        summary_data, timeline_data = await asyncio.gather(summary_task, timeline_task)
        summary_txt = summary_data.get("summary", "")

        # 2. Risk Agent depends on Analyst Summary
        risk_data = await self.risk_agent.run(clean_text, summary_txt)
        risks_list = risk_data.get("risks", [])
        
        # 3. Strategy depends on Summary AND Risks
        strategy_data = await self.strategy_agent.run(summary_txt, risks_list)
        next_steps = strategy_data.get("next_steps", [])

        # 4. Simulation depends on Summary AND Strategy
        simulation_data = await self.simulator_agent.run(summary_txt, next_steps)
        scenarios = simulation_data.get("scenarios", [])

        # 5. Simplifier (Final Polish for UI)
        simplified_summary = await self.simplifier.run(summary_txt)


        draft = {
            "document_id": "", # Placeholder, will be filled by route
            "document_type": summary_data.get("document_type", "Legal Document"),
            "summary": simplified_summary,
            "key_points": summary_data.get("key_points", []),
            "risks": risks_list,
            "strategy": next_steps,
            "simulations": scenarios,
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
        query_text = message.strip() or message
        
        chunks = []
        if document_id:
            docs = self.vector_store.retrieve(document_id=document_id, query=query_text, k=4)
            chunks = [doc.page_content for doc in docs]
            import logging
            logging.getLogger(__name__).info("[Chat] Retrieved %s chunks for doc_id %s", len(chunks), document_id)
        
        return await self.rag.run(query_text, chunks)
