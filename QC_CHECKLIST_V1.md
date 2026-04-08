# OnionReel QC Checklist v1 (Shippable)

Purpose: a **copy/paste, measurable** checklist that turns the Automated QC spec into concrete gates.

> Scope (v1): checks we can run automatically (or semi-automatically) at export time with `ffprobe/ffmpeg` + simple parsers.

## 0) Inputs (required artifacts)
- [ ] Final video export file (e.g. `final.mp4`)
- [ ] Captions file (e.g. `captions.srt`) if required by platform
- [ ] Metadata JSON (title/desc/tags) if publishing is automated
- [ ] (Optional) Expected spec JSON (duration range, fps, resolution, loudness targets)

## 1) File sanity (hard fail)
**Goal:** ensure the file is readable and matches the expected technical envelope.

- [ ] Container/codec allowed (default): `mp4` + `h264` video + `aac` audio
- [ ] Video stream present, audio stream present
- [ ] No obvious corruption: `ffprobe` completes without errors
- [ ] Duration is within expected bounds (default): expected ± 2.0s
- [ ] Resolution is one of:
  - [ ] 1080×1920 (9:16 vertical)
  - [ ] 1920×1080 (16:9 horizontal)
  - [ ] 1080×1080 (1:1 square)
- [ ] FPS is stable and within (default): 23.976/24/25/29.97/30/60

**Commands (examples):**
```bash
ffprobe -hide_banner -v error -show_streams -show_format -print_format json "final.mp4" > probe.json
# quick human glance
jq '.format.duration, .streams[] | {codec_type, codec_name, width, height, r_frame_rate, avg_frame_rate}' probe.json
```

## 2) Audio sanity (warn/fail)
**Goal:** avoid clipping, inaudible mixes, and long dead-air.

Defaults (tune per brand later):
- Target integrated loudness (speech-heavy): **-16 LUFS** (Warn if outside [-18, -14], Fail if outside [-21, -11])
- True peak: Warn if > **-1.0 dBTP**, Fail if > **-0.2 dBTP**
- Clipping: Fail if any sample peak ≥ 0 dBFS
- Silence gaps: Warn if contiguous silence > **1.0s**, Fail if > **2.5s** (configurable by content type)

**Commands (examples):**
```bash
# Loudness (EBU R128). Produces a JSON-ish summary in stderr.
ffmpeg -hide_banner -i "final.mp4" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=summary -f null - 2> loudness.txt

# Silence detection
ffmpeg -hide_banner -i "final.mp4" -af silencedetect=noise=-35dB:d=0.7 -f null - 2> silence.txt
```

## 3) Visual sanity (warn/fail)
**Goal:** prevent black/frozen frames, missing end card, and obvious export mistakes.

Defaults:
- Black frames: Warn if > **0.5s** total, Fail if > **2.0s** total (excluding intentional fade-to-black if flagged)
- Freeze detection: Warn if frozen segment > **0.5s**, Fail if > **1.5s**
- End card presence (if required): Fail if last **2–4s** doesn’t match expected end-card fingerprint (v1: heuristic/manual review; v2: perceptual hash)

**Commands (examples):**
```bash
# Blackframe detection
ffmpeg -hide_banner -i "final.mp4" -vf blackframe=amount=98:threshold=32 -an -f null - 2> blackframe.txt

# Freeze detection (basic)
ffmpeg -hide_banner -i "final.mp4" -vf freezedetect=n=0.003:d=0.5 -an -f null - 2> freeze.txt
```

## 4) Captions sanity (warn/fail)
- [ ] `captions.srt` exists (if required)
- [ ] SRT parses cleanly (no malformed blocks)
- [ ] Timecodes monotonic; no overlaps > 100ms (Warn) / > 500ms (Fail)
- [ ] Max chars per line (default): 42 (Warn if exceeded, Fail if egregious > 60)
- [ ] Max lines per caption (default): 2

Implementation note: v1 can be a small Node/Python parser; store results in QCResult.

## 5) Branding sanity (warn/fail)
- [ ] Safe-area compliance (platform-specific)
- [ ] Logo presence where required
- [ ] End card present (if required)

v1 approach:
- Automated heuristic checks + **mandatory human spot-check** for branding until we add fingerprints.

## 6) Platform rules (warn/fail)
TikTok defaults (adjust as needed):
- [ ] Vertical export: 1080×1920
- [ ] Keep critical text inside safe margins (approx): top 10%, bottom 20%, right 15% (Warn if violated)
- [ ] Duration within platform constraints (Fail if outside)

Meta/Reels defaults:
- [ ] Duration within constraints
- [ ] Audio loudness not excessively hot (Warn if LUFS > -13)

## 7) QCResult output (required)
Persist a machine-readable artifact:
```json
{
  "version": "qc-v1",
  "input": {"video": "final.mp4", "captions": "captions.srt"},
  "checks": [
    {"id": "file.codec", "level": "fail|warn|pass", "detail": "..."},
    {"id": "audio.lufs", "level": "...", "detail": {"I": -16.2, "TP": -1.1}}
  ],
  "summary": {"level": "pass|warn|fail", "warnCount": 1, "failCount": 0}
}
```

## 8) Definition of Done (for a build tick)
- [ ] Checklist exists and is concrete (numbers + commands) ✅
- [ ] Thresholds are explicit and labeled warn vs fail ✅
- [ ] QCResult schema stub is specified ✅
- [ ] Next step is clear: implement parsers + wire into Job Runner
