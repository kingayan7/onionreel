#!/usr/bin/env python3
"""OnionReel — generate the next one-shot build-tick cron job JSON.

Purpose
- Avoid timestamp/offset mistakes (ET vs UTC)
- Avoid prompt drift (always source from onionreel/_cron_payload.txt)

Usage
  ./onionreel/scripts/next_tick_job_json.py
  ./onionreel/scripts/next_tick_job_json.py --minutes 10
  ./onionreel/scripts/next_tick_job_json.py --to -5020096204
  ./onionreel/scripts/next_tick_job_json.py --job-only

Output
- Prints a single JSON object suitable for OpenClaw `cron` tool:
    {"action":"add","job":{...}}

Notes
- Updates ONLY the `Current time:` line inside the payload template.
- Leaves the rest of onionreel/_cron_payload.txt untouched.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


def _ordinal(n: int) -> str:
    return str(n) + (
        "th" if 11 <= n % 100 <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    )


def _pretty_now_et(dt: datetime) -> str:
    return (
        dt.strftime("%A, %B ")
        + _ordinal(dt.day)
        + dt.strftime(", %Y — %-I:%M %p (America/New_York)")
    )


def _iso_with_offset(dt: datetime) -> str:
    off = dt.strftime("%z")
    off = off[:-2] + ":" + off[-2:]
    return dt.strftime("%Y-%m-%dT%H:%M:00") + off


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--minutes", type=int, default=10, help="Minutes from now for schedule.at (default: 10)")
    ap.add_argument("--to", default="-5020096204", help="Telegram chat id to announce into")
    ap.add_argument(
        "--name",
        default=None,
        help=(
            "Job name (default: auto-generated with ET time, e.g. 'OnionReel build tick (one-shot @ 1:26 PM ET)')"
        ),
    )
    ap.add_argument(
        "--job-only",
        action="store_true",
        help="Print only the job object (not the full {action,job} tool call)",
    )
    args = ap.parse_args()

    if args.minutes < 1:
        raise SystemExit("--minutes must be >= 1")

    tz = ZoneInfo("America/New_York")
    # Normalize to the minute boundary to avoid accidentally scheduling <N minutes>
    # in the future when we later format schedule.at with ":00" seconds.
    now = datetime.now(tz).replace(second=0, microsecond=0)
    at = now + timedelta(minutes=args.minutes)

    payload_path = pathlib.Path("onionreel/_cron_payload.txt")
    try:
        text = payload_path.read_text(encoding="utf-8")
    except FileNotFoundError:
        raise SystemExit(
            "Missing onionreel/_cron_payload.txt (canonical build-tick prompt). "
            "Create it or restore it before scheduling the next tick."
        )

    pretty = _pretty_now_et(now)
    message = re.sub(r"^Current time:.*$", f"Current time: {pretty}", text, flags=re.M)

    default_name = f"OnionReel build tick (one-shot @ {at.strftime('%-I:%M %p')} ET)"

    job = {
        "name": args.name or default_name,
        "schedule": {"kind": "at", "at": _iso_with_offset(at)},
        "payload": {"kind": "agentTurn", "message": message},
        "delivery": {
            "mode": "announce",
            "channel": "telegram",
            "to": str(args.to),
            "bestEffort": True,
        },
        "sessionTarget": "isolated",
        # These are best-effort; if the gateway build doesn't support them,
        # the job should still run (and can be manually removed next tick).
        "deleteAfterRun": True,
        "wakeMode": "now",
    }

    if args.job_only:
        print(json.dumps(job, ensure_ascii=False, indent=2))
    else:
        tool_call = {"action": "add", "job": job}
        print(json.dumps(tool_call, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
