# OnionReel Build Tick — One-liners

Use this when you need a *clean*, copy/paste “Shipped / Next” that fits in:
- the memory log line
- the Telegram build tick post
- the cron payload

## Rules (keep it shippable)

A good one-liner is:
- **specific** (names the file/thing changed)
- **verifiable** (someone can open it and see what changed)
- **small** (one improvement only)
- **forward-linked** (Next points to the *very next* concrete action)

Avoid:
- vague (“improved docs”, “worked on roadmap”)
- multiple ships in one line
- future plans disguised as ships

## Copy/paste templates

### Ship line

- Shipped: <verb> <artifact> (<why in 3–6 words>)

Examples:
- Shipped: Added `STEP_P2-S1.md` acceptance criteria (clear DoD)
- Shipped: Linked `QUALITY_RUBRICS.md` + checklist from `LOOP.md` (hard to miss)
- Shipped: Added “blocked” one-liner format to `BUILD_TICK_QUALITY_CHECKLIST.md` (faster recovery)

### Next line

- Next: <single next action> (start with a verb)

Examples:
- Next: Outline the P2-S1 30–60s ad pipeline steps (draft v1)
- Next: Add the first worked example to P2-S1 (capture→edit→export)
- Next: Mark one roadmap step DONE/DOING (advance %)

## Timestamp (for the memory log line)

Use **24-hour time (ET)** for the `memory/YYYY-MM-DD.md` loop log line.

Examples:
- `16:46 — Shipped: Added 24h timestamp examples to BUILD_TICK_ONE_LINERS.md (reduces format drift) | Next: Outline P2-S1 paid ad pipeline steps (draft v1)`
- `03:05 — Shipped: Linked checklist from LOOP.md (hard to miss) | Next: Mark one roadmap step DOING (advance %)`

## 10-second self-check

Before posting:
- Can I point to *one* file/commit that proves “Shipped”?
- Could someone else do “Next” without asking me what I meant?
