# OnionReel GitHub Persistence v1

## Goal
Every ship is committed + pushed so progress is parallel + recoverable.

## Policy
- One commit per build tick
- Include: roadmap JSON + shipped artifact(s) + ops changes
- Commit message format: "OnionReel: <stepId> <short ship>"

## Implementation Options
1) Simple: build_tick calls `git add -A && git commit -m ... && git push` (requires auth)
2) Safer: separate shipper script invoked by runner that only commits when changes exist

## Acceptance Criteria
- Repo has clean history of incremental ships
- Remote is up to date after each tick
