# OnionReel — Tick Artifact Templates

Purpose: make it easy to ship one **clean, reusable artifact** per 10‑minute tick.

Use with:
- `BUILD_TICK_QUALITY_CHECKLIST.md`
- `QUALITY_RUBRICS.md`

---

## 1) Checklist template (fast SOP)
Copy/paste and fill.

```md
# <Title> — Checklist

## Goal
One sentence: what this checklist ensures.

## When to use
- <trigger 1>
- <trigger 2>

## Steps (≤10)
1) <action>
2) <action>
3) <action>

## Acceptance criteria
- [ ] <objective pass condition>
- [ ] <objective pass condition>

## Failure modes + detection
- <what breaks> → <how you notice>

## Rollback / undo
- <how to revert>
```

---

## 2) Mini-spec template (when work won’t fit in one tick)
Use this when the real work is too big; shipping the mini-spec is the artifact.

```md
# <Feature/Module> — Mini Spec (v1)

## Problem
What hurts today, in one paragraph.

## Non-goals
- <explicitly not doing>

## Inputs
- Files/assets:
- Constraints:

## Outputs
- Deliverables + formats:

## Approach
- Step 1:
- Step 2:

## Acceptance tests
- [ ] <test>
- [ ] <test>

## Edge cases
- <case> → <handling>

## Open questions / blockers
- <question> (owner: Craig/agent)
```

---

## 3) Prompt template (role + guardrails)

```md
# Prompt: <Name>

## Role
You are <role>.

## Objective
Create <output> that achieves <goal>.

## Inputs
- <input 1>
- <input 2>

## Constraints
- Must:
- Must not:

## Output format
- <exact format>

## Quality checklist (self-review)
- [ ] Clear hook in first 2 seconds
- [ ] One primary CTA
- [ ] On-brand (see `BRAND.md`)
- [ ] No prohibited claims
```

---

## 4) Script template (safe-by-default)

```py
"""<script name>

Purpose:
  <one sentence>

Usage:
  python <script>.py --help

Safety:
  - Default mode is dry-run/read-only.
  - Explicit flag required for any write/publish.

Outputs:
  - <files produced>
"""
```

---

## 5) One-line “Ship / Next” examples (good)
- Shipped: Added a 9-point QC checklist for packaging ad creatives (with acceptance criteria) | Next: Add a dry-run mode to `package_creatives_branded.py`.
- Shipped: Wrote a mini-spec for the 30–60s paid ad pipeline (inputs/outputs/tests) | Next: Add a prompt template for script → shotlist.
