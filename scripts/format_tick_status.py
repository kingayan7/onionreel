#!/usr/bin/env python3
"""OnionReel — format build tick status lines (memory log + Telegram).

Why: the easiest way to break the chain is to accidentally post mismatched
"Shipped"/"Next" lines between Telegram and the memory log. This script
formats both outputs from the same inputs.

Usage:
  ./onionreel/scripts/format_tick_status.py \
    --shipped "Added X to onionreel/FILE.md" \
    --next "Tighten Y in onionreel/OTHER.md"

Optional:
  --time "HH:MM"   Override the time shown in the memory log line.
                   (Default: current time in America/New_York)

Outputs:
  1) Memory log line:
     HH:MM — Shipped: ... | Next: ...

  2) Telegram message block:
     OnionReel Build Tick
     - Shipped: ...
     - Next: ...

Constraints:
  - Single-line shipped/next only (script will collapse whitespace)
  - Does not write files or send messages (safe-by-default)
"""

from __future__ import annotations

import argparse
import re
from datetime import datetime
from zoneinfo import ZoneInfo


def one_line(s: str) -> str:
    s = s.strip()
    s = re.sub(r"\s+", " ", s)
    return s


def main() -> int:
    p = argparse.ArgumentParser(add_help=True)
    p.add_argument("--shipped", required=True, help="One-line shipped status")
    p.add_argument("--next", required=True, help="One-line next status")
    p.add_argument(
        "--time",
        default=None,
        help='Override HH:MM for the memory log line (default: now in America/New_York)',
    )
    args = p.parse_args()

    shipped = one_line(args.shipped)
    nxt = one_line(args.next)

    if not shipped or not nxt:
        raise SystemExit("Both --shipped and --next must be non-empty")

    if args.time:
        hhmm = one_line(args.time)
    else:
        dt = datetime.now(ZoneInfo("America/New_York"))
        hhmm = dt.strftime("%H:%M")

    memory_line = f"{hhmm} — Shipped: {shipped} | Next: {nxt}"
    telegram_block = "\n".join(
        [
            "OnionReel Build Tick",
            f"- Shipped: {shipped}",
            f"- Next: {nxt}",
        ]
    )

    print("# Memory log line")
    print(memory_line)
    print("\n# Telegram")
    print(telegram_block)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
