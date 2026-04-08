# OnionReel QC (MVP)

Minimal automated QC implementation v1 (no ffmpeg dependency yet).

## Checks
- File sanity: size + extension warnings
- SRT sanity: monotonic timecodes + line length warnings

## Run

```bash
node -e "import { qcRun } from './onionreel/qc/qc_checks.mjs'; console.log(qcRun({ filePath:'path/to/video.mp4', srtPath:'path/to/captions.srt' }))"
```

Next: add loudness + black frame checks using ffmpeg.
