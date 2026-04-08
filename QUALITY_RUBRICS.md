# OnionReel — Quality Rubrics (Fast, Repeatable)

Purpose: give every 10‑minute build tick a **consistent bar** so changes compound instead of drifting.

Use alongside: `BUILD_TICK_QUALITY_CHECKLIST.md`.

---

## 0) Which rubric should I use? (30-second decision tree)
Pick the **one** that matches your primary artifact.

- **Doc / spec / checklist / runbook (markdown):** use **A) Doc change rubric**
- **Prompt / workflow / step-by-step pipeline spec:** use **B) Prompt / workflow spec rubric**
- **Code / scripts / automation:** use **C) Script/automation change rubric**
- **Structured plan/state (JSON configs, roadmaps):** use **D) Roadmap / JSON change rubric**

If you’re unsure, ask:
1) “Will someone execute this as steps?” → **B**
2) “Will a machine parse this?” → **C** (code) or **D** (JSON)
3) “Is this guidance humans will read?” → **A**

**When a tick touches multiple files:**
- Choose **one primary artifact** and score only that rubric.
- Any other edits must be purely supportive (links, references, small consistency fixes).

---

## A) Doc change rubric (0–2 each, target ≥9/12)
1) **Clarity**
- 0: ambiguous / jargon-heavy
- 1: mostly clear, minor ambiguity
- 2: could be followed by someone new in one pass

2) **Actionability**
- 0: describes goals only
- 1: has steps but missing specifics
- 2: contains concrete steps + acceptance criteria

3) **Durability**
- 0: likely to go stale (dates, temporary links)
- 1: somewhat durable
- 2: references canonical files/paths; minimal time-sensitive content

4) **Single source of truth**
- 0: duplicates/conflicts with canonical docs
- 1: ok but scattered
- 2: updates the canonical file or clearly points to it

5) **Scanability**
- 0: wall of text
- 1: mixed
- 2: headings + bullets + short sections; “what/why/how” obvious

6) **Verification**
- 0: no way to confirm the change worked / is applied
- 1: partial ("review this section") but missing specifics
- 2: one-step verification (command to run or exact section to read)

---

## B) Prompt / workflow spec rubric (0–2 each, target ≥8/10)
Use this when you ship **prompts, pipelines, or step-by-step workflows**.

1) **Inputs defined** (files, assets, constraints)
- 0: inputs are implied / missing (reader must guess)
- 1: some inputs listed, but incomplete or vague
- 2: explicit inputs + where they live (paths) + constraints (length, tone, platform)

2) **Outputs defined** (deliverables + formats)
- 0: output is “a good result” (undefined)
- 1: outputs listed but missing format details
- 2: outputs named + exact format(s) (JSON fields, filenames, headings, etc.)

3) **Acceptance tests** (how we know it worked)
- 0: no pass/fail check
- 1: subjective check only (“looks good”)
- 2: at least 1 objective check (e.g., “produces 3 variants”, “includes CTA + disclaimer”, “no placeholders left”)

4) **Edge cases** (2–3 common failure modes + fixes)
- 0: none listed
- 1: edge cases listed but no mitigation
- 2: 2–3 likely failures + a concrete fix/branch for each

5) **Cost/safety** (no accidental publishing/spend; rate limits noted)
- 0: could accidentally publish/send/spend
- 1: mentions safety but not enforceable
- 2: safe-by-default instructions (dry-run, “do not send”, explicit confirmation step) + any rate/cost notes

---

## C) Script/automation change rubric (0–2 each, target ≥9/12)
Score each dimension 0–2.

1) **Safe by default** (dry-run or read-only unless explicitly confirmed)
- 0: can publish/send/spend/mutate state by default
- 1: mentions safety but not enforced
- 2: dry-run/read-only default + explicit confirm flag for writes

2) **Idempotent** (re-running doesn’t corrupt state)
- 0: rerun likely duplicates/breaks outputs
- 1: mostly safe but some repeated side effects
- 2: rerun produces same state or cleanly overwrites with versioning

3) **Observability** (clear logs + exit codes)
- 0: silent/unclear; always exit 0
- 1: some logs but missing context or error codes
- 2: concise logs + meaningful exit codes + prints where outputs went

4) **Failure handling** (retries/backoff or clear detection)
- 0: failures are hidden or ambiguous
- 1: detects failure but no guidance
- 2: detects + explains + suggests a fix (and retries/backoff if relevant)

5) **Rollback** (how to revert outputs/state)
- 0: no rollback path
- 1: partial rollback (“delete outputs”) but unclear
- 2: explicit rollback steps (files to remove, flags to revert, or safe re-run)

