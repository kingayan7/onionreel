#!/usr/bin/env python3
"""Render Sora clips via OpenAI Videos API.

Requires: OPENAI_API_KEY env var.

Example:
  python3 scripts/sora_render.py --model sora-2-pro --size 1080x1920 --seconds 5 \
    --prompt "..." --out out.mp4

This script:
- POST /v1/videos
- polls GET /v1/videos/{id} until completed/failed
- downloads GET /v1/videos/{id}/content (variant=video)

Docs: https://developers.openai.com/docs/guides/video-generation
"""

from __future__ import annotations

import argparse
import json
import os
import time
import urllib.request
import urllib.error

API_BASE = "https://api.openai.com/v1"


def req_json(method: str, url: str, key: str, payload: dict | None = None) -> dict:
    data = None
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        raise SystemExit(f"HTTP {e.code} {e.reason} for {url}\n{body}")


def download_content(video_id: str, key: str, out_path: str, variant: str = "video") -> None:
    url = f"{API_BASE}/videos/{video_id}/content?variant={variant}"
    headers = {"Authorization": f"Bearer {key}"}
    r = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(r, timeout=120) as resp:
        blob = resp.read()
    with open(out_path, "wb") as f:
        f.write(blob)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="sora-2-pro")
    ap.add_argument("--size", default="1080x1920")
    ap.add_argument("--seconds", type=int, default=5)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--poll", type=float, default=10.0, help="poll interval seconds")
    args = ap.parse_args()

    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        raise SystemExit("OPENAI_API_KEY missing")

    create_payload = {
        "model": args.model,
        "prompt": args.prompt,
        "size": args.size,
        "seconds": str(args.seconds),
    }

    video = req_json("POST", f"{API_BASE}/videos", key, create_payload)
    vid = video["id"]
    status = video.get("status")
    progress = video.get("progress")
    print(f"started {vid} status={status} progress={progress}")

    while status in ("queued", "in_progress"):
        time.sleep(args.poll)
        video = req_json("GET", f"{API_BASE}/videos/{vid}", key)
        status = video.get("status")
        progress = video.get("progress")
        print(f"{vid} status={status} progress={progress}")

    if status != "completed":
        raise SystemExit(f"video failed: status={status} video={video}")

    download_content(vid, key, args.out, variant="video")
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
