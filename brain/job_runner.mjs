import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { openDb, claimNextJob, markDone, markFailed, requeue, acquireLock, releaseLock } from './queue.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);

function now(){ return new Date().toISOString(); }

function isRetryable(err){
  const msg = (err && err.message) ? err.message : String(err);
  // Moderation blocks and unknown job types are not retryable.
  if (/moderation_blocked|unknown job type/i.test(msg)) return false;
  return !/fatal|syntax|invalid/i.test(msg);
}

async function runJob(job, db){
  const lockKey = `job:${job.type}:${job.projectId || 'default'}`;
  const got = acquireLock(db, lockKey, 10 * 60 * 1000);
  if (!got) {
    // Idempotency: another job of the same type/project is already active recently.
    markDone(db, job.id, { skipped: true, reason: 'lock_active', lockKey });
    job.status = 'done';
    return;
  }

  const attempts = job.attempts || 1;
  const maxAttempts = job.maxAttempts || 3;

  try {
    const payload = job.payload || {};
    const outputs = {};

    // Dispatch by job.type (minimal but real).
    const type = job.type;
    const projectId = job.projectId || 'maxcontrax-reel-v1';

    const node = '/usr/local/bin/node';
    const OR_DIR = path.resolve(ROOT, '..');

    function runNode(script, args = [], extraEnv = {}){
      const r = spawnSync(node, [script, ...args], {
        stdio: 'pipe',
        env: { ...process.env, ...extraEnv }
      });
      const stdout = (r.stdout || '').toString();
      const stderr = (r.stderr || '').toString();
      // Always capture logs for UI/debugging.
      job.outputs = job.outputs || {};
      job.outputs.logs = job.outputs.logs || {};
      job.outputs.logs[type] = {
        ts: Date.now(),
        stdout: stdout.slice(-20000),
        stderr: stderr.slice(-20000),
      };
      if (r.status !== 0) {
        throw new Error((stderr || stdout || '').toString() || `job failed: ${type}`);
      }
      return stdout.trim();
    }

    if (type === 'maxcontrax_full_pack') {
      // One job that runs the FULL MaxContrax production pipeline end-to-end.
      // Intended for one-click runs from the dashboard.
      const scripts = {
        sora: path.join(OR_DIR, 'autoedit', 'sora_generate.mjs'),
        sync: path.join(OR_DIR, 'autoedit', 'sync_remotion_assets_v1.mjs'),
        remotion: path.join(OR_DIR, 'remotion', 'render_variants.mjs'),
        vo: path.join(OR_DIR, 'autoedit', 'gen_vo_music_v1.mjs'),
        master: path.join(OR_DIR, 'autoedit', 'master_audio_v2.mjs'),
        film: path.join(OR_DIR, 'autoedit', 'film_look_v1.mjs'),
        markers: path.join(OR_DIR, 'autoedit', 'cut_points_v1.mjs'),
        posters: path.join(OR_DIR, 'autoedit', 'posters_v1.mjs'),
        qc: path.join(OR_DIR, 'autoedit', 'qc_export.mjs'),
        final: path.join(OR_DIR, 'autoedit', 'export_final_pack_v1.mjs'),
      };

      // 1) Clips (Sora)
      await runNode(scripts.sora, [projectId], { OPENAI_API_KEY: process.env.OPENAI_API_KEY });
      // 2) Sync clips + captions into Remotion public folder
      await runNode(scripts.sync, [projectId]);
      // 3) Render master + variants
      await runNode(scripts.remotion, [projectId]);
      // 4) VO + music bed
      await runNode(scripts.vo, [projectId]);
      // 5) Mastering
      await runNode(scripts.master, [projectId]);
      // 6) Film look
      await runNode(scripts.film, [projectId]);
      // 7) Markers (cut points)
      await runNode(scripts.markers, [projectId]);
      // 8) Posters
      await runNode(scripts.posters, [projectId]);
      // 9) QC + export pack
      await runNode(scripts.qc, [projectId]);
      // 10) Final zip
      await runNode(scripts.final, [projectId]);

      job.outputs.master = `autoedit/renders/${projectId}/remotion_master_30s.mp4`;
      job.outputs.mastered = `autoedit/renders/${projectId}/remotion_master_30s_mastered.mp4`;
      job.outputs.film = `autoedit/renders/${projectId}/remotion_master_30s_film.mp4`;
      job.outputs.exportDir = `autoedit/exports/${projectId}`;

    } else if (type === 'sora_generate') {
      const script = path.join(OR_DIR, 'autoedit', 'sora_generate.mjs');
      await runNode(script, [projectId], { OPENAI_API_KEY: process.env.OPENAI_API_KEY });
      job.outputs.clipDir = `autoedit/cache/${projectId}`;

    } else if (type === 'remotion_render') {
      const script = path.join(OR_DIR, 'remotion', 'render_variants.mjs');
      await runNode(script, [projectId]);
      job.outputs.master = `autoedit/renders/${projectId}/remotion_master_30s.mp4`;
      job.outputs.v15 = `autoedit/renders/${projectId}/remotion_variant_15s.mp4`;
      job.outputs.v6 = `autoedit/renders/${projectId}/remotion_variant_6s.mp4`;

    } else if (type === 'stock_fetch') {
      const script = path.join(OR_DIR, 'autoedit', 'stock_fetch.mjs');
      await runNode(script, [projectId]);
      job.outputs.manifest = `autoedit/projects/${projectId}/stock_manifest.json`;

    } else if (type === 'render') {
      const script = path.join(OR_DIR, 'autoedit', 'render.mjs');
      await runNode(script, [projectId]);
      job.outputs.master = `autoedit/renders/${projectId}/master_30s.mp4`;

    } else if (type === 'export_pack' || type === 'qc_render' || type === 'qc_export') {
      // QC gate: block export_pack unless project QC is marked pass.
      if (type === 'export_pack') {
        try {
          const qcFile = path.join(OR_DIR, 'dashboard', 'data', 'qc.jsonl');
          if (fs.existsSync(qcFile)) {
            const lines = fs.readFileSync(qcFile, 'utf8').split('\n').filter(Boolean);
            const rows = lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
            const latest = rows.reverse().find((r) => r.projectId === projectId) || null;
            const pass = latest?.pass === true;
            const force = payload?.force === true;
            if (!pass && !force) {
              throw new Error('QC_GATE_BLOCKED: set QC pass in dashboard before export_pack (or use force).');
            }
          }
        } catch (e) {
          throw e;
        }
      }

      const script = path.join(OR_DIR, 'autoedit', 'qc_export.mjs');
      await runNode(script, [projectId]);
      job.outputs.exportDir = `autoedit/exports/${projectId}`;

    } else {
      throw new Error(`unknown job type: ${type}`);
    }

    markDone(db, job.id, job.outputs || outputs);
    job.status = 'done';

  } catch (e) {
    const msg = String(e && e.stack || e);
    if (isRetryable(e) && attempts < maxAttempts) {
      requeue(db, job.id, 60_000, msg);
      job.status = 'queued';
    } else {
      markFailed(db, job.id, msg);
      try {
        const { writeDeadLetter } = await import('./dead_letter.mjs');
        writeDeadLetter(job, msg);
      } catch {}
      job.status = 'failed';
    }
  } finally {
    releaseLock(db, lockKey);
  }
}

async function main(){
  const db = openDb();
  const next = claimNextJob(db);
  if (!next) {
    console.log('no queued jobs');
    return;
  }
  await runJob(next, db);
  console.log('ran', next.id, next.status);
}

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