6) **Docstring/usage** (`--help` or README snippet)
- 0: no usage / required args are unknown
- 1: usage exists but missing examples or constraints
- 2: `--help` + 1 copy/paste example + notes on inputs/outputs

---

## D) Roadmap / JSON change rubric (0–2 each, target ≥8/10)
Use this when you ship changes to structured plan/state files like:
- `CONTINUOUS_BUILD_ROADMAP.json`
- any tick logs, config-like JSON, or machine-read files

1) **Schema clarity** (fields + meaning are obvious)
- 0: keys/values unclear; magic strings
- 1: mostly clear but missing notes
- 2: fields are self-explanatory and/or documented in-file (comments not allowed in JSON → document nearby in markdown)

2) **Minimal diff / stable ordering** (reviewable changes)
- 0: noisy reformat / reordered keys for no reason
- 1: mostly minimal but some churn
- 2: only the necessary lines changed; ordering preserved

3) **Backwards safety** (doesn’t break consumers)
- 0: rename/remove fields without migration
- 1: change is safe but not called out
- 2: any breaking change is avoided, or explicitly documented with a migration note

4) **State semantics** (progress can’t “lie”)
- 0: statuses/steps can regress or become inconsistent
- 1: mostly consistent but edge cases exist
- 2: rules are explicit (e.g., allowed status transitions) and enforced by convention

5) **Verification** (one-step sanity check)
- 0: none
- 1: manual eyeballing only
- 2: includes a 1-liner check (e.g., `jq . CONTINUOUS_BUILD_ROADMAP.json` or a specific `jq` query)


## E) “One tick = one artifact” rule
Every tick should produce **exactly one primary artifact**:
- a file added/updated, or
- a script improved, or
- a canonical roadmap/spec tightened.

If you need multiple files, make one the primary and keep the rest purely supportive (links, references).

---

## F) Tick Definition of Done (DoD)
A tick is done when:
- The change passes the relevant rubric target score.
- The repo contains enough context to use the change immediately.
- You logged the ship + next step in `memory/YYYY-MM-DD.md`.

---

## G) Rubric scoring cheat sheet (fast pass/fail)
Use this when you’re rushing.

- **0 = missing** (would confuse future-you)
- **1 = acceptable** (works, but could be tighter)
- **2 = strong** (clear, testable, durable)

**If you score below target:**
1) Fix the lowest-scoring item first (usually Actionability or Single source of truth)
2) If still too big: write a mini-spec + set “Next” to the smallest atomic follow-up

**Hard stops (always fix before shipping):**
- Mentions a doc/script but no path/filename
- Introduces a second “canonical” source (conflicts/duplicates)
- Any risk of accidental publishing/spend

---

## H) Tick ship note template (copy/paste)
Use this to keep ticks comparable and easy to review.

```
Primary artifact: <file/path>
Change: <one sentence>
Verification: <how to verify in 1 step (command or “read section X”)>
Rubric: <which rubric + score (e.g., Doc 10/12; Prompt/Workflow 8/10; Script 9/12)>
Next: <one-tick follow-up>
```

---

## I) Common failure patterns → quick fixes (use during a tick)
When a draft feels “almost there”, it’s usually one of these.

1) **Vague verbs** (“improve”, “optimize”, “make better”)
- Fix: replace with an observable action ("add a checklist", "rename X to Y", "define acceptance criteria", "add a command that verifies")

2) **Missing the *one-step verification***
- Fix: add either:
  - a single command to run, or
  - a precise pointer ("Read section: <heading> in <file>")

3) **Two sources of truth** (same info in 2 places)
- Fix: pick the canonical file; in the other place, replace content with a link + one-line summary.

4) **Too much scope for one tick**
- Fix: ship the smallest “spine” version (outline + placeholders removed), set Next to the first deepening pass.

5) **Unsafe by default** (anything that can send/publish/spend)
- Fix: make default behavior read-only/dry-run; require explicit `--confirm` / `--apply`.

### 60-second self-review
Before shipping, answer:
- What changed (1 sentence)?
- Where is it (exact path)?
- How do I verify it (1 step)?
- What is the next atomic follow-up (1 tick)?

---

## J) Rubric scoring worksheet (copy/paste)
Use this when you want a fast, explicit score without thinking about formatting.

### J1) Doc change rubric worksheet (target ≥9/12)

