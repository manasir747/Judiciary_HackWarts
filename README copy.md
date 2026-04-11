⚖️ LexAI – Intelligent Legal Assistance System
LexAI is an Agentic AI-powered legal assistant that helps users understand complex legal documents in seconds. It combines multi-agent reasoning, RAG-based Q&A, and a clean frontend experience to make legal information accessible to everyone.

🚀 Features
📄 Upload Legal Documents (PDF)
🧠 AI-Generated Summary
🧾 Plain English Explanation (10th-grade level)
⏳ Case Timeline Prediction
💬 Ask Questions (RAG-based Chat)
🤖 Multi-Agent AI System (Agentic Architecture)
🧠 Agentic AI Architecture
LexAI is powered by multiple AI agents working together:

Summarizer Agent → Extracts key legal facts
Simplifier Agent → Converts into simple language
Timeline Agent → Predicts case duration & stages
RAG Agent → Answers user queries from document context
Critic Agent → Validates outputs
🏗️ Tech Stack
Backend
Python + FastAPI
Anthropic Claude API
LangChain / LlamaIndex
ChromaDB (Vector Store)
PyMuPDF / pdfplumber
Frontend
React 18 + Vite
TailwindCSS + shadcn/ui
Axios
Zustand / Context API
📡 API Endpoints
POST /analyse
Upload a PDF and get:

Summary
Key points
Case type
Timeline estimate
POST /chat
Ask questions related to the document.

⚙️ Setup Instructions
1. Clone the repo
git clone <your-repo-url>
cd lexai
2. Backend Setup
cd backend
pip install -r requirements.txt
Create .env:

ANTHROPIC_API_KEY=your_api_key_here
Run server:

uvicorn main:app --reload
3. Frontend Setup
cd frontend
npm install
npm run dev
🧪 How to Use
Upload a legal document (PDF)

Click Analyse Document

View:

Summary
Timeline
Key insights
Ask questions in chat

🎯 Hackathon Goal
Make legal documents understandable in under 60 seconds
Demonstrate true agentic AI (not just a chatbot)
Provide a clean, intuitive UI for non-technical users
💡 Demo Tip
Show before vs after:

Complex legal text ➡️ Simple explanation + insights
📌 Future Improvements
Multi-language support
Real legal database integration
Case law recommendations
Voice-based interaction
🏆 Built for Hackathon 2026
Making legal clarity accessible for everyone.