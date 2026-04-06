#!/usr/bin/env python3
"""Write a small state file used by watchdogs.

Usage:
  python3 scripts/update_factory_state.py --state <path> --ok true/false --note "..." --batchDir <dir>
"""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--state', required=True)
    ap.add_argument('--ok', required=True)
    ap.add_argument('--note', default='')
    ap.add_argument('--batchDir', default='')
    args = ap.parse_args()

    p = Path(args.state)
    p.parent.mkdir(parents=True, exist_ok=True)

    data = {
        'ts': int(time.time()),
        'ok': str(args.ok).lower() in ('1','true','yes','y'),
        'note': args.note,
        'batchDir': args.batchDir,
    }
    p.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
