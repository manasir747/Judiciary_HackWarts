from agents.input_processor_agent import InputProcessorAgent
from agents.critic_agent import CriticAgent
from agents.risk_agent import RiskAgent
from agents.simulator_agent import SimulatorAgent
from agents.strategy_agent import StrategyAgent
from agents.simplifier_agent import SimplifierAgent
from agents.summarizer_agent import SummarizerAgent
from agents.timeline_agent import TimelineAgent


async def generate_response_from_text(document_text: str):
    from langchain_groq import ChatGroq
    from config.settings import get_settings
    from langchain_core.prompts import ChatPromptTemplate
    
    settings = get_settings()
    llm = ChatGroq(
        groq_api_key=settings.groq_api_key,
        model=settings.groq_model,
        temperature=0,
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a legal AI assistant. Provide clear summaries and insights based on the document if provided. Be concise and accurate."),
        ("user", "{text}")
    ])
    chain = prompt | llm
    
    # Strictly limit the text slice to prevent context window overflow bounds checking
    response = await chain.ainvoke({"text": document_text[:60000]})
    return response.content

class AgentOrchestrator:
    def __init__(self) -> None:
        self.input_processor = InputProcessorAgent()
        self.summarizer = SummarizerAgent()
        self.simplifier = SimplifierAgent()
        self.timeline = TimelineAgent()
        self.risk_agent = RiskAgent()
        self.strategy_agent = StrategyAgent()
        self.simulator_agent = SimulatorAgent()
        self.critic = CriticAgent()

    async def analyse(self, document_text: str) -> dict:
        processed_data = await self.input_processor.run(document_text)
        clean_text = processed_data.get("processed_input", {}).get("clean_text", document_text)
        
        import asyncio
        # 1. Start with Analyst (Summary) and Timeline in parallel
        # These are the foundations
        summary_data, timeline_data = await asyncio.gather(
            self.summarizer.run(clean_text),
            self.timeline.run(clean_text)
        )
        summary_txt = summary_data.get("summary", "")

        # 2. Parallelize everything else that depends on the summary
        # Risk, Strategy, Simulation, and Simplification can all run at once
        results = await asyncio.gather(
            self.risk_agent.run(clean_text, summary_txt),
            self.strategy_agent.run(summary_txt, []), # Strategy can run independently in parallel now
            self.simulator_agent.run(summary_txt, []), # Simulator can run independently in parallel now
            self.simplifier.run(summary_txt)
        )
        
        risk_data, strategy_data, simulation_data, simplified_summary = results
        
        risks_list = risk_data.get("risks", [])
        next_steps = strategy_data.get("next_steps", [])
        scenarios = simulation_data.get("scenarios", [])


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

    async def answer_question(self, document_text: str | None, message: str) -> str:
        query_text = message.strip() or message

        full_text = (document_text or "").strip()
        if full_text:
            prompt_text = f"Document Text:\n{full_text}\n\nUser Query:\n{query_text}"
        else:
            prompt_text = query_text

        return await generate_response_from_text(prompt_text)
