#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5059}"
BASE="http://127.0.0.1:${PORT}"

fail(){ echo "[FAIL] $*" >&2; exit 1; }

curl -fsS "${BASE}/health" >/dev/null || fail "health endpoint"

# Create request
RID=$(curl -fsS -X POST "${BASE}/api/requests" -H 'content-type: application/json' \
  -d '{"projectId":"maxcontrax-reel-v1","mode":"simple","note":"smoke_test"}' \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["request"]["requestId"])')

test -n "$RID" || fail "request creation"

# Enqueue a harmless job bundle (qc_export only)
curl -fsS -X POST "${BASE}/api/jobs/enqueue" -H 'content-type: application/json' \
  -d '{"projectId":"maxcontrax-reel-v1","bundle":["qc_export"],"maxAttempts":1}' \
  >/dev/null || fail "enqueue"

# Run until empty
curl -fsS -X POST "${BASE}/api/jobs/run_until_empty" -H 'content-type: application/json' -d '{"maxJobs":10}' \
  >/dev/null || fail "run_until_empty"

echo "[OK] dashboard smoke test passed on ${BASE}"
