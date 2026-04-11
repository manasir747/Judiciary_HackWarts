#!/usr/bin/env bash
set -e

PORT="${BACKEND_PORT:-8000}"
PIDS=$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)

if [ -n "$PIDS" ]; then
  echo "[backend] Releasing port $PORT from existing process(es): $PIDS"
  kill -9 $PIDS || true
fi

exec ./.venv/bin/uvicorn main:app --reload --host 127.0.0.1 --port "$PORT"
