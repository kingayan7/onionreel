# OnionReel — Build Chain Runbook (Cron Reliability)

Purpose: keep the **10‑minute OnionReel build chain** running reliably. This is the “what to do when the chain breaks” doc.

This runbook is for the recurring cron tick that must, every run:
1) Ship one small improvement in `/Users/adrianissac/.openclaw/workspace/onionreel/`
2) Log the ship/next line in `memory/YYYY-MM-DD.md` under **OnionReel Loop Log**
3) Post the status to Telegram (chat id `-5020096204`)
4) **Schedule the next tick** (self‑rescheduling)

---

## Invariants (never break these)
- **One tick → one primary artifact** (see `QUALITY_RUBRICS.md`).
- **Always schedule the next tick** even if blocked.
- If blocked: ship a tiny doc capturing the blocker + options, then continue.

---

## Fail-safe execution order (when time is tight)
The canonical tick order is **ship → log → Telegram → reschedule**.

However, reliability beats purity. If you suspect you might time out (slow tools, long file reads, flaky network), use this fail-safe ordering:
1) Draft the planned **Shipped**/**Next** one-liners (30 seconds).
2) **Schedule the next tick immediately** (one-shot `schedule.kind='at'` ~10 minutes out).
3) Ship the improvement.
4) Append the memory log line.
5) Post to Telegram.

**Rule:** if you schedule early, your Telegram/Log “Next” line should still refer to the *content* next step, not “schedule next tick”. The reschedule is assumed.

---

## Definition of Done (DoD) for a tick
A tick is complete only when all are true:
- ✅ Exactly one shippable improvement exists in the repo (doc/spec/script).
- ✅ `memory/YYYY-MM-DD.md` has a new line: `HH:MM — Shipped: … | Next: …`
- ✅ Telegram message posted:
  - `OnionReel Build Tick`
  - `- Shipped: …`
  - `- Next: …`
- ✅ Next cron job created (`schedule.kind='at'`, **~10 minutes**, `deleteAfterRun=true`).
- ✅ (Recommended) The new cron **jobId** is captured somewhere durable (best: append `| jobId:<id>` to the memory log line). This makes missed-tick debugging trivial.

---

## Copy/paste cron job template (self-rescheduling)
When in doubt, prefer **explicit one-shot** jobs (`schedule.kind='at'`) over long-running cron expressions.

### Canonical payload source (avoid drift)
To keep the chain consistent, treat this file as the **single source of truth** for the job prompt:
- `onionreel/_cron_payload.txt`

When scheduling the next tick, copy the payload **verbatim** from that file (except updating the "Current time:" line if you choose).

**Time math (important):** `schedule.at` timestamps **without a timezone are treated as UTC**.
- If current time is America/New_York and you want “10 minutes from now”, either:
  - Write an ISO timestamp with `Z` (UTC), or
  - Include an explicit offset (e.g. `-04:00`).

### Fast way to compute “10 minutes from now” (reliable)
Prefer generating the timestamp programmatically to avoid off-by-timezone mistakes.

**Preferred (repo scripts; includes ET offset + canonical payload):**
```bash
./onionreel/scripts/next_tick_at.py
./onionreel/scripts/next_tick_job_json.py
```
- `next_tick_at.py` prints an ISO `schedule.at` with the **America/New_York offset** (e.g. `2026-04-06T12:45:00-04:00`).
- `next_tick_job_json.py` prints a full `cron.add` JSON payload that sources the prompt from `onionreel/_cron_payload.txt` (avoids prompt drift) and sets `deleteAfterRun=true` + `wakeMode=now` best-effort.

**Fallback (UTC is fine if you’re consistent):**
```bash
node -e 'console.log(new Date(Date.now()+10*60*1000).toISOString())'
```
This prints a UTC timestamp like `2026-04-06T16:45:00.000Z` that you can paste into `schedule.at`.

### Minimal job skeleton (recommended)
```json
{
  "name": "OnionReel build tick (one-shot)",
  "schedule": { "kind": "at", "at": "2026-04-06T10:14:00Z" },
  "payload": {
    "kind": "agentTurn",
    "message": "<paste the OnionReel build tick instructions>"
  },
  "delivery": { "mode": "announce", "channel": "telegram", "to": "-5020096204" },
  "sessionTarget": "isolated",
  "enabled": true,
  "deleteAfterRun": true,
  "wakeMode": "now"
}
```

### Quick validation checks (before you ship the tick)
- The next job’s `at` time is **~10 minutes** in the future (not past).
- Delivery is set to **telegram `-5020096204`**.
- The payload message still includes: **ship → log → telegram → reschedule**.

### Post-schedule verification (after you create the job)
Do this immediately after `cron.add` (takes <60s):
- Confirm the tool returned a **jobId**.
- Run `cron.list` and ensure exactly **one** upcoming “OnionReel build tick (one-shot)” exists.
- (Recommended) Use a job name that includes the ET time, e.g. `OnionReel build tick (one-shot @ 12:50 ET)` so duplicates are obvious.
- If `cron.add` succeeded but the job **doesn’t appear** in `cron.list`:
  - Retry `cron.list` once (race/propagation happens)
  - If still missing, **re-add** the job (better to double-fire than to stop the chain), and note the anomaly in the tick log.

### If cron.add fails due to unknown job fields (deleteAfterRun / wakeMode)
Some gateway builds may not accept `deleteAfterRun` and/or `wakeMode`.

Fail-safe rule:
1) Immediately retry the exact same one-shot job **without** `deleteAfterRun` and `wakeMode`.
2) Keep the chain alive first; job hygiene can be fixed next tick.
3) On the next tick, manually remove stale one-shot jobs via `cron.remove` if needed.

### Duplicate one-shot jobs (double-fire prevention)
Double-firing (two ticks at the same `schedule.at`) is worse than being 1–2 minutes late.

If you suspect duplicates:
1) Run `cron.list`.
2) Look for multiple jobs with the **same** `schedule.at` (or multiple recent adds for the same ET minute).
3) Keep the **earliest created** job for that `schedule.at` and remove the others.
4) Post a one-line note in the next tick:
   - `Blocked: duplicate tick jobs detected | Tried: cron.list scan | Options: remove duplicates / rename jobs w/ ET | Next: add duplication guard to checklist`

Tip: include the ET time in the job name (e.g. `OnionReel build tick (one-shot @ 1:09 ET)`) so duplicates are obvious.

**If `deleteAfterRun` isn’t honored** (implementation-dependent):
- Add a one-line note to the tick’s “Next” to manually remove the previous job after the next tick runs.
- Or schedule a follow-up cleanup job (remove by jobId) if/when the cron API supports it.

---

## If the chain breaks (no tick fired)
### Symptom A: No Telegram tick in >15 minutes
Likely cause: cron job failed to schedule or crashed.

Recovery checklist:
1) **Manually trigger** a tick (run the job immediately / run the prompt once).
2) In that run, ship a tiny reliability improvement:
   - Add a note describing the failure mode and how it was detected.
3) Ensure the run ends by creating the next `at` job.

### Symptom B: Tick fired but didn’t post to Telegram
Likely cause: delivery misconfigured.

Fix:
- Ensure cron job delivery is configured to:
  - `mode: announce`
  - `channel: telegram`
  - `to: -5020096204`

### Symptom C: Tick posts but doesn’t reschedule
Fix:
- Treat as **P0**: next run must be scheduled first.
- The “Next” line should be: `Repair: self-rescheduling cron job contract + add guardrails.`

---

## What to ship when reliability is the priority (safe improvements)
- A checklist/rubric update (e.g., add missing gates).
- A runbook update (this file).
- A template snippet that reduces operator error.

Avoid in reliability‑repair mode:
- Large refactors
- Anything that can break messaging/scheduling

---

## References
- Tick checklist: `BUILD_TICK_QUALITY_CHECKLIST.md`
- Quality scoring: `QUALITY_RUBRICS.md`
- Loop “source of truth”: `LOOP.md`
- Templates: `TICK_ARTIFACT_TEMPLATES.md`
