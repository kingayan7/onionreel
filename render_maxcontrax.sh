#!/usr/bin/env bash
set -euo pipefail

# One command render for MaxContrax reel
# Usage: ./render_maxcontrax.sh

PROJECT_ID="maxcontrax-reel-v1"
ROOT="$(cd "$(dirname "$0")" && pwd)"

export ONIONREEL_TELEGRAM=off

echo "[onionreel] sora_generate"
/usr/local/bin/node "$ROOT/autoedit/sora_generate.mjs" "$PROJECT_ID"

echo "[onionreel] render"
/usr/local/bin/node "$ROOT/autoedit/render.mjs" "$PROJECT_ID"

echo "[onionreel] mix_audio"
/usr/local/bin/node "$ROOT/autoedit/mix_audio.mjs" "$PROJECT_ID"

echo "[onionreel] qc_export"
/usr/local/bin/node "$ROOT/autoedit/qc_export.mjs" "$PROJECT_ID"

echo "[onionreel] done"
ls -lh "$ROOT/autoedit/renders/$PROJECT_ID/master_30s.mp4" || true
ls -lh "$ROOT/autoedit/renders/$PROJECT_ID/variant_15s.mp4" || true
ls -lh "$ROOT/autoedit/renders/$PROJECT_ID/variant_6s.mp4" || true
