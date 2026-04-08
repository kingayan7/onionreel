#!/usr/bin/env python3
"""Print the next OnionReel build tick schedule.at timestamp.

Purpose:
  Avoid UTC/offset mistakes when scheduling the next 10-minute one-shot cron job.

Output:
  ISO-8601 timestamp with explicit America/New_York offset, minutes rounded to :00 seconds.

Examples:
  $ ./onionreel/scripts/next_tick_at.py
  2026-04-06T11:48:00-04:00

  $ ./onionreel/scripts/next_tick_at.py --minutes 20
  2026-04-06T11:58:00-04:00
"""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


def iso_with_colon_offset(dt: datetime) -> str:
    # %z gives -0400; convert to -04:00
    off = dt.strftime('%z')
    off = off[:-2] + ':' + off[-2:]
    return dt.strftime('%Y-%m-%dT%H:%M:00') + off


def main() -> None:
    p = argparse.ArgumentParser(description="Print ISO schedule.at timestamp for the next build tick (ET).")
    p.add_argument('--minutes', type=int, default=10, help='Minutes from now (default: 10)')
    args = p.parse_args()

    if args.minutes <= 0 or args.minutes > 24 * 60:
        raise SystemExit('--minutes must be between 1 and 1440')

    dt = datetime.now(ZoneInfo('America/New_York')) + timedelta(minutes=args.minutes)
    print(iso_with_colon_offset(dt))


if __name__ == '__main__':
    main()
