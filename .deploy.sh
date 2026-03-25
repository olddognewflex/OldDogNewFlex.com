#!/usr/bin/env bash
set -euo pipefail
# --- Config (replace placeholders) ---
SSH_HOST="box.thedanielfactor.com"
SSH_USER="raymonddoran"
SSH_PORT=22
SSH_KEY="${HOME}/.ssh/miab_deploy_key"   # ensure correct perms
REMOTE_BASE="/home/user-data/www/olddognewflex.com"
DRY_RUN="${DRY_RUN:-false}"              # set DRY_RUN=true for validation
NODE_VERSION="${NODE_VERSION:-$(cat .nvmrc 2>/dev/null || node -v)}"
# -------------------------------------
#
log(){ printf '[%s] %s\n' "$(date +%T)" "$*"; }

need(){ command -v "$1" >/dev/null || { echo "Missing tool: $1"; exit 1; }; }
need ssh; need rsync; need npm; need node

log "Using Node ${NODE_VERSION}"
# Expect Node already installed to this version on runner/host
log "Installing deps"; npm ci
log "Building"; npm run build

REMOTE_RELEASE="${REMOTE_BASE}"
RSYNC_OPTS="-az --delete"
[[ "$DRY_RUN" == "true" ]] && RSYNC_OPTS="${RSYNC_OPTS} --dry-run"

log "Syncing dist/ to ${REMOTE_BASE}"
rsync ${RSYNC_OPTS} -e "ssh " dist/ "${SSH_HOST}:${REMOTE_RELEASE}/"

