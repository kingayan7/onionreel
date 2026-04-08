import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args, opts={}){
  const r = spawnSync(cmd, args, { stdio: 'pipe', ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  }
  return (r.stdout||'').toString();
}

const projectId = process.argv[2] || 'maxcontrax-reel-v1';
const outDir = path.join(AUTO_DIR, 'renders', projectId);
fs.mkdirSync(outDir, { recursive: true });

const master = path.join(outDir, 'remotion_master_30s.mp4');
const v15 = path.join(outDir, 'remotion_variant_15s.mp4');
const v6 = path.join(outDir, 'remotion_variant_6s.mp4');

// Render 30s via Remotion.
run('bash', ['-lc', `cd "${REM_DIR}" && npx remotion render src/index.ts Reel30 "${master}" --log=warn`]);

// Variants via ffmpeg trim (fast + deterministic)
run('ffmpeg', ['-y','-i', master, '-t','15','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart', v15]);
run('ffmpeg', ['-y','-i', master, '-t','6','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart', v6]);

console.log(JSON.stringify({ ok:true, projectId, master, v15, v6 }, null, 2));
