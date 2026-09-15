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
DEPLOY_DIR="$SCRIPT_DIR/.deploy/myfamilyassistant"

FTP_HOST="${FTP_HOST:-mesonsoft.com}"
FTP_PORT="${FTP_PORT:-21}"
FTP_PATH="${FTP_PATH:-/myfamilyassistant.ai}"
FTP_USER="${FTP_USER:-}"
FTP_PASS="${FTP_PASS:-}"
SITE_URL="${SITE_URL:-https://myfamilyassistant.ai}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    print_error "Required command not found: $command_name"
    exit 1
  fi
}

build_local_manifest() {
  local manifest_path="$1"

  DEPLOY_DIR="$DEPLOY_DIR" MANIFEST_PATH="$manifest_path" python3 - <<'PY'
import hashlib
import os
from pathlib import Path

deploy_dir = Path(os.environ["DEPLOY_DIR"])
manifest_path = Path(os.environ["MANIFEST_PATH"])
rows = []

for file_path in sorted(p for p in deploy_dir.rglob("*") if p.is_file()):
    rel = file_path.relative_to(deploy_dir).as_posix()
    if rel == "myfamilyassistant-deploy-manifest.sha256":
        continue

    h = hashlib.sha256()
    with file_path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    rows.append(f"{rel}\t{h.hexdigest()}\n")

manifest_path.write_text("".join(rows), encoding="utf-8")
PY
}

build_changed_files_list() {
  local local_manifest="$1"
  local remote_manifest="$2"
  local changed_list="$3"

  LOCAL_MANIFEST="$local_manifest" REMOTE_MANIFEST="$remote_manifest" CHANGED_LIST="$changed_list" python3 - <<'PY'
import os
from pathlib import Path

local_manifest = Path(os.environ["LOCAL_MANIFEST"])
remote_manifest = Path(os.environ["REMOTE_MANIFEST"])
changed_list = Path(os.environ["CHANGED_LIST"])

def parse_manifest(path: Path) -> dict:
  if not path.exists():
    return {}
  rows = {}
  for line in path.read_text(encoding="utf-8").splitlines():
    if not line.strip() or "\t" not in line:
      continue
    rel, digest = line.split("\t", 1)
    rows[rel.strip()] = digest.strip()
  return rows

local_rows = parse_manifest(local_manifest)
remote_rows = parse_manifest(remote_manifest)

changed = sorted(
  rel for rel, digest in local_rows.items()
  if remote_rows.get(rel) != digest
)

changed_list.write_text("\n".join(changed) + ("\n" if changed else ""), encoding="utf-8")
PY
}

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
#    Note: .env.local takes precedence, so we temporarily move it to ensure
#    .env.production is used.
# ------------------------------------------------------------------------------
print_info "Writing frontend/.env.production (API base)"
printf 'NEXT_PUBLIC_API_BASE=%s\n' "$API_BASE" > "$FRONTEND_DIR/.env.production"

# Temporarily move .env.local to prevent it from overriding .env.production
env_local_backup=""
if [[ -f "$FRONTEND_DIR/.env.local" ]]; then
  env_local_backup="$FRONTEND_DIR/.env.local.backup.$$"
  print_info "Temporarily moving .env.local to use .env.production during build..."
  mv "$FRONTEND_DIR/.env.local" "$env_local_backup"
fi

print_info "Building Next.js frontend (static export)"
cd "$FRONTEND_DIR"
npm run build

# Restore .env.local if we backed it up
if [[ -n "$env_local_backup" && -f "$env_local_backup" ]]; then
  mv "$env_local_backup" "$FRONTEND_DIR/.env.local"
  print_info "Restored .env.local"
fi

# Verify the API URL actually landed in the bundle — the #1 silent failure mode
# Check in the out directory (which contains both HTML and JS bundles)
if ! grep -rqF "$API_BASE" "$FRONTEND_DIR/out" 2>/dev/null; then
  print_error "API base was NOT baked into the build output. Build verification FAILED."
  print_error "Expected to find: $API_BASE"
  print_error "Check: .env.production and next.config.js for output configuration"
  exit 1
fi
print_success "Build verified: API base ($API_BASE) baked into bundle"

# Prepare deployment directory with rsync checksum sync
print_info "Preparing deployment directory with checksum sync..."
mkdir -p "$DEPLOY_DIR"
require_command rsync
rsync -a --checksum --delete "$FRONTEND_DIR/out/" "$DEPLOY_DIR/"
print_success "Deployment directory prepared"

# ------------------------------------------------------------------------------
# 6. Upload to GoDaddy via FTP using checksum-based incremental uploads
# ------------------------------------------------------------------------------
print_info "Uploading to GoDaddy FTP: $FTP_HOST:$FTP_PATH"
require_command lftp
require_command python3

tmp_dir="$(mktemp -d)"
local_manifest="$tmp_dir/local-manifest.sha256"
remote_manifest="$tmp_dir/remote-manifest.sha256"
changed_list="$tmp_dir/changed-files.txt"
delta_dir="$tmp_dir/upload-delta"
cache_manifest="$SCRIPT_DIR/.deploy/last-deploy-manifest.sha256"
mkdir -p "$(dirname "$cache_manifest")"

build_local_manifest "$local_manifest"

# Fetch the previously-uploaded manifest to compute a checksum diff
for mf in myfamilyassistant-deploy-manifest.sha256 .deploy-manifest.sha256; do
  lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -p "$FTP_PORT" \
    -e "set ftp:passive-mode true; set ftp:ssl-allow no; set cmd:fail-exit no; get /$mf -o $remote_manifest; bye" \
    >/dev/null 2>&1 || true
  [[ -s "$remote_manifest" ]] && break
done

# Fall back to the locally cached last-deploy manifest if the remote is empty
if [[ ! -s "$remote_manifest" && -s "$cache_manifest" ]]; then
  cp "$cache_manifest" "$remote_manifest"
fi

build_changed_files_list "$local_manifest" "$remote_manifest" "$changed_list"

changed_count="$(wc -l < "$changed_list" | tr -d ' ')"

if [[ "$changed_count" == "0" ]]; then
  print_success "No content changes detected; nothing to upload"
  rm -rf "$tmp_dir"
else
  print_info "Uploading $changed_count changed/new file(s) to GoDaddy based on checksum diff..."

  mkdir -p "$delta_dir"
  (
    cd "$DEPLOY_DIR"
    rsync -a --files-from="$changed_list" ./ "$delta_dir/"
  )
  cp "$local_manifest" "$delta_dir/myfamilyassistant-deploy-manifest.sha256"

  lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -p "$FTP_PORT" \
    -e "set ftp:passive-mode true; set ftp:ssl-allow no; mirror -R --verbose $delta_dir /; bye"

  # Record this deployment so the next run only uploads changed files
  cp "$local_manifest" "$cache_manifest"

  print_success "GoDaddy upload completed"
fi

rm -rf "$tmp_dir"

# ------------------------------------------------------------------------------
# 7. Post-deploy smoke test (warning only — hosting may throttle fresh files)
# ------------------------------------------------------------------------------
print_info "Post-deploy smoke test..."
SITE_CODE="$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$SITE_URL" || echo 000)"
if [[ "$SITE_CODE" == "200" ]]; then
  print_success "Live site: OK ($SITE_URL)"
else
  echo "WARNING: Live site returned HTTP $SITE_CODE at $SITE_URL (check manually)."
fi

print_success "Deployment completed"

