#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

FTP_HOST="mesonsoft.com"
FTP_PORT="21"
FTP_USER="mesonsoft@mesonsoft.com"
FTP_PASS="Rena!ssancE3"
FTP_PATH="/public_html/myfamilyassistant.ai"

echo "=== MyFamilyAssistant Frontend Deployment ==="

echo "=== Git: commit and push changes ==="
cd "$SCRIPT_DIR"
git add -A
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Deploy: update MyFamilyAssistant frontend ($(date +%Y-%m-%d\ %H:%M:%S))"
  git push origin main
fi

echo "=== Build Next.js frontend (static export) ==="
cd "$FRONTEND_DIR"
npm run build

echo "=== Upload to GoDaddy FTP: $FTP_HOST:$FTP_PATH ==="
if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp is required but not installed. Install with: brew install lftp"
  exit 1
fi

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -p "$FTP_PORT" <<EOF
set ftp:passive-mode true
set net:max-retries 3
set net:reconnect-interval-base 5
mirror --reverse --verbose=3 --only-newer \
  --exclude-glob .git/* \
  --exclude-glob node_modules/* \
  --exclude-glob .next/* \
  --exclude-glob .DS_Store \
  "$FRONTEND_DIR/out" "$FTP_PATH"
bye
EOF

echo "=== Deployment complete ==="
