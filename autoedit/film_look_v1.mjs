import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) {
    throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  }
  return (r.stdout||'').toString();
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/film_look_v1.mjs <projectId>');
  process.exit(2);
}

const rendersDir = path.join(AUTO_DIR, 'renders', projectId);
const inMp4 = path.join(rendersDir, 'remotion_master_30s_mastered.mp4');
const fallback = path.join(rendersDir, 'remotion_master_30s.mp4');
const src = fs.existsSync(inMp4) ? inMp4 : fallback;
if (!fs.existsSync(src)) throw new Error(`missing input: ${src}`);

const out = path.join(rendersDir, 'remotion_master_30s_film.mp4');

// Film look v1 (subtle, cinematic premium):
// - mild contrast curve
// - warm highlights / slightly cooler shadows
// - subtle vignette
// - subtle grain (noise)
// Keep it tasteful; avoid destroying skin tones.
const vf = [
  // Curves: mild contrast + gentle toe
  "curves=preset=medium_contrast",
  // Color balance (subtle)
  "colorbalance=rs=-0.01:gs=-0.01:bs=0.01:rm=0.00:gm=0.00:bm=0.00:rh=0.02:gh=0.01:bh=-0.01",
  // Vignette
  "vignette=PI/5:eval=frame:aspect=16/9",
  // Grain: add noise
  "noise=alls=8:allf=t+u",
].join(',');

run('ffmpeg', [
  '-hide_banner','-loglevel','error','-y',
  '-i', src,
  '-vf', vf,
  '-c:v','libx264','-pix_fmt','yuv420p',
  '-preset','medium',
  '-crf','18',
  '-c:a','copy',
  '-movflags','+faststart',
  out
]);

console.log(JSON.stringify({ ok:true, projectId, src, out, vf }, null, 2));
