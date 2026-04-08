# OnionReel — Build Tick Quality Checklist

Use this for every 10‑minute build tick (cron). Goal: **one small, shippable improvement** that compounds.

## 0a) Ultra-compact checklist (60 seconds)
If you do nothing else, do this:
1) Pick **one** shippable change (name the exact file + section).
2) Refresh the build-tick payload timestamp:
   - Preferred: run `./onionreel/scripts/refresh_cron_payload.py`
   - Or: open `onionreel/_cron_payload.txt` and refresh the **Current time** line manually.
3) Compute **now + 10 minutes (ET)** and keep it ready as `schedule.at`.
4) Prepare your one-liners (must match exactly everywhere):
   - `Shipped: …`
   - `Next: …`
5) **Before the tick ends:** schedule the next one-shot cron job (and verify it exists).
6) Capture the **jobId** you just created (paste it into the memory log line if possible). This makes it trivial to debug “missed ticks”.

If blocked: ship a tiny “Blocker + options” note, post it, and still schedule next tick.

## 0) Definition of “shippable” (for this repo)
A change is **shippable** if:
- It’s committed-ready (even if we don’t commit right now)
- It improves clarity, correctness, automation, or deliverables
- It has a clear “before → after”
- It does **not** require additional context to be useful

Avoid: half-written docs, TODO-only changes, vague notes without decisions.

## 0b) Chain safety (don’t break the loop)
This repo’s build chain only works if the **next tick is always scheduled**.

- **By minute 2:** decide what you’ll ship **and** ensure the next tick is schedulable.
- **If anything feels risky/unknown:** schedule the next tick *first*, then ship the smallest safe doc change.
- **If blocked:** ship a 5–10 line “Blocker + options” note in a relevant file and keep the chain alive.

(Practically: a tick that ships nothing but keeps the loop alive is better than a perfect tick that breaks scheduling.)

## 0c) Stop-ship triggers (don’t publish bad status)
If any of these are true, **do not** post “Shipped” as if it’s done. Post a blocker line instead.

- You didn’t actually change a file under `onionreel/`.
- You changed a file but didn’t meet the checklist’s own definition of shippable (section 0).
- You haven’t scheduled the next tick yet (chain safety beats status updates).
- Your `Shipped:` / `Next:` one-liners are not identical across memory + Telegram (see 0i).

**Fallback:** ship a tiny doc note capturing what you learned + what you’ll do next, then schedule the next tick.

## 0d) 30-second preflight (do this before you start writing)
This prevents the two most common failures: **prompt drift** + **wrong timestamp**.

- Open `onionreel/_cron_payload.txt` and confirm it still contains the canonical build-tick prompt.
- Sanity-check the **Current time** in the prompt:
  - If the prompt includes multiple “Current time:” lines (or conflicting timestamps), treat the **last** one as the intended reference.
  - **Fix it for next time:** when you refresh `onionreel/_cron_payload.txt`, ensure it contains **exactly one** `Current time:` line (delete older duplicates so future ticks don’t drift).
  - If you have any doubt, prefer the system’s actual clock (ET) and log that time.
- Compute **now + 10 minutes** in America/New_York and keep it ready as `schedule.at`.
- Pre-write your one-line statuses:
  - **Shipped:** “<specific file change>”
  - **Next:** “<one tick follow-up>”

If you can’t do these in 30 seconds, shrink scope until you can.

## 0e) Blocker reporting format (when you’re stuck)
If you’re blocked, don’t go silent. Ship a tiny note + keep the chain alive.

**Use this exact one-liner format in logs + Telegram (keep it tight):**
- `Blocked: <what> | Tried: <1 thing> | Options: <A/B> | Next: <smallest safe step>`

**Examples:**
- `Blocked: can’t locate file X | Tried: ripgrep for "X" | Options: search repo history / create new stub | Next: add stub + link from ROADMAP`
- `Blocked: unsure cron schema supports deleteAfterRun | Tried: checked BUILD_TICK_QUALITY_CHECKLIST | Options: schedule anyway / verify with cron.list next tick | Next: schedule job + verify`

## 0f) Next-tick cron job spec (copy/paste)
When you schedule the next run, **use an `at` one-shot job** (10 minutes out), and make it self-cleaning.

