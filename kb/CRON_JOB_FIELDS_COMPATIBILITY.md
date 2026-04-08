# OnionReel — Cron Job Field Compatibility (OpenClaw)

This note exists to prevent build-chain breaks caused by **cron schema drift** across gateway versions.

## Goal
When a build tick schedules the next tick, it should succeed even if some optional fields are not supported.

## Canonical one-shot job shape (preferred)
Use an `at` job scheduled **now + 10 minutes (America/New_York)**, with the build-tick prompt sourced from `onionreel/_cron_payload.txt`.

Minimum required intent:
- `schedule.kind = "at"`
- `payload.kind = "agentTurn"`
- `sessionTarget = "isolated"`
- `delivery.mode = "announce"` to Telegram `-5020096204`

Optional best-effort fields (nice-to-have):
- `deleteAfterRun: true` (auto-cleanup)
- `wakeMode: "now"` (run reliably even if scheduler was sleeping)

## Compatibility rule (DO NOT break the chain)
If `cron.add` fails due to unknown fields, immediately retry with the minimal shape:

1) **Retry without** `deleteAfterRun` and `wakeMode`.
2) Keep everything else identical (especially `schedule.at`, `payload.message`, `delivery`, `sessionTarget`).

This is the same fail-safe described in `onionreel/BUILD_TICK_QUALITY_CHECKLIST.md`.

## Quick verification (under 60s)
After scheduling, run `cron.list` and confirm:
- A new one-shot job exists with the expected `schedule.at` timestamp
- It points at the build tick prompt (payload message)
- There is only **one** job for that exact `schedule.at` (avoid double-fires)

## Preferred helper (recommended)
Generate the job JSON (including best-effort fields) via:

```bash
./onionreel/scripts/next_tick_job_json.py
```

If the gateway rejects optional fields, regenerate or hand-edit and re-run without them.
