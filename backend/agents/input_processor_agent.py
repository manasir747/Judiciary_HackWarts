import logging
from langchain_core.prompts import ChatPromptTemplate
from agents.base import BaseAgent
from utils.json_utils import extract_json_object

logger = logging.getLogger(__name__)

class InputProcessorAgent(BaseAgent):
    async def run(self, input_data: str) -> dict:
        logger.info("[InputProcessor] Preprocessing user input...")
        
        system_prompt = (
            "You are an Input Processor Agent in a multi-agent Legal AI system.\n\n"
            "Your responsibility is STRICTLY LIMITED to preprocessing user input.\n\n"
            "You MUST ONLY perform the following tasks:\n\n"
            "1. Clean and normalize the raw user input:\n"
            "   - Remove slang, noise, emojis, repetition, and unnecessary punctuation\n"
            "   - Convert into clear, professional, legally understandable language\n"
            "   - Do NOT add new facts or assumptions\n\n"
            "2. Detect the input type:\n"
            "   - FIR\n"
            "   - CASE\n"
            "   - QUERY\n"
            "   - DOCUMENT\n"
            "   - If uncertain, return \"UNKNOWN\"\n\n"
            "3. Detect language:\n"
            "   - English\n"
            "   - Hindi\n"
            "   - Hinglish\n"
            "   - If uncertain, return \"Unknown\"\n\n"
            "4. Preserve original meaning EXACTLY\n"
            "   - Do NOT interpret legal implications\n"
            "   - Do NOT summarize beyond cleaning\n"
            "   - Do NOT infer missing details\n\n"
            "---\n\n"
            "STRICT SYSTEM RULES (CRITICAL):\n\n"
            "- DO NOT extract legal sections\n"
            "- DO NOT perform case analysis\n"
            "- DO NOT generate timeline\n"
            "- DO NOT calculate risk\n"
            "- DO NOT predict outcomes\n"
            "- DO NOT suggest legal strategy\n"
            "- DO NOT simulate scenarios\n"
            "- DO NOT validate or criticize output\n\n"
            "- DO NOT modify, remove, or overwrite any existing fields in the input payload\n"
            "- DO NOT create or rename keys outside your scope\n\n"
            "You are ONLY responsible for creating ONE new field:\n"
            "\"processed_input\"\n\n"
            "---\n\n"
            "OUTPUT FORMAT (STRICT JSON ONLY):\n\n"
            "{{\n"
            "  \"processed_input\": {{\n"
            "    \"clean_text\": \"...\",\n"
            "    \"input_type\": \"...\",\n"
            "    \"language\": \"...\",\n"
            "    \"confidence\": 0.0\n"
            "  }}\n"
            "}}\n\n"
            "---\n\n"
            "CONSTRAINTS:\n\n"
            "- Output MUST be valid JSON\n"
            "- No explanations, no markdown, no extra text\n"
            "- If input is unclear, set fields to \"UNKNOWN\" and confidence low\n"
            "- Be deterministic and consistent"
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "INPUT:\n{input}"),
            ]
        )

        chain = prompt | self.llm
        response = await chain.ainvoke({"input": input_data})
        
        try:
            data = extract_json_object(response.content)
            # Ensure the specific key is present, fallback otherwise
            if "processed_input" not in data:
                 raise ValueError("Key 'processed_input' missing in model output")
            return data
        except Exception as e:
            logger.warning("[InputProcessor] Error parsing model output: %s", str(e))
            return {
                "processed_input": {
                    "clean_text": input_data,
                    "input_type": "UNKNOWN",
                    "language": "Unknown",
                    "confidence": 0.1
                }
            }