**Required intent:**
- `schedule.kind = "at"` (ISO timestamp **with timezone offset**, and set seconds to `:00` to avoid accidental “already passed” edge cases)
- `sessionTarget = "isolated"`
- `payload.kind = "agentTurn"` with **this same build-tick prompt**
- `delivery.mode = "announce"` to Telegram `-5020096204`
- `deleteAfterRun = true`
- `wakeMode = "now"`

**Naming + duplication guard (recommended):**
- Use a unique job name that includes the ET time (helps debugging + avoids confusion):
  - `"OnionReel build tick (one-shot @ 12:33 ET)"`
- Before adding, do a quick `cron.list` scan to ensure you’re not scheduling a second tick for the same `schedule.at` (double-firing is worse than being 1–2 minutes late).

**If you find duplicates (same `schedule.at`):**
- Keep the **earliest created** one-shot job.
- Remove the others immediately:
  - `{ "action": "remove", "jobId": "<duplicateJobId>" }`
- Then schedule the next tick normally.

**Job skeleton:**
```json
{
  "name": "OnionReel build tick (one-shot)",
  "schedule": { "kind": "at", "at": "2026-04-06T12:40:00-04:00" },
  "payload": { "kind": "agentTurn", "message": "<same build tick prompt>" },
  "delivery": { "mode": "announce", "channel": "telegram", "to": "-5020096204", "bestEffort": true },
  "sessionTarget": "isolated",
  "deleteAfterRun": true,
  "wakeMode": "now"
}
```

**Post-add verification (30 seconds):**
- Immediately after `cron.add`, run `cron.list` and confirm:
  - Exactly **one** one-shot tick exists for the intended `schedule.at`.
  - The job includes `sessionTarget:"isolated"`, `deleteAfterRun:true`, and `wakeMode:"now"`.
- If you can’t verify via tools, *assume nothing* — schedule another tick 11–12 minutes out and post a blocker line (better double-coverage than a broken chain).

**OpenClaw tool call (what you actually send):**
```json
{
  "action": "add",
  "job": {
    "name": "OnionReel build tick (one-shot)",
    "schedule": { "kind": "at", "at": "<ISO-with-offset>" },
    "payload": { "kind": "agentTurn", "message": "<same build tick prompt>" },
    "delivery": { "mode": "announce", "channel": "telegram", "to": "-5020096204", "bestEffort": true },
    "sessionTarget": "isolated",
    "deleteAfterRun": true,
    "wakeMode": "now"
  }
}
```

**Quick verification (<60s):** after scheduling, run/list jobs and confirm the new one-shot exists.

**If `deleteAfterRun` / `wakeMode` aren’t supported in your build:** still schedule the job.

**Fail-safe retry rule (important):** if `cron.add` errors because of unknown fields, immediately retry **without** `deleteAfterRun` and `wakeMode` (keep everything else the same). Then, on the next tick, remove old one-shot jobs manually (`cron.remove`).

The chain matters more than perfect job hygiene.

**Example verification tool call (copy/paste):**
```json
{ "action": "list", "includeDisabled": false }
```
Then confirm the newest `OnionReel build tick (one-shot)` shows the expected `schedule.at` timestamp.

## 0g) Canonical payload (avoid prompt drift)
To keep the build chain reliable, treat `onionreel/_cron_payload.txt` as the **single source of truth** for the next job’s `payload.message`.

**Rule:** when scheduling the next tick, copy the payload from `onionreel/_cron_payload.txt` and only update the final line:
- `Current time: <Day, Month ... — HH:MM AM/PM (America/New_York)>`

Everything else should remain identical so the chain doesn’t slowly drift.

**Verification (1 step):** open `onionreel/_cron_payload.txt` and confirm the `Current time:` line matches “now”, and the rest matches what you put in the cron job.

**Preferred helper:** run `./onionreel/scripts/refresh_cron_payload.py` before scheduling to update only the `Current time:` line.

**Payload update helper (print the exact `payload.message` with a fresh Current time line):**
```bash
python3 - <<'PY'
from datetime import datetime
from zoneinfo import ZoneInfo
import re, pathlib

def ordinal(n: int) -> str:
    return str(n) + ('th' if 11<=n%100<=13 else {1:'st',2:'nd',3:'rd'}.get(n%10,'th'))

dt = datetime.now(ZoneInfo('America/New_York'))
pretty = dt.strftime('%A, %B ') + ordinal(dt.day) + dt.strftime(', %Y — %-I:%M %p (America/New_York)')
text = pathlib.Path('onionreel/_cron_payload.txt').read_text()
text = re.sub(r'^Current time:.*$', f'Current time: {pretty}', text, flags=re.M)
print(text)
PY
```

