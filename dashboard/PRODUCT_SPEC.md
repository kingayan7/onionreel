# OnionReel Dashboard — Official App Spec (Fictional but buildable)

> Goal: You never need to message an operator to create reels/creatives/promotional packs.
> The dashboard is the product: **Request → Generate → Review → Iterate → Export → Publish**.

## 0) North Star
OnionReel is a self-serve “creative factory” web app that:
- Accepts a creative brief (or template)
- Generates all assets (video variants + captions + thumbnails + export packs)
- Tracks cost/time + job health
- Stores every artifact with provenance (what prompts, what inputs, what model)
- Supports iteration loops (v1 → v2 → v3) with diff + A/B

The UI feels like modern SaaS (Notion/Linear/Webflow vibes): clean typography, left nav, clear status chips, activity feed, audit logs.

## 1) Information Architecture (App Layout)
### Left navigation
- **Dashboard** (overview)
- **Create** (new request wizard)
- **Projects** (all brands/campaigns)
- **Jobs** (queue + logs)
- **Library** (all media/artifacts)
- **Templates** (reusable packs)
- **Settings** (cost caps, models, defaults)

### Global UI patterns
- Status chips: `Queued`, `Running`, `Done`, `Failed`, `Cancelled`
- Prominent “Generate” button
- Right-side panel for “Details & Logs”
- “Download” always available as a primary action

## 2) Core Objects (mental model)
### Request
A single generation intent.
Fields:
- `requestId`, `projectId`, `createdAt`
- Target: `platform` (IG/TikTok/YT Shorts), `duration` (30/15/6)
- Creative: `script`, `beats`, `captionStyle`, `visualStyle`
- Engine: `clipSource` (Sora/Stock/Mixed), `renderEngine` (Remotion), `captionEngine` (Remotion)
- Outputs: pointers to render artifacts + export packs

### Job
A unit of work in the Brain queue.
- Types: `sora_generate`, `remotion_render`, `qc_export`, `zip_pack`, `thumbs_generate` (future)
- Includes `payload`, `attempts`, `maxAttempts`, `stdout/stderr`, `lastError`

### Artifact
A stored output: clips, renders, JSON packs, thumbnails.
- Immutable, content-addressed or at least timestamped
- Always tied to a `projectId` and ideally `requestId`

## 3) Create Flow (Wizard)
### Step 1 — Choose Template
- “SaaS Authority Ad (30s + cutdowns)”
- “UGC Fast Cuts”
- “Founder Story”
- “Promo Pack (Thumbnails + Shorts + Captions)”

### Step 2 — Brief
Simple mode:
- Brand/Project
- Offer
- CTA URL
- Tone (Authority / Friendly / Aggressive)

Advanced mode (expand):
- VO script (textarea)
- On-screen beats (structured editor)
- Sora prompts per beat (optional)
- Model overrides

### Step 3 — Generate
- Shows an execution plan (job bundle)
- Shows estimated cost/time
- `Generate` enqueues bundle and starts processing

### Step 4 — Review
- Inline MP4 player
- Timeline of variants
- Caption preview
- “Regenerate clips”, “Rerender”, “Make 3 alternates” actions

### Step 5 — Export
- Download zip
- Export manifest
- Platform presets (Reels/TikTok)

## 4) Jobs / Reliability UX
- Jobs list with expandable rows
- Per-job log viewer (stdout/stderr)
- Retry/cancel
- Clear error messages (moderation, missing files, ffmpeg errors)

## 5) Library
- Filter by project/type/date
- “Latest pack” pinned per project
- One-click download of latest mastered outputs

## 6) Settings
- Cost caps (Sora max clips/run, retries)
- Default styles
- Model selection

## 7) Success Criteria
The dashboard is considered **fully operational** when:
1) A user can generate a reel pack end-to-end from the UI
2) The UI shows job status + logs + errors
3) The UI provides downloads for MP4s + export pack zip
4) No chat interaction required
5) “Simple mode” works in <60 seconds to start a run

## 8) Implementation Notes (mapped to current OnionReel)
- Use existing Brain SQLite queue (`brain/jobs.db`)
- Add endpoints to enqueue bundles and run worker loop
- Persist requests under `dashboard/data/requests.jsonl` (MVP)
- Artifacts remain in `autoedit/` and `artifact_store/`
