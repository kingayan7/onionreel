# OnionReel Telegram Control Surface v1

## Commands

### /status
- Returns: roadmap % + last shipped + runner freshness stamps

### /projects
- Returns: list of projects from dashboard store (top 10)

### /run <jobType>
- Enqueues a brain job (writes to onionreel/brain/jobs.json)

## Implementation Notes
- OpenClaw slash commands can be added later. For now, use message parsing inside the agent loop or a small dispatcher script.
- The MVP goal is: operator can ask for status and trigger a job from Telegram.

## Acceptance Criteria
- Documented command behavior
- Job enqueue format defined
- Status response includes: pct, done/doing/total, last_build.json age