## 0h) Timestamp sanity (avoid UTC/offset mistakes)
When setting `schedule.at`, always include the local offset for America/New_York.

- Example for 8:49 AM ET on Apr 6, 2026 → `2026-04-06T08:49:00-04:00`
- If you only have “Current time” in the prompt: add **10 minutes**, keep the same date unless it crosses midnight.

**Quick check:** the timestamp’s `HH:MM` should match “now + 10 minutes” in ET.

**10-minute timestamp helper (preferred):**
```bash
./onionreel/scripts/next_tick_at.py
```

**Full next-tick cron job JSON helper (preferred when scheduling):**
```bash
./onionreel/scripts/next_tick_job_json.py
```

**Alternative (one-liner Python 3):**
```bash
python3 -c "from datetime import datetime,timedelta; from zoneinfo import ZoneInfo; dt=datetime.now(ZoneInfo('America/New_York'))+timedelta(minutes=10); off=dt.strftime('%z'); off=off[:-2]+':'+off[-2:]; print(dt.strftime('%Y-%m-%dT%H:%M:00')+off)"
```

## 0i) Telegram + log sanity (prevent mismatched status lines)
Before you post/log, do a quick consistency check:
- **Exact match:** the `Shipped:` and `Next:` lines must be identical (character-for-character) between:
  - `memory/YYYY-MM-DD.md` (OnionReel Loop Log)
  - Telegram status message
- **Single line each:** no extra line breaks; if needed, shorten wording.
- **Concrete nouns:** include the file path in `Shipped:` and the target file path in `Next:`.

**<30s verification:** copy the final two lines you will send to Telegram, then paste the same two lines into the memory log entry (no edits in between).

### 0i.1) Use the formatter script (preferred)
To eliminate mismatch risk entirely, generate both outputs from the same inputs:

```bash
./onionreel/scripts/format_tick_status.py \
  --shipped "<one line>" \
  --next "<one line>"
```

Then copy/paste:
- the **Memory log line** into `memory/YYYY-MM-DD.md`
- the **Telegram** block into chat

## 1) Pick the right size (10-minute constraint)
Choose changes that can be finished in one tick:
- Add a checklist/rubric
- Tighten requirements / acceptance criteria
- Add a small script with usage + safety notes
- Update one roadmap step with concrete outputs

If it’s bigger: write a **mini-spec** + split into follow-ups.

## 1b) Put the artifact in the right place (location + naming)
Keep the repo navigable: **where you ship is part of quality**.

**Canonical docs (single source of truth):**
- Root `/onionreel/`: `LOOP.md`, `ROADMAP.md`, `QUALITY_RUBRICS.md`, `BUILD_TICK_QUALITY_CHECKLIST.md`

**Knowledge base (how-to / reference):**
- `/onionreel/kb/` (e.g. `VIDEO_AD_PRODUCTION_KB.md`)

**Automation/scripts:**
- `/onionreel/scripts/` (must be safe-by-default; include usage)

**Generated outputs / artifacts:**
- `/onionreel/out/<type>/...` (include an `index.html` and/or `prompts.json` when relevant)

**Naming (keep it sortable):**
- Prefer prefixes like `001-...`, `002-...` for batches.
- If it’s a template/spec, include a version marker like `(v1)` in the title.

## 2) Quality gates (must pass)
- **Single source of truth:** update or reference the canonical file (prefer: `LOOP.md`, `ROADMAP.md`, `CONTINUOUS_BUILD_ROADMAP.json`).
- **Actionable:** contains steps, criteria, or commands someone can run.
- **No secrets:** never paste API keys, tokens, personal addresses, or private links.
- **Plain language:** avoid buzzwords unless defined.

### 2b) If you touched code or automation (extra gates)
- **Dry-run safe:** include a “how to run” that can’t accidentally publish/post/spend money.
- **Failure mode captured:** add 1–2 bullets: what can break + how to detect it.
- **Rollback path:** one sentence on how to revert (file, commit, or config knob).

### 2c) If you touched docs/prompts (extra gates)
- **Skimmable:** headings + bullets; no dense paragraphs unless absolutely required.
- **Link hygiene:** prefer repo-relative paths (e.g. `onionreel/LOOP.md`) over external links; if an external link is necessary, add a 3–8 word “why it matters” label.
- **Copy/paste ready:** any templates/snippets compile as-is (no placeholder angle brackets left behind unless explicitly a template).
- **Consistency:** match existing terminology (e.g. “tick”, “shippable”, “rubric”) and avoid introducing new names for the same thing.

