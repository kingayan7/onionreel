#!/usr/bin/env python3
"""Convert SRT to a simple styled ASS subtitle file.

Usage:
  python3 captions/srt_to_ass.py input.srt output.ass

This is a minimal v1 converter for OnionReel.
"""

import sys
import re


def srt_time_to_ass(t: str) -> str:
    # 00:00:01,234 -> 0:00:01.23
    hh, mm, rest = t.split(':')
    ss, ms = rest.split(',')
    cs = int(ms) // 10
    return f"{int(hh)}:{mm}:{ss}.{cs:02d}"


def main():
    if len(sys.argv) != 3:
        print('usage: srt_to_ass.py input.srt output.ass')
        return 2

    inp, outp = sys.argv[1], sys.argv[2]
    txt = open(inp, 'r', encoding='utf-8').read()
    blocks = re.split(r"\n\s*\n", txt.strip())

    header = """[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,56,&H00FFFFFF,&H00FFFFFF,&H55000000,&H55000000,-1,0,0,0,100,100,0,0,1,4,3,2,80,80,260,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    events = []
    for b in blocks:
        lines = [l.strip('\r') for l in b.split('\n') if l.strip()]
        if len(lines) < 3:
            continue
        # lines[1] is timing
        times = lines[1]
        if '-->' not in times:
            continue
        start, end = [x.strip() for x in times.split('-->')]
        start_a = srt_time_to_ass(start)
        end_a = srt_time_to_ass(end)
        text = "\\N".join(lines[2:])
        events.append(f"Dialogue: 0,{start_a},{end_a},Default,,0,0,0,,{text}")

    with open(outp, 'w', encoding='utf-8') as f:
        f.write(header)
        f.write("\n".join(events))
        f.write("\n")

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
