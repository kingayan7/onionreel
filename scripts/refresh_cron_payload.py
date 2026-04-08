#!/usr/bin/env python3
"""Refresh the `Current time:` line in onionreel/_cron_payload.txt.

Safe-by-default: prints the updated payload to stdout.

Options:
  --write    Overwrite onionreel/_cron_payload.txt with the updated payload.

Why this exists:
- The build-tick prompt sometimes carries conflicting timestamps.
- We treat _cron_payload.txt as the canonical payload.
- After refresh, the payload should contain **exactly one** `Current time:` line.

Rules:
- If multiple `Current time:` lines exist, keep only the **last** one (in-place),
  delete the earlier ones, and rewrite the last one to the current ET time.

Verification:
  ./onionreel/scripts/refresh_cron_payload.py | grep -n "^Current time:"  # should print exactly 1 line
"""

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo


def ordinal(n: int) -> str:
    return str(n) + (
        "th" if 11 <= n % 100 <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    )


def pretty_now_et() -> str:
    dt = datetime.now(ZoneInfo("America/New_York"))
    # Example: Monday, April 6th, 2026 — 1:09 PM (America/New_York)
    return (
        dt.strftime("%A, %B ")
        + ordinal(dt.day)
        + dt.strftime(", %Y — %-I:%M %p (America/New_York)")
    )


def main() -> int:
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument(
        "--write",
        action="store_true",
        help="Overwrite onionreel/_cron_payload.txt instead of printing only",
    )
    args = ap.parse_args()

    payload_path = Path("onionreel/_cron_payload.txt")
    lines = payload_path.read_text(encoding="utf-8").splitlines(keepends=True)

    idxs = [i for i, ln in enumerate(lines) if ln.startswith("Current time:")]
    if not idxs:
        raise SystemExit("ERROR: No 'Current time:' line found in onionreel/_cron_payload.txt")

    now_line = f"Current time: {pretty_now_et()}\n"

    # Keep only the last Current time line; delete earlier duplicates.
    last = idxs[-1]
    for i in reversed(idxs[:-1]):
        del lines[i]
        if i < last:
            last -= 1

    lines[last] = now_line

    new_text = "".join(lines)
    if not new_text.endswith("\n"):
        new_text += "\n"

    if args.write:
        payload_path.write_text(new_text, encoding="utf-8")

    print(new_text, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
