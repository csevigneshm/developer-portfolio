#!/bin/bash
set -e
cd "$(dirname "$0")"

if [ ! -f "rag-env/bin/python" ]; then
  echo "Missing virtualenv. Run: python3 -m venv rag-env && source rag-env/bin/activate && pip install -r requirements.txt"
  exit 1
fi

exec ./rag-env/bin/python -m uvicorn api:app --host 127.0.0.1 --port 8000
