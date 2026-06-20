#!/usr/bin/env bash
set -euo pipefail

INSTALL_CMD="npm install"
VERIFY_CMD="npm run verify"
START_CMD="npm run dev"

echo "Repository root: $(pwd)"
echo "Installing workspaces..."
eval "$INSTALL_CMD"
echo "Running verification..."
eval "$VERIFY_CMD"
echo ""
echo "Verification passed."
echo "Web: npm run dev  |  API: npm run dev:api"
if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  eval "$START_CMD"
fi
