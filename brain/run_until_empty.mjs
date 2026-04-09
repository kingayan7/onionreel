import { openDb } from './queue.mjs';

// Simple background worker: repeatedly run job_runner.mjs by importing and calling its main loop.
// Keeps implementation minimal: spawnless, just reuse queue functions.

import { claimNextJob } from './queue.mjs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OR_DIR = path.resolve(ROOT, '..');
const runner = path.join(OR_DIR, 'brain', 'job_runner.mjs');

const maxJobs = Math.min(500, Math.max(1, Number(process.env.MAX_JOBS || 50)));

const db = openDb();

let ran = 0;
for (let i = 0; i < maxJobs; i++) {
  const next = claimNextJob(db);
  if (!next) {
    console.log('no queued jobs');
    process.exit(0);
  }
  // Run one job in a separate process so logs/locks behave identically.
  const r = spawnSync(process.execPath, [runner], { cwd: OR_DIR, stdio: 'inherit', env: process.env });
  ran++;
  if (r.status !== 0) {
    console.error('job_runner exited non-zero', r.status);
    // keep going; the failed job will be marked failed/requeued already.
  }
}

console.log('maxJobs reached', ran);
