#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy.config.local"

SERVER_USER="vignesh"
SERVER_HOST="199.192.19.46"
REMOTE_PATH="~/react-projects/developer-portfolio"

if [ -f "$CONFIG_FILE" ]; then
  # shellcheck source=/dev/null
  source "$CONFIG_FILE"
fi

BUILD_DIR="$SCRIPT_DIR/build"
UPLOAD_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --upload-only) UPLOAD_ONLY=true ;;
  esac
done

SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "${SSHPASS:-}" ] && command -v sshpass &>/dev/null; then
  export SSHPASS
  SSH=(sshpass -e ssh "${SSH_OPTS[@]}")
  RSYNC_SSH="sshpass -e ssh -o StrictHostKeyChecking=accept-new"
else
  SSH=(ssh "${SSH_OPTS[@]}")
  RSYNC_SSH="ssh -o StrictHostKeyChecking=accept-new"
fi

if [ "$UPLOAD_ONLY" = false ]; then
  echo "==> Building project..."
  cd "$SCRIPT_DIR"
  npm run build
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: build folder not found. Run without --upload-only to build first."
  exit 1
fi

echo "==> Uploading to ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH} ..."

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE_PATH}"
rsync -avz --delete \
  -e "$RSYNC_SSH" \
  "$BUILD_DIR/" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/"

echo "==> Deploy complete."
