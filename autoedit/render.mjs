import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function loadJson(p){return JSON.parse(fs.readFileSync(p,'utf8'));}

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${cmd} failed`);
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node render.mjs <projectId>');
  process.exit(2);
}

const projDir = path.join(AUTO_DIR, 'projects', projectId);
const blueprintPath = path.join(projDir, 'blueprint.json');
const brandPath = path.join(projDir, 'brand.json');
const manifestPath = path.join(projDir, 'stock_manifest.json');
const timelinePath = path.join(projDir, 'timeline.json');

for (const p of [blueprintPath, brandPath, manifestPath]) {
  if (!fs.existsSync(p)) {
    console.error('missing:', p);
    process.exit(2);
  }
}

const blueprint = loadJson(blueprintPath);
const brand = loadJson(brandPath);
loadJson(manifestPath); // reserved

const outDir = path.join(AUTO_DIR, 'renders', projectId);
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'master_30s.mp4');

const W = blueprint.width || 1080;
const H = blueprint.height || 1920;
const D = blueprint.durationSec || 30;
const FPS = blueprint.fps || 30;

const bg = brand.bg || '#0B0B0B';
const fg = brand.fg || '#FFFFFF';
const accent = brand.accent || '#E17B3B';

// 1) Build a base video: either concat real clips (if timeline exists) or fallback to placeholder.
const basePath = path.join(outDir, 'base.mp4');
let usedReal = false;

if (fs.existsSync(timelinePath)) {
  const tl = loadJson(timelinePath);
  const clips = (tl.clips || []).filter(c => c.path && fs.existsSync(c.path));
  if (clips.length) {
    usedReal = true;
    const listPath = path.join(outDir, 'concat_list.txt');
    const list = clips.map(c => `file '${c.path.replace(/'/g, "'\\''")}'`).join('\n') + '\n';
    fs.writeFileSync(listPath, list);

    // concat then scale/crop to 9:16.
    run('ffmpeg', [
      '-y',
      '-f','concat','-safe','0','-i', listPath,
      '-r', String(FPS),
      '-vf', `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`, 
      '-t', String(D),
      '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',
      basePath
    ]);
  }
}

if (!usedReal) {
  run('ffmpeg', [
    '-y',
    '-f','lavfi','-i',`color=c=${bg}:s=${W}x${H}:d=${D}:r=${FPS}`,
    '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',
    basePath
  ]);
}

// 2) End card overlay (last 5 seconds). No drawtext available, so render PNG via Pillow.
const endcardPng = path.join(outDir, 'endcard.png');
run('python3', [
  path.join(AUTO_DIR, 'endcard_to_png.py'),
  endcardPng,
  '--w', String(W),
  '--h', String(H),
  '--bg', bg,
  '--fg', fg,
  '--accent', accent
]);

run('ffmpeg', [
  '-y',
  '-i', basePath,
  '-loop','1','-i', endcardPng,
  '-filter_complex', `[0:v][1:v]overlay=0:0:enable='between(t,${Math.max(0, D-5)},${D})':format=auto`,
  '-t', String(D),
  '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',
  outPath
]);

console.log(JSON.stringify({ ok:true, outPath, usedRealClips: usedReal }, null, 2));
