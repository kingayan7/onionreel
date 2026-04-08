# OnionReel One-Command Start Runbook v1

## Start Dashboard
```bash
cd onionreel/dashboard
node server.mjs
```

## Start Continuous Loop
- launchd job: com.onionreel.runner (KeepAlive)

## Smoke Test
1) Open dashboard: http://127.0.0.1:5057
2) Create a project in the UI
3) Verify `GET /api/projects` returns it
4) Verify activity log shows a project_upsert event

## Recovery
- If the loop stalls, watchdog will kickstart runner and post a chat alert

## Acceptance Criteria
- A new user can run dashboard + see roadmap + create a project
- Loop produces a ship at least every 5 minutes
