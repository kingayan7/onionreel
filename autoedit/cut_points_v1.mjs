import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) {
    // silencedetect returns 0 even if no silence; but keep strict.
    throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  }
  return { stdout: (r.stdout||'').toString(), stderr: (r.stderr||'').toString() };
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/cut_points_v1.mjs <projectId>');
  process.exit(2);
}

const rendersDir = path.join(AUTO_DIR, 'renders', projectId);
const mastered = path.join(rendersDir, 'remotion_master_30s_mastered.mp4');
const film = path.join(rendersDir, 'remotion_master_30s_film.mp4');
// Prefer mastered for analysis (audio should be pristine). Film output may include extra atoms depending on ffmpeg build.
const base = fs.existsSync(mastered) ? mastered : (fs.existsSync(film) ? film : path.join(rendersDir, 'remotion_master_30s.mp4'));
if (!fs.existsSync(base)) throw new Error(`missing base render: ${base}`);

// Detect silence segments as a proxy for VO pauses.
// This is fast and works without extra deps.
const { stderr } = run('ffmpeg', [
  '-hide_banner','-loglevel','info','-y',
  '-i', base,
  // Audio-only analysis so video decode quirks can't break marker generation.
  '-vn',
  '-af', 'silencedetect=n=-35dB:d=0.25',
  '-f', 'null',
  '-'
]);

const starts = [];
const re = /silence_start: ([0-9.]+)/g;
let m;
while ((m = re.exec(stderr))) {
  starts.push(Number(m[1]));
}

// Create cut points: include 0, plus silence starts, plus some defaults.
let cutPoints = [0, ...starts]
  .filter((x) => Number.isFinite(x))
  .map((x) => Math.max(0, Math.min(30, x)))
  .sort((a,b) => a-b);

// Dedupe close points
cutPoints = cutPoints.filter((t, i) => i === 0 || Math.abs(t - cutPoints[i-1]) > 0.15);

// Guarantee useful markers even if no silence found
const defaults = [2,6,10,15,20,25,30];
for (const d of defaults) {
  if (!cutPoints.some((x) => Math.abs(x - d) < 0.2)) cutPoints.push(d);
}
cutPoints.sort((a,b)=>a-b);

const outPath = path.join(AUTO_DIR, 'projects', projectId, 'markers.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ projectId, base: path.relative(AUTO_DIR, base), cutPointsSec: cutPoints }, null, 2) + '\n');

console.log(JSON.stringify({ ok:true, projectId, outPath, cutPointsCount: cutPoints.length }, null, 2));
