import asyncio
import logging
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from agents.input_processor_agent import InputProcessorAgent

async def test_input_agent():
    agent = InputProcessorAgent()
    
    test_inputs = [
        "Pls help me with my FIR... i am so stressed!! 😭😭 it's about a theft in my house in Delhi. 🏠",
        "FIR No. 123/2024, Police Station Vasant Kunj. The complainant states that on 10.04.2024 at 10:00 PM...",
        "What is the penalty for section 302 of IPC?",
        "This is a formal case file regarding the property dispute between Sharma and Verma.",
        "fhgkdshfgksdjhgfkjsdh kjsdhfkjsdh" # Total noise
    ]
    
    for text in test_inputs:
        print(f"\n--- Testing Input ---\nRaw: {text}")
        result = await agent.run(text)
        print(f"Processed: {result}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(test_input_agent())
