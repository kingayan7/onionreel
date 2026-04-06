#!/usr/bin/env python3
"""Package a batch of creative PNGs into an upload-ready zip.

Usage:
  python3 scripts/package_creatives.py --src <dir> --out <zip>

Renames inside the zip to simple, ad-manager-friendly filenames.
"""

from __future__ import annotations

import argparse
import os
import re
import zipfile
from pathlib import Path


def guess_vertical(p: Path) -> str:
    name = p.name.lower()
    if "jan" in name or "clean" in name:
        return "janitorial"
    if "sec" in name or "guard" in name:
        return "security"
    # fallback: infer from parent folders
    parent = str(p.parent).lower()
    if "jan" in parent:
        return "janitorial"
    if "sec" in parent:
        return "security"
    return "creative"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="Source directory containing PNGs")
    ap.add_argument("--out", required=True, help="Output zip path")
    ap.add_argument("--prefix", default="maxcontrax", help="Filename prefix")
    args = ap.parse_args()

    src = Path(args.src).expanduser().resolve()
    out = Path(args.out).expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    pngs = sorted([p for p in src.glob("*.png") if p.is_file()])
    if not pngs:
        raise SystemExit(f"No PNGs found in {src}")

    # stable numbering per vertical
    counters: dict[str, int] = {}

    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for p in pngs:
            v = guess_vertical(p)
            counters[v] = counters.get(v, 0) + 1
            n = counters[v]
            arc = f"{args.prefix}_{v}_{n:02d}.png"
            z.write(p, arcname=arc)

        # also include the index/prompts if present
        for extra in ("index.html", "prompts.json"):
            ep = src / extra
            if ep.exists() and ep.is_file():
                z.write(ep, arcname=extra)

    print(str(out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
