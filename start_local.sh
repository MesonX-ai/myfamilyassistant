#!/bin/bash

# Launch the Agentic Workflow Platform locally: backend (FastAPI + LangGraph)
# on a free high port and the Next.js canvas on another free high port, then
# open it in the browser.
#
# Uses non-default ports (8731/4231 and up) because this environment shadows
# localhost:8000 and localhost:3000 with other local servers.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Shutting down local servers..."
  [ -n "${BACKEND_PID:-}" ] && kill "${BACKEND_PID}" 2>/dev/null || true
  [ -n "${FRONTEND_PID:-}" ] && kill "${FRONTEND_PID}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

find_free_port() {
  local port="$1"
  while (echo > "/dev/tcp/127.0.0.1/${port}") >/dev/null 2>&1; do
    port=$((port + 1))
  done
  echo "$port"
}

wait_for_port() {
  local host="$1" port="$2" name="$3" tries="${4:-90}"
  for ((i = 1; i <= tries; i++)); do
    if (echo > "/dev/tcp/${host}/${port}") >/dev/null 2>&1; then
      echo "  $name is up on http://${host}:${port}"
      return 0
    fi
    sleep 1
  done
  echo "  Timed out waiting for $name on ${host}:${port} (see logs)"
  return 1
}

BACKEND_PORT="$(find_free_port 8731)"
FRONTEND_PORT="$(find_free_port 4231)"

echo "==> Cleaning up any previous local backend instance..."
pkill -f "uvicorn app.main:app" 2>/dev/null || true
sleep 1

echo "==> Starting backend (FastAPI + LangGraph) on :${BACKEND_PORT}"
cd "$BACKEND_DIR"
if [ ! -d .venv ]; then
  echo "  creating python venv..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
. .venv/bin/activate
pip install -q -r requirements.txt
uvicorn app.main:app --port "$BACKEND_PORT" >/tmp/agentic-backend.log 2>&1 &
BACKEND_PID=$!

echo "==> Starting frontend (Next.js canvas) on :${FRONTEND_PORT}"
cd "$FRONTEND_DIR"
[ -d node_modules ] || npm install >/tmp/agentic-frontend-install.log 2>&1
export NEXT_PUBLIC_API_BASE="http://localhost:${BACKEND_PORT}"
npm run dev -- --port "$FRONTEND_PORT" >/tmp/agentic-frontend.log 2>&1 &
FRONTEND_PID=$!

echo "==> Waiting for services..."
wait_for_port 127.0.0.1 "$BACKEND_PORT" "backend"  || true
wait_for_port 127.0.0.1 "$FRONTEND_PORT" "frontend" || true

echo ""
echo "Agentic Workflow Platform is running:"
echo "  Frontend : http://localhost:${FRONTEND_PORT}"
echo "  Backend  : http://localhost:${BACKEND_PORT}/docs"
echo "  Logs     : /tmp/agentic-backend.log  /tmp/agentic-frontend.log"
echo "Press Ctrl-C to stop both servers."

URL="http://localhost:${FRONTEND_PORT}"
case "$OSTYPE" in
  darwin*) open "$URL" >/dev/null 2>&1 || true ;;
  linux*)  xdg-open "$URL" >/dev/null 2>&1 || true ;;
  *)       echo "Open $URL in your browser." ;;
esac

wait
