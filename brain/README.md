# OnionReel Brain (MVP)

This is a minimal job runner implementation (queue + retries + logs) intended to be expanded.

## Run one tick

```bash
cd brain
node job_runner.mjs
```

## jobs.json format

- jobs[] items include: id, type, status(queued/running/done/failed), attempts, maxAttempts, runAt

Next: wire this to the dashboard + artifact store and add real job type dispatch.
