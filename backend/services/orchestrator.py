from agents.input_processor_agent import InputProcessorAgent
from agents.critic_agent import CriticAgent
from agents.risk_agent import RiskAgent
from agents.simplifier_agent import SimplifierAgent
from agents.summarizer_agent import SummarizerAgent
from agents.timeline_agent import TimelineAgent
from agents.nexus_agent import NexusAgent


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
        
        # Unified Strategic Engine
        self.nexus = NexusAgent(provider="google")
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
            self.nexus.run(summary_txt, []), 
            self.simplifier.run(summary_txt)
        )
        
        risk_data, nexus_data, simplified_summary = results
        
        risks_list = risk_data.get("risks", [])
        next_steps = nexus_data.get("next_steps", [])
        scenarios = nexus_data.get("scenarios", [])


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

        # Final Assembly (Bypassing Critic for speed and stability)
        return draft

async def generate_response_from_gemma(document_text: str):
    from langchain_openai import ChatOpenAI
    from config.settings import get_settings
    from langchain_core.prompts import ChatPromptTemplate
    
    settings = get_settings()
    if not settings.gemma_api_key:
        # Fallback to current groq method if no gemma key
        return await generate_response_from_text(document_text)
        
    llm = ChatOpenAI(
        model=settings.gemma_model,
        openai_api_key=settings.gemma_api_key,
        base_url=settings.openrouter_base_url,
        temperature=0.7, # Higher temperature for better conversation
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are LexAI, a professional legal assistant. Use the provided document text to answer the user's question. If the document is not relevant, use your general legal knowledge but be clear about it."),
        ("user", "{text}")
    ])
    chain = prompt | llm
    
    response = await chain.ainvoke({"text": document_text[:30000]})
    return response.content

    async def answer_question(self, document_text: str | None, message: str) -> str:
        query_text = message.strip() or message

        full_text = (document_text or "").strip()
        if full_text:
            prompt_text = f"Document Text:\n{full_text}\n\nUser Query:\n{query_text}"
        else:
            prompt_text = query_text

        # Using Gemma for the Legal Assistant
        return await generate_response_from_gemma(prompt_text)
