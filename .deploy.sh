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
need ssh; need rsync; need pnpm; need node

log "Using Node ${NODE_VERSION}"
# Expect Node already installed to this version on runner/host
# pnpm-lock.yaml is the lockfile this project actually develops against.
# `npm ci` used to run here against a stale package-lock.json that pinned
# astro 5.16.9 while package.json asks for ^7.0.9 — every deploy would have
# built the site on the wrong major. package-lock.json has been removed.
log "Installing deps"; CI=true pnpm install --frozen-lockfile
log "Building"; pnpm build

REMOTE_RELEASE="${REMOTE_BASE}"
# Affinity Photo sources and macOS metadata are not web assets. --delete-excluded
# also clears any that earlier deploys already published.
RSYNC_EXCLUDES=(--exclude='.DS_Store' --exclude='*.afphoto')
RSYNC_OPTS="-az --delete --delete-excluded"
[[ "$DRY_RUN" == "true" ]] && RSYNC_OPTS="${RSYNC_OPTS} --dry-run"

log "Syncing dist/ to ${REMOTE_BASE}"
# Note: SSH_USER, SSH_PORT and SSH_KEY above are not used — the sync relies on
# your ssh config/agent for ${SSH_HOST}. Left as-is because that is what works;
# the key path in SSH_KEY does not exist on this machine.
rsync ${RSYNC_OPTS} "${RSYNC_EXCLUDES[@]}" -e "ssh " dist/ "${SSH_HOST}:${REMOTE_RELEASE}/"

