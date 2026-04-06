#!/usr/bin/env python3
"""Overlay the MaxContrax 'M' logo and small 'axContrax' wordmark onto PNG creatives.

- Expects a logo image with light background; attempts to make near-white transparent.

Usage:
  python3 scripts/brand_overlay.py --dir <batch_dir> --logo <logo_path>

It will create new files alongside originals with suffix _branded.png.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


def make_white_transparent(img: Image.Image, threshold: int = 245) -> Image.Image:
    img = img.convert('RGBA')
    r, g, b, a = img.split()
    # Build alpha mask: pixels close to white => transparent
    # Convert to grayscale luminance
    lum = Image.merge('RGB', (r, g, b)).convert('L')
    # alpha = 0 when lum >= threshold, else keep
    mask = lum.point(lambda p: 0 if p >= threshold else 255)
    # Keep existing alpha if any
    a2 = ImageChops.multiply(a, mask)
    return Image.merge('RGBA', (r, g, b, a2))


def load_font(size: int) -> ImageFont.FreeTypeFont:
    # macOS common font paths
    candidates = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/Library/Fonts/Arial Bold.ttf',
        '/System/Library/Fonts/SFNS.ttf',
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size=size)
        except Exception:
            continue
    return ImageFont.load_default()


def overlay_one(png: Path, logo_rgba: Image.Image, out_suffix: str = '_branded') -> Path:
    base = Image.open(png).convert('RGBA')
    w, h = base.size

    # place in top margin (assumes the creative reserves an empty header band)
    pad = int(w * 0.03)
    # crop-safe brand safe area at top (but do NOT paint a strip)
    strip_h = int(h * 0.19)

    logo_w = int(w * 0.145)  # balanced M size
    logo_h = int(logo_rgba.height * (logo_w / logo_rgba.width))
    logo = logo_rgba.resize((logo_w, logo_h), resample=Image.LANCZOS)

    # position inside strip
    x = pad
    y = int((strip_h - logo_h) * 0.5) + int(h * 0.010)  # nudge down for crop-safe margin

    # draw wordmark 'axContrax' next to logo to read as MaxContrax
    draw = ImageDraw.Draw(base)
    font = load_font(int(w * 0.070))  # larger letters to match the M/mark weight
    text = 'axContrax'

    tx = x + logo_w + int(w * -0.006)  # overlap slightly so it reads as one lockup

    # Vertically center the text relative to the logo within the reserved header band
    bbox = draw.textbbox((0, 0), text, font=font)
    text_h = bbox[3] - bbox[1]
    logo_center_y = y + (logo_h // 2)
    ty = int(logo_center_y - (text_h / 2)) + int(h * 0.004)  # slight downward nudge

    shadow = (0, 0, 0, 70)
    fill = (18, 18, 18, 235)
    draw.text((tx + 2, ty + 2), text, font=font, fill=shadow)
    draw.text((tx, ty), text, font=font, fill=fill)

    # composite logo on top
    base.alpha_composite(logo, (x, y))

    out = png.with_name(png.stem + out_suffix + png.suffix)
    base.convert('RGB').save(out, 'PNG')
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dir', required=True, help='Directory containing PNGs')
    ap.add_argument('--logo', required=True, help='Path to logo image (jpg/png)')
    args = ap.parse_args()

    d = Path(args.dir).expanduser().resolve()
    logo_path = Path(args.logo).expanduser().resolve()

    logo = Image.open(logo_path)
    logo = make_white_transparent(logo)

    pngs = sorted([p for p in d.glob('*.png') if p.is_file() and not p.name.endswith('_branded.png')])
    if not pngs:
        print('No PNGs found')
        return 0

    for p in pngs:
        out = overlay_one(p, logo)
        print(out)

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
