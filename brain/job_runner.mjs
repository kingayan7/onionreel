import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const JOBS = path.join(ROOT, 'jobs.json');

function load(){ return JSON.parse(fs.readFileSync(JOBS, 'utf8')); }
function save(obj){ fs.writeFileSync(JOBS, JSON.stringify(obj, null, 2) + '\n'); }

function now(){ return new Date().toISOString(); }

function isRetryable(err){
  const msg = (err && err.message) ? err.message : String(err);
  return !/fatal|syntax|invalid/i.test(msg);
}

async function runJob(job){
  job.status = 'running';
  job.startedAt = now();
  job.attempts = (job.attempts||0) + 1;
  saveState(job);

  try {
    // Placeholder: real implementations will dispatch by job.type.
    // For now, simulate a quick success and write a log artifact.
    job.outputs = job.outputs || {};
    job.outputs.message = 'ok';
    job.status = 'done';
    job.finishedAt = now();
  } catch (e) {
    job.lastError = String(e && e.stack || e);
    if (isRetryable(e) && (job.attempts||0) < (job.maxAttempts||3)) {
      job.status = 'queued';
      job.runAt = new Date(Date.now() + 60_000).toISOString();
    } else {
      job.status = 'failed';
      job.finishedAt = now();
    }
  }

  saveState(job);
}

function saveState(job){
  const data = load();
  const jobs = data.jobs || [];
  const i = jobs.findIndex(j => j.id === job.id);
  if (i >= 0) jobs[i] = job; else jobs.push(job);
  save({ jobs });
}

function due(job){
  if (job.status !== 'queued') return false;
  if (!job.runAt) return true;
  return new Date(job.runAt).getTime() <= Date.now();
}

async function main(){
  const data = load();
  const jobs = data.jobs || [];
  const next = jobs.find(due);
  if (!next) {
    console.log('no queued jobs');
    return;
  }
  await runJob(next);
  console.log('ran', next.id, next.status);
}

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