### 2d) Verification step (required for every tick)
Add **one** quick verification line you can run/confirm in <60 seconds.
- Docs: “Read section X in `path/to/file.md`”
- Scripts: “Run `node scripts/foo.mjs --help`” or “Run `./scripts/foo.sh --dry-run`”
- Data/artifacts: “Open `onionreel/out/.../index.html` and confirm …”

If you can’t verify, the change is probably not shippable yet — shrink scope until it is.

## 2e) Pick the right rubric (required)
Use `onionreel/QUALITY_RUBRICS.md` to self-score before you ship.

- **Docs (most ticks):** use *Doc change rubric* — target **≥9/12**
- **Prompts / workflow specs:** use *Prompt / workflow spec rubric* — target **≥8/10**
- **Scripts/automation:** use *Script/automation change rubric* — target **≥9/12**

Write the rubric + score in your own head (or in a ship note if it helps). If you’re below target, fix the lowest scoring dimension first (usually Actionability or Verification).

## 2f) Optional: capture the rubric score (fast, plain-text)
If you have 30–60 seconds, copy/paste a plain-text worksheet from `onionreel/QUALITY_RUBRICS.md` (section **K**) into your scratchpad while drafting.

Rule of thumb:
- Don’t post rubric scores to Telegram (keep status tight).
- Do keep a score privately if you’re on the edge of shipping (it catches “missing verification” fast).

## 3) Logging format (required)
Append to `memory/YYYY-MM-DD.md` under **OnionReel Loop Log** using **24h local time (America/New_York)**:

```
HH:MM — Shipped: <what> | Next: <next>
```

Rules:
- `HH:MM` is 24h (e.g., `16:41`, not `4:41 PM`).
- Keep `Shipped:` and `Next:` to **one line each** (no line breaks).
- Include the primary file path in `Shipped:` and the target file path in `Next:`.

## 4) Telegram status template (required)

```
OnionReel Build Tick
- Shipped: <one line>
- Next: <one line>
```

### 4b) One-line “Shipped/Next” examples (good vs bad)
Keep these **atomic** and **file-specific**.

**Good (Shipped):**
- "Added section 4b (one-line examples) to `onionreel/BUILD_TICK_QUALITY_CHECKLIST.md`"
- "Tightened `onionreel/LOOP.md` header with links to checklist + rubrics"

**Bad (Shipped):**
- "Improved docs" (too vague)
- "Worked on quality" (non-verifiable)

**Good (Next):**
- "Update `onionreel/LOOP.md` header to link checklist + rubrics + templates + runbook"
- "Add 3 bullet ‘Tick DoD’ to `onionreel/LOOP.md`"

**Bad (Next):**
- "Finish OnionReel" (not one tick)
- "Make it better" (no acceptance criteria)

## 5) “Next” should be pre-scoped
Your “Next” line must be something that fits in one tick. If uncertain, phrase it as:
- “Draft: …”
- “Add: …”
- “Tighten: …”
- “Wire: …”

## 6) If blocked
Still do three things:
1) Ship a small doc improvement capturing the blocker + options
2) Post the blocker to Telegram
3) Schedule the next tick (do not break the chain)

### 6b) Blocker mini-template (copy/paste)
Use this when you can’t complete a planned change within the tick.

- **Blocker:** <one sentence>
- **Impact:** <what it prevents>
- **Options (pick 1 next tick):**
  - A) <smallest safe path>
  - B) <fallback>
- **Unblock check (<60s):** <how we’ll know it’s resolved>

## 7) Micro-rubric (quick self-review before you ship)
Score each 0/1. Target **≥5/6**.
- **Specific:** names exact file(s)/path(s) touched.
- **Verifiable:** has an objective check (command, output, or acceptance criteria).
- **Scoped:** can be completed within the 10-minute tick.
- **Durable:** won’t go stale immediately (dates/links minimized, decisions captured).
- **Non-duplicative:** doesn’t conflict with existing canonical docs.
- **Readable:** a future-you can apply it in <60 seconds.

## 8) Common failure modes (avoid these)
- “Added TODOs” with no decision or next action.
- Checklists that are too long to actually run per tick.
- Vague ‘improve X’ notes without acceptance criteria.
- Multiple changesets in one tick (keep it one improvement).
