#!/usr/bin/env bash
set -euo pipefail

# OnionReel: SadTalker talking-head render (audio-driven)
# License: SadTalker is Apache-2.0 (see third_party/SadTalker/LICENSE)
# Notes:
# - Produces a talking-head video from a single source image + audio.
# - For best realism: use a real recorded voice note.
#
# Usage:
#   ops/sadtalker_run.sh <source_image> <audio_wav_or_mp3> <out_mp4>

SRC_IMG=${1:?source image path}
AUDIO=${2:?audio path}
OUT=${3:?output mp4 path}

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ST_DIR="$ROOT_DIR/third_party/SadTalker"
VENV="$ST_DIR/.venv"

mkdir -p "$(dirname "$OUT")"

if [ ! -d "$VENV" ]; then
  echo "[SadTalker] creating venv..."
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --upgrade pip wheel
  # Minimal deps; SadTalker may require torch. We'll install CPU torch by default.
  "$VENV/bin/pip" install -r "$ST_DIR/requirements.txt"
fi

# Model checkpoints are required. SadTalker docs have download steps.
# We keep them under: third_party/SadTalker/checkpoints
# If missing, exit with guidance.
if [ ! -d "$ST_DIR/checkpoints" ] || [ -z "$(ls -A "$ST_DIR/checkpoints" 2>/dev/null || true)" ]; then
  echo "[SadTalker] Missing checkpoints in $ST_DIR/checkpoints"
  echo "Open: $ST_DIR/README.md and follow 'Download checkpoints' section."
  exit 2
fi

# Run inference
# IMPORTANT: use absolute paths because SadTalker runs with cwd=$ST_DIR.
ABS_SRC_IMG="$(cd "$(dirname "$SRC_IMG")" && pwd)/$(basename "$SRC_IMG")"
ABS_AUDIO="$(cd "$(dirname "$AUDIO")" && pwd)/$(basename "$AUDIO")"
ABS_OUT_DIR="$(cd "$(dirname "$OUT")" && pwd)"

cd "$ST_DIR"
"$VENV/bin/python" inference.py \
  --driven_audio "$ABS_AUDIO" \
  --source_image "$ABS_SRC_IMG" \
  --result_dir "$ABS_OUT_DIR" \
  --pose_style 0 \
  --preprocess full \
  --enhancer gfpgan \
  --still

# SadTalker writes into result_dir with a generated name. Pick newest mp4.
LATEST=$(ls -1t "$(dirname "$OUT")"/*.mp4 2>/dev/null | head -n 1 || true)
if [ -z "$LATEST" ]; then
  echo "[SadTalker] did not produce an mp4 in $(dirname "$OUT")"
  exit 3
fi

mv -f "$LATEST" "$OUT"
echo "[SadTalker] wrote: $OUT"
