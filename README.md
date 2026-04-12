# LexAI — Agentic Legal Intelligence Platform

A multi-agent legal intelligence dashboard that ingests legal documents (FIRs, court orders, contracts) and delivers high-fidelity, actionable legal analysis in seconds using a graph-based agent orchestrator.

This repository contains the full-stack LexAI prototype: a FastAPI backend that runs the multi-agent orchestrator and a React + Vite frontend that visualizes agent workflows and renders interactive briefs.

## Key ideas

- Agentic architecture: specialized agents run in parallel and communicate via a DAG to analyze and synthesize document-grounded legal reasoning.
- Document grounding: uploaded PDFs are parsed, normalized, and kept as a secure, queryable state so chat and analysis remain tightly anchored to the source document.
- Cost-aware caching: identical documents are detected and cached (Supabase) to avoid repeated LLM inference.
- UX-first pipeline: the frontend visualizes agent progress, making introspection and auditability straightforward for legal users.

## Core agents

The backend orchestrator composes several focused agents (see `backend/agents`):

- Input Processor Agent — cleans OCR noise and classifies the document type (Criminal, Civil, Contract, etc.).
- Analyst Agent — extracts facts, parties, dates, and produces a simplified summary.
- Judicial Timeline Agent — maps procedural stages and estimates timelines.
- Risk Assessment Agent — finds liabilities, evidentiary gaps, and ranks issues by severity.
- Strategic Planner Agent — produces phase-by-phase playbooks for defense or prosecution.
- Simulation Engine — runs stochastic simulations to estimate outcome probabilities.
- Conversational Critic Agent — retains deep context for focused Q&A after analysis.

## Tech stack

- Backend: Python, FastAPI
- Agents / Orchestration: custom agent code (see `backend/agents`) + LLM provider integration
- Frontend: React 18, Vite, Tailwind CSS, Framer Motion
- Database / Auth: Supabase (Postgres + Auth)
- Vector & caching: Supabase / in-memory vector states

## Quick local setup

Make sure you have Python 3.10+ and Node.js (16+). This is a minimal guide to run the prototype locally.

1) Backend

- Copy environment template:

```bash
cp backend/.env.example backend/.env
# Fill in GROQ_API_KEY, SUPABASE_URL, SUPABASE_KEY, and any other keys
```

- Install Python dependencies and run the API (recommended to use a virtualenv):

```bash
cd backend
# create and activate virtualenv if you like
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

By default the FastAPI server listens on the port configured in `backend/main.py` (or the environment).

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the dev URL printed by Vite (typically http://localhost:5173).

## Environment variables

The backend expects (at minimum) the following in `backend/.env`:

- GROQ_API_KEY — API key for the LLM provider
- SUPABASE_URL — Supabase project URL
- SUPABASE_KEY — Supabase REST/DB key
- (Optional) Other keys used in `backend/config/settings.py`

If you use the `.env.example` shipped, copy it and paste your values.

## Project structure (important files)

- `backend/` — FastAPI server, agents, services, and orchestration code
  - `backend/main.py` — entry point for the API
  - `backend/agents/` — agent implementations (Input Processor, Analyst, Risk, etc.)
  - `backend/services/` — external integrations (Supabase, vector store, email)
- `frontend/frontend/` — React app (Vite) and components
  - `frontend/frontend/src` — UI components and pages
- `docs/` — design & architecture notes

## Development notes & suggestions

- The orchestrator uses an in-memory state to keep the uploaded document indexed and grounded; ensure memory limits are acceptable for your dataset during testing.
- Supabase is used for caching and persistence; confirm your keys and row-level policies when deploying.
- LLM usage is potentially expensive — use caching and hashed-document checks to avoid duplicate inference.

## Tests

This prototype contains a basic `test/` React test setup for the frontend UI. Backend unit tests are not included by default — consider adding pytest-based tests for the key agents and services.

## Contributing

- Open an issue for new features or bugs.
- For larger changes, create a branch `feature/your-topic` and open a PR against `main`.
- Keep changes small and add tests for new behavior when possible.

## License

This repository does not include an explicit license file. Add a `LICENSE` file if you wish to make the project open-source.

## Contact

Questions or collaboration ideas? Check `docs/architecture.md` for context and architecture diagrams, or open an issue in this repo.

---

A compact summary of what changed

- Replaced the original marketing-focused README with a concise, developer-friendly README containing: project overview, agent list, tech stack, quick local setup, environment variables, project map, and contribution guidance.