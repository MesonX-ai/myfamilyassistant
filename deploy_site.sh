#!/bin/bash
#
# MyFamilyAssistant — Frontend (GoDaddy) + Backend (AWS) deployment
#
# Builds the Next.js static export with the AWS API Gateway URL baked in,
# verifies the backend is healthy, then mirrors the site to GoDaddy via FTP.
#
# Usage:
#   ./deploy_site.sh                  # full: git push + build + upload
#   SKIP_GIT=1 ./deploy_site.sh       # build + upload only
#   API_BASE=https://... ./deploy_site.sh   # override backend endpoint
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
TF_DIR="$SCRIPT_DIR/terraform-low-cost"

FTP_HOST="${FTP_HOST:-mesonsoft.com}"
FTP_PORT="${FTP_PORT:-21}"
FTP_PATH="${FTP_PATH:-/myfamilyassistant.ai}"
FTP_USER="${FTP_USER:-}"
FTP_PASS="${FTP_PASS:-}"
SITE_URL="${SITE_URL:-https://myfamilyassistant.ai}"

echo "=== MyFamilyAssistant Frontend Deployment ($(date '+%Y-%m-%d %H:%M:%S')) ==="

# ------------------------------------------------------------------------------
# 1. Resolve the AWS backend API endpoint
#    Priority: $API_BASE env var > Terraform output (source of truth)
# ------------------------------------------------------------------------------
if [[ -z "${API_BASE:-}" ]] && [[ -f "$TF_DIR/main.tf" ]]; then
  API_BASE="$(terraform -chdir="$TF_DIR" output -raw api_endpoint 2>/dev/null || true)"
fi
if [[ -z "${API_BASE:-}" ]]; then
  echo "ERROR: Backend API endpoint unknown."
  echo "  - Run terraform apply in $TF_DIR first, or"
  echo "  - Set API_BASE=https://<api-id>.execute-api.us-east-2.amazonaws.com"
  exit 1
fi
echo "Backend API: $API_BASE"

# ------------------------------------------------------------------------------
# 2. Resolve FTP credentials — never hardcoded in this script.
#    Priority: env vars > ftp-config.json (repo-external, untracked)
# ------------------------------------------------------------------------------
FTP_CONFIG="${FTP_CONFIG:-$SCRIPT_DIR/../ftp-config.json}"
if [[ -z "$FTP_USER" || -z "$FTP_PASS" ]] && [[ -f "$FTP_CONFIG" ]]; then
  CREDS="$(python3 - "$FTP_CONFIG" <<'PYEOF'
import json, sys
for site in json.load(open(sys.argv[1])):
    if site.get("name") == "MyFamilyAssistant":
        print(site.get("username", ""), site.get("password", ""))
        break
PYEOF
)"
  FTP_USER="${FTP_USER:-$(echo "$CREDS" | awk '{print $1}')}"
  FTP_PASS="${FTP_PASS:-$(echo "$CREDS" | awk '{print $2}')}"
fi
if [[ -z "$FTP_USER" || -z "$FTP_PASS" ]]; then
  echo "ERROR: FTP credentials not found (set FTP_USER/FTP_PASS or ftp-config.json)."
  exit 1
fi

# ------------------------------------------------------------------------------
# 3. Pre-deploy backend health check (fail fast before building/uploading)
# ------------------------------------------------------------------------------
HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$API_BASE/api/v1/pipeline/execute-canvas" || echo 000)"
if [[ "$HTTP_CODE" == "000" ]]; then
  echo "ERROR: Backend at $API_BASE is unreachable (no response). Aborting."
  exit 1
fi
echo "Backend health: reachable (HTTP $HTTP_CODE)"

# ------------------------------------------------------------------------------
# 4. Git: commit and push all changes (skippable for quick iterations)
# ------------------------------------------------------------------------------
if [[ "${SKIP_GIT:-0}" != "1" ]]; then
  echo "=== Git: commit and push changes ==="
  cd "$SCRIPT_DIR"
  git add -A
  if git diff --cached --quiet; then
    echo "No changes to commit."
  else
    git commit -m "Deploy: update MyFamilyAssistant frontend ($(date '+%Y-%m-%d %H:%M:%S'))"
    git push origin main
  fi
else
  echo "=== Git: skipped (SKIP_GIT=1) ==="
fi

# ------------------------------------------------------------------------------
# 5. Build Next.js static export with the AWS API URL baked in.
#    Static export inlines NEXT_PUBLIC_* at build time, so the frontend
#    connects to the AWS backend with no runtime config on GoDaddy.
# ------------------------------------------------------------------------------
echo "=== Writing frontend/.env.production (API base) ==="
printf 'NEXT_PUBLIC_API_BASE=%s\n' "$API_BASE" > "$FRONTEND_DIR/.env.production"

echo "=== Build Next.js frontend (static export) ==="
cd "$FRONTEND_DIR"
npm run build

# Verify the API URL actually landed in the bundle — the #1 silent failure mode
if ! grep -rqF "$API_BASE" "$FRONTEND_DIR/out/_next/static" 2>/dev/null; then
  echo "ERROR: API base was NOT baked into the build output. Aborting rather than deploying a broken site."
  exit 1
fi
echo "Build verified: API base present in bundle."

# ------------------------------------------------------------------------------
# 6. Upload to GoDaddy via FTP (mirror --reverse also removes deleted files)
# ------------------------------------------------------------------------------
echo "=== Upload to GoDaddy FTP: $FTP_HOST:$FTP_PATH ==="
if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp is required but not installed. Install with: brew install lftp"
  exit 1
fi

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -p "$FTP_PORT" <<EOF
set ftp:passive-mode true
set ssl:verify-certificate no
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

# ------------------------------------------------------------------------------
# 7. Post-deploy smoke test (warning only — hosting may throttle fresh files)
# ------------------------------------------------------------------------------
echo "=== Post-deploy smoke test ==="
SITE_CODE="$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$SITE_URL" || echo 000)"
if [[ "$SITE_CODE" == "200" ]]; then
  echo "Live site: OK ($SITE_URL)"
else
  echo "WARNING: Live site returned HTTP $SITE_CODE at $SITE_URL (check manually)."
fi

echo "=== Deployment complete ==="

