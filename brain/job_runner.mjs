import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const JOBS = path.join(ROOT, 'jobs.json');

function load(){ return JSON.parse(fs.readFileSync(JOBS, 'utf8')); }
function save(obj){ fs.writeFileSync(JOBS, JSON.stringify(obj, null, 2) + '\n'); }

function now(){ return new Date().toISOString(); }

function isRetryable(err){
  const msg = (err && err.message) ? err.message : String(err);
  // Moderation blocks and unknown job types are not retryable.
  if (/moderation_blocked|unknown job type/i.test(msg)) return false;
  return !/fatal|syntax|invalid/i.test(msg);
}

async function runJob(job){
  job.status = 'running';
  job.startedAt = now();
  job.attempts = (job.attempts||0) + 1;
  saveState(job);

  try {
    job.outputs = job.outputs || {};

    // Dispatch by job.type (minimal but real).
    const type = job.type;
    const projectId = job.projectId || 'maxcontrax-reel-v1';

    const node = '/usr/local/bin/node';
    const OR_DIR = path.resolve(ROOT, '..');

    function runNode(script, args = [], extraEnv = {}){
      const { spawnSync } = await import('node:child_process');
      const r = spawnSync(node, [script, ...args], {
        stdio: 'pipe',
        env: { ...process.env, ...extraEnv }
      });
      if (r.status !== 0) {
        throw new Error((r.stderr||r.stdout||'').toString() || `job failed: ${type}`);
      }
      return (r.stdout || '').toString().trim();
    }

    if (type === 'sora_generate') {
      const script = path.join(OR_DIR, 'autoedit', 'sora_generate.mjs');
      await runNode(script, [projectId], { OPENAI_API_KEY: process.env.OPENAI_API_KEY });
      job.outputs.clipDir = `autoedit/cache/${projectId}`;

    } else if (type === 'stock_fetch') {
      const script = path.join(OR_DIR, 'autoedit', 'stock_fetch.mjs');
      await runNode(script, [projectId]);
      job.outputs.manifest = `autoedit/projects/${projectId}/stock_manifest.json`;

    } else if (type === 'render') {
      const script = path.join(OR_DIR, 'autoedit', 'render.mjs');
      await runNode(script, [projectId]);
      job.outputs.master = `autoedit/renders/${projectId}/master_30s.mp4`;

    } else if (type === 'export_pack' || type === 'qc_render') {
      const script = path.join(OR_DIR, 'autoedit', 'qc_export.mjs');
      await runNode(script, [projectId]);
      job.outputs.exportDir = `autoedit/exports/${projectId}`;

    } else {
      throw new Error(`unknown job type: ${type}`);
    }

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
