# OnionReel QC Thresholds Playbook v1

Purpose: turn the *Automated QC Spec* into a concrete, testable **rubric** (numbers + pass/warn/fail bands) so QC can be implemented without guesswork.

This is intentionally **defaults-first**. Each workflow or platform can override via a per-workflow config file later.

---

## 0) How to Use This

1) Start with the **Default Threshold Set** (Section 2).
2) For each export, compute metrics (Section 1) and evaluate **Pass/Warn/Fail**.
3) Produce a `QCResult` artifact that includes:
   - threshold set id (e.g. `default-v1`)
   - measured metrics
   - status per check (pass|warn|fail)
   - top 3 human notes

**Rule:** Any **Fail** blocks publish/distribution. Warns are allowed but must be visible.

---

## 1) Metrics (implementation-facing)

### 1a) Video
- `duration_s`
- `width_px`, `height_px`
- `fps`
- `black_frames_count`, `black_frames_longest_run_frames`
- `frozen_frames_count`, `frozen_frames_longest_run_frames`
- `has_end_card` (boolean) + `end_card_visible_s`

### 1b) Audio (overall mix)
- `integrated_lufs` (LUFS-I)
- `true_peak_dbtp` (dBTP)
- `lra_lu` (loudness range)
- `silence_gaps_over_500ms_count`
- `silence_longest_gap_ms`
- `clipping_samples_count` (or `clipping_events_count`)

### 1c) Captions (SRT)
- `has_srt`
- `timecodes_monotonic`
- `max_chars_per_line`
- `max_lines_per_caption`
- `overlap_count`

---

## 2) Default Threshold Set (`default-v1`)

> Notes:
> - These defaults aim for **safe + broadly acceptable**, not perfection.
> - Exact platform loudness targets vary; we pick reasonable publish-safe bands.

### 2a) File/Format Sanity
- Container/codec supported:
  - Pass: supported
  - Fail: unsupported
- FPS stability:
  - Pass: constant fps
  - Warn: variable fps but within ±0.5 fps equivalent
  - Fail: variable fps beyond that

### 2b) Duration Sanity
- Expected length check (workflow supplies `expected_duration_s` and tolerance):
  - Pass: within tolerance
  - Warn: within 2× tolerance
  - Fail: outside 2× tolerance

### 2c) Visual Sanity
- Black frames (anywhere):
  - Pass: no run > 15 frames
  - Warn: run 16–45 frames
  - Fail: run > 45 frames
- Frozen frames:
  - Pass: no run > 10 frames
  - Warn: run 11–30 frames
  - Fail: run > 30 frames
- End-card:
  - Pass: `has_end_card=true` AND `end_card_visible_s >= 1.0`
  - Warn: visible 0.5–0.99s
  - Fail: missing or < 0.5s

### 2d) Audio Sanity (overall)
- Integrated loudness (LUFS-I):
  - Pass: -16 to -12
  - Warn: -18 to -16 OR -12 to -10
  - Fail: < -18 OR > -10
- True peak (dBTP):
  - Pass: <= -1.0
  - Warn: -1.0 to -0.1
  - Fail: > -0.1
- Clipping:
  - Pass: 0 events
  - Warn: 1–2 events
  - Fail: > 2 events
- Silence gaps >500ms (excluding intentional pauses; later we’ll add marker-based exclusions):
  - Pass: longest gap < 1500ms
  - Warn: 1500–3000ms
  - Fail: > 3000ms

### 2e) Captions Sanity
- Presence:
  - Pass: `has_srt=true`
  - Warn: n/a
  - Fail: missing
- Timecodes:
  - Pass: monotonic, no overlaps
  - Warn: 1 overlap
  - Fail: >1 overlap or non-monotonic
- Readability:
  - Pass: `max_chars_per_line <= 42` and `max_lines_per_caption <= 2`
  - Warn: `max_chars_per_line <= 52`
  - Fail: > 52 or > 2 lines

---

## 3) Platform Overrides (placeholders)

Add overrides later as separate ids (examples):
- `tiktok-v1`
- `reels-v1`
- `yt-shorts-v1`

Each override should only differ where needed (e.g., safe margins checks, duration constraints).

---

## 4) Definition of Done for “QC Thresholds Implemented”

- Threshold set id exists (this doc).
- QCResult generator can:
  - compute all metrics in Section 1 (or explicitly mark `not_implemented`)
  - evaluate pass/warn/fail per Section 2
  - produce a human report with **top 3 issues** + suggested actions
