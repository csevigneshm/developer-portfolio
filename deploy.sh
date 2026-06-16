#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy.config.local"
BACKEND_DIR="$SCRIPT_DIR/backend"
PYTHON_BACKEND_DIR="$SCRIPT_DIR/python-BE"

SERVER_USER="vignesh"
SERVER_HOST="199.192.19.46"
REMOTE_PATH="~/react-projects/developer-portfolio"

if [ -f "$CONFIG_FILE" ]; then
  # shellcheck source=/dev/null
  source "$CONFIG_FILE"
fi

BUILD_DIR="$SCRIPT_DIR/build"
UPLOAD_ONLY=false
DEPLOY_BACKEND=""
DEPLOY_PYTHON_BACKEND=""
FRONTEND_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --upload-only) UPLOAD_ONLY=true ;;
    --with-backend) DEPLOY_BACKEND="yes" ;;
    --with-python-backend) DEPLOY_PYTHON_BACKEND="yes" ;;
    --frontend-only) FRONTEND_ONLY=true ;;
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

if [ "$FRONTEND_ONLY" = true ]; then
  DEPLOY_BACKEND="no"
  DEPLOY_PYTHON_BACKEND="no"
else
  if [ -z "$DEPLOY_BACKEND" ]; then
    echo ""
    read -r -p "Node backend (contact API) changes also done? (y/n): " backend_answer
    case "$backend_answer" in
      y|Y|yes|Yes|YES) DEPLOY_BACKEND="yes" ;;
      *) DEPLOY_BACKEND="no" ;;
    esac
  fi

  if [ -z "$DEPLOY_PYTHON_BACKEND" ]; then
    echo ""
    read -r -p "Python backend (RAG chatbot) changes also done? (y/n): " python_backend_answer
    case "$python_backend_answer" in
      y|Y|yes|Yes|YES) DEPLOY_PYTHON_BACKEND="yes" ;;
      *) DEPLOY_PYTHON_BACKEND="no" ;;
    esac
  fi
fi

if [ "$UPLOAD_ONLY" = false ]; then
  echo "==> Building frontend..."
  cd "$SCRIPT_DIR"
  npm run build
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: build folder not found. Run without --upload-only to build first."
  exit 1
fi

echo "==> Uploading frontend to ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH} ..."

"${SSH[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE_PATH}/backend ${REMOTE_PATH}/python-BE"
rsync -avz --delete \
  -f 'P backend/' \
  -f 'P python-BE/' \
  -e "$RSYNC_SSH" \
  "$BUILD_DIR/" \
  "${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/"

if [ "$DEPLOY_BACKEND" = "yes" ]; then
  if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: backend folder not found at $BACKEND_DIR"
    exit 1
  fi

  echo "==> Uploading Node backend to ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/backend ..."
  rsync -avz \
    --exclude node_modules \
    --exclude .env \
    --exclude '*.log' \
    -e "$RSYNC_SSH" \
    "$BACKEND_DIR/" \
    "${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/backend/"
fi

if [ "$DEPLOY_PYTHON_BACKEND" = "yes" ]; then
  if [ ! -d "$PYTHON_BACKEND_DIR" ]; then
    echo "Error: python-BE folder not found at $PYTHON_BACKEND_DIR"
    exit 1
  fi

  echo "==> Uploading Python backend to ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/python-BE ..."
  rsync -avz \
    --exclude rag-env \
    --exclude .env \
    --exclude __pycache__ \
    --exclude '*/__pycache__' \
    --exclude '*.pyc' \
    --exclude data/questionsandvectors.json \
    -e "$RSYNC_SSH" \
    "$PYTHON_BACKEND_DIR/" \
    "${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/python-BE/"
fi

echo ""
echo "==> Deploy complete."

if [ "$DEPLOY_BACKEND" = "yes" ]; then
  echo ""
  echo "------------------------------------------------------------------"
  echo "  Node backend files uploaded. Please run these commands ON THE SERVER:"
  echo ""
  echo "  cd ~/react-projects/developer-portfolio/backend"
  echo "  npm install --production"
  echo "  pm2 start ecosystem.config.js    # first time only"
  echo "  pm2 restart portfolio-contact-api   # if already running"
  echo "  pm2 save"
  echo "------------------------------------------------------------------"
  echo ""
fi

if [ "$DEPLOY_PYTHON_BACKEND" = "yes" ]; then
  echo ""
  echo "------------------------------------------------------------------"
  echo "  Python backend files uploaded. Please run these commands ON THE SERVER:"
  echo ""
  echo "  cd ~/react-projects/developer-portfolio/python-BE"
  echo "  cp .env.example .env    # first time only, then add OPENAI_API_KEY"
  echo "  python3 -m venv rag-env    # first time only"
  echo "  source rag-env/bin/activate"
  echo "  pip install -r requirements.txt"
  echo "  pm2 start rag-env/bin/uvicorn --name portfolio-rag-api -- api:app --host 127.0.0.1 --port 8000"
  echo "  pm2 restart portfolio-rag-api   # if already running"
  echo "  pm2 save"
  echo "------------------------------------------------------------------"
  echo ""
fi
