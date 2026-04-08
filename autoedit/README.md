# OnionReel Auto-Edit (v1)

Goal: given a **Reel Blueprint** + **brand pack** + **stock manifest**, render a shippable MP4 (9:16) via ffmpeg.

## Inputs
- `onionreel/autoedit/projects/<projectId>/blueprint.json`
- `onionreel/autoedit/projects/<projectId>/brand.json`
- `onionreel/autoedit/projects/<projectId>/stock_manifest.json`

## Output
- `onionreel/autoedit/renders/<projectId>/master_30s.mp4`
- later: 15s + 6s variants, plus QC report.

## v1 Constraints
- Uses **local stock files** in `onionreel/autoedit/cache/`.
- Pexels download is **best-effort** (no key). If blocked, user drops files manually and updates manifest.

## Scripts
- `node onionreel/autoedit/stock_fetch.mjs <projectId>`
- `node onionreel/autoedit/render.mjs <projectId>`
- `node onionreel/autoedit/qc_render.mjs <projectId>` (planned)