| Dimension | 0 | 1 | 2 | Score |
|---|---:|---:|---:|---:|
| Clarity |  |  |  |  |
| Actionability |  |  |  |  |
| Durability |  |  |  |  |
| Single source of truth |  |  |  |  |
| Scanability |  |  |  |  |
| Verification |  |  |  |  |
| **Total** |  |  |  |  |

### J2) Prompt / workflow spec worksheet (target ≥8/10)

| Dimension | 0 | 1 | 2 | Score |
|---|---:|---:|---:|---:|
| Inputs defined |  |  |  |  |
| Outputs defined |  |  |  |  |
| Acceptance tests |  |  |  |  |
| Edge cases |  |  |  |  |
| Cost/safety |  |  |  |  |
| **Total** |  |  |  |  |

### J3) Script/automation rubric worksheet (target ≥9/12)

| Dimension | 0 |  1 | 2 | Score |
|---|---:|---:|---:|---:|
| Safe by default |  |  |  |  |
| Idempotent |  |  |  |  |
| Observability |  |  |  |  |
| Failure handling |  |  |  |  |
| Rollback |  |  |  |  |
| Docstring/usage |  |  |  |  |
| **Total** |  |  |  |  |

---

## K) Plain-text (no-tables) scoring worksheets
Use this when you’re posting a score in chat (Discord/WhatsApp) or anywhere tables render badly.

**How to use:** copy/paste one block, replace `_` with 0/1/2, add totals.

### K1) Doc change rubric (target ≥9/12)
- Clarity: _/2
- Actionability: _/2
- Durability: _/2
- Single source of truth: _/2
- Scanability: _/2
- Verification: _/2
- Total: __/12

### K2) Prompt / workflow spec rubric (target ≥8/10)
- Inputs defined: _/2
- Outputs defined: _/2
- Acceptance tests: _/2
- Edge cases: _/2
- Cost/safety: _/2
- Total: __/10

### K3) Script/automation change rubric (target ≥9/12)
- Safe by default: _/2
- Idempotent: _/2
- Observability: _/2
- Failure handling: _/2
- Rollback: _/2
- Docstring/usage: _/2
- Total: __/12

---

## L) Build Tick update message rubric (Telegram/Chat) (0–2 each, target ≥7/10)
Use this when posting the **OnionReel Build Tick** message so updates stay crisp and comparable.

1) **One-line Shipped** (specific + artifact)
- 0: vague (“improved docs”)
- 1: specific but missing artifact
- 2: states change + exact file/path

2) **One-line Next** (atomic + immediately actionable)
- 0: big/ambiguous (“finish dashboard”)
- 1: actionable but too large
- 2: single-tick follow-up that can be shipped in ≤10 min

3) **No drift / aligns to roadmap**
- 0: unrelated to current roadmap step
- 1: loosely related
- 2: clearly advances the current/next step in `CONTINUOUS_BUILD_ROADMAP.json`

4) **Verification implied** (optional, but preferred)
- 0: no way to validate
- 1: validation is possible but not implied
- 2: implies a 1-step verify (e.g., “read section X”, “run jq …”)

5) **Formatting consistency**
- 0: missing header or bullets; hard to scan
- 1: mostly consistent
- 2: exactly matches the canonical format below

### Canonical chat format (copy/paste)
```
OnionReel Build Tick
- Shipped: <one line>
- Next: <one line>
```

**Hard stop:** never post more than 1 “Shipped” line (keep 1 tick = 1 artifact).

---

## M) Tick log line rubric (memory/YYYY-MM-DD.md) (0–2 each, target ≥6/8)
Use this when appending a line under **OnionReel Loop Log** so the history stays searchable and useful.

1) **Timestamp correctness**
- 0: missing / inconsistent format
- 1: present but ambiguous (no leading zeroes, inconsistent separators)
- 2: `HH:MM` 24h local time and matches the tick’s “Current time”

2) **Shipped is specific + points to an artifact**
- 0: vague (“updated docs”)
- 1: specific but no file/path
- 2: includes the exact file/path (or script) that changed

3) **Next is atomic**
- 0: big/unclear (“finish workflow engine”)
- 1: actionable but could sprawl
- 2: single follow-up that can be shipped in ≤1 tick

4) **Searchable keywords** (optional but preferred)
- 0: none
- 1: some nouns but not consistent
- 2: includes at least one stable keyword (e.g., `rubric`, `checklist`, `runbook`, `roadmap`, `cron`) so grep finds it later

### Canonical format (do not improvise)
```
HH:MM — Shipped: <what> | Next: <next>
```

**Hard stop:** never add multiple Shipped items; if you did 2 things, pick 1 primary artifact and move the other to Next.
