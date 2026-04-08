# OnionReel 24/7 Continuous Loop (Growth OS style)

## Purpose
Relentless iteration: ship small improvements continuously, compound into a production “monster.”

## Loop cadence
- Default: **every 10 minutes, 24/7**.
- Each cycle must produce **one shippable delta** (doc, checklist, prompt, architecture decision, code).
- Each cycle must also **advance the roadmap** in `onionreel/CONTINUOUS_BUILD_ROADMAP.json` (set one step to doing/done) so the overall % always reflects reality.

## Definition of Done (for each cycle)
1) Pick the highest-leverage next move (dashboard / brain / knowledge / quality system).
2) Create or update an artifact in `/Users/adrianissac/.openclaw/workspace/onionreel/`.
3) Add a short log entry to `memory/2026-04-06.md` under **OnionReel Loop Log**:
   - what changed
   - why
   - next step
4) If blocked: write the question(s) into `onionreel/ROADMAP.md` → **Blockers / Questions for Craig**.

## Operating principles
- **Speed + quality**: default to a v1 that works, then harden.
- **Moat first**: build the Quality System (rubrics + QC) as the core differentiator.
- **Templates beat opinions**: SOPs, checklists, and prompts that are reusable.
- **Auditability**: decisions recorded; versions tracked.

## Quick links (start every tick here)
- Roadmap (source of truth): `onionreel/CONTINUOUS_BUILD_ROADMAP.json`
- Quality checklist: `onionreel/BUILD_TICK_QUALITY_CHECKLIST.md`
- Quality rubrics: `onionreel/QUALITY_RUBRICS.md`
- Templates: `onionreel/TICK_ARTIFACT_TEMPLATES.md`
- Runbook (loop reliability): `onionreel/BUILD_CHAIN_RUNBOOK.md`

## Workstreams (rotating)
- Quality System (rubrics, checklists, automated QC tests)
- Workflow design (brief → final; variants; repurposing)
- Prompt library (role-based; guardrails)
- Dashboard spec (modules, data model, views)
- Brain spec (job runner, retries, logs, connectors)
- Integrations (Drive/Frame.io/Dropbox; NLE exports)
