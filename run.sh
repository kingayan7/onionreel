#!/usr/bin/env bash
set -euo pipefail

# One command start (dashboard + runners)
# Usage: ./run.sh

echo "[onionreel] starting dashboard on :5057"
(
  cd "$(dirname "$0")/dashboard"
  PORT=5057 node server.mjs
) &

echo "[onionreel] continuous build loop is managed by launchd (runner/watchdog/kick_build/status_alert/ensure_running)"
echo "[onionreel] to inspect: launchctl list | egrep 'com.onionreel.(runner|watchdog|kick_build|status_alert|ensure_running)'"

wait
