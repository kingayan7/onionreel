# OnionReel Dashboard — Operational Checklist (P16-S7)

Goal: A non-technical operator can generate a complete reel/creative pack from the dashboard with zero chat.

## Pre-flight
- [ ] OnionReel dashboard server is running (local): open the dashboard URL
- [ ] Project exists (e.g. `maxcontrax-reel-v1`)
- [ ] Cost controls are set (Sora clip limits/retries)

## Smoke Test: End-to-end pack generation
1) **Create Request**
- [ ] Open **Requests** tab
- [ ] Set `projectId`
- [ ] Select steps (Sora → Remotion → QC)
- [ ] Click **Generate Pack**

2) **Run the chain**
- [ ] Click **Run Full Chain**
- [ ] Confirm the Jobs queue transitions: `queued → running → done`

3) **Verify downloads**
- [ ] In Requests panel: Latest Downloads shows new files
- [ ] In **Library** tab: renders/exports list and are downloadable
- [ ] Download the 30s MP4 and confirm it plays

## Failure & Recovery
- [ ] If a job fails: go to **Jobs** tab → click **Retry**
- [ ] If Sora moderation blocks a prompt: adjust prompts (project blueprint) and retry
- [ ] If Remotion fails: re-run `remotion_render` after ensuring clips are present

## Acceptance Criteria (Operational)
- [ ] Operator can generate a reel pack without CLI
- [ ] Failures are visible in Jobs list
- [ ] Downloads are always reachable via `/dl/autoedit/...`
