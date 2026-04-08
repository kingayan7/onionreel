import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function sh(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  return (r.stdout||'').toString();
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/posters_v1.mjs <projectId>');
  process.exit(2);
}

const rendersDir = path.join(AUTO_DIR, 'renders', projectId);
const exportsDir = path.join(AUTO_DIR, 'exports', projectId);
fs.mkdirSync(exportsDir, { recursive: true });

const film = path.join(rendersDir, 'remotion_master_30s_film.mp4');
const mastered = path.join(rendersDir, 'remotion_master_30s_mastered.mp4');
// Prefer mastered for poster extraction (avoid any container quirks in post-processed outputs).
const base = fs.existsSync(mastered) ? mastered : (fs.existsSync(film) ? film : path.join(rendersDir, 'remotion_master_30s.mp4'));
if (!fs.existsSync(base)) throw new Error(`missing base render: ${base}`);

// Choose a frame a few seconds in (avoid fade-in and first-beat lower thirds).
const ss = process.env.POSTER_SS || '5.0';

const posterPng = path.join(exportsDir, 'poster_1080x1920.png');
const thumbJpg = path.join(exportsDir, 'thumb_1280x720.jpg');

// Poster (vertical 9:16)
sh('ffmpeg', [
  '-hide_banner','-loglevel','error','-y',
  '-ss', ss,
  '-i', base,
  '-frames:v','1',
  '-vf', [
    // Ensure exact size (Remotion already is 1080x1920 but keep deterministic)
    'scale=1080:1920:force_original_aspect_ratio=decrease',
    'pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
    // Subtle cinematic polish
    'eq=contrast=1.06:saturation=1.05:brightness=-0.01',
    'vignette=PI/5:eval=frame:aspect=9/16',
    // Mild sharpen
    'unsharp=5:5:0.3:5:5:0.0'
  ].join(','),
  posterPng
]);

// Thumbnail (landscape 16:9) — center-crop from vertical source
sh('ffmpeg', [
  '-hide_banner','-loglevel','error','-y',
  '-ss', ss,
  '-i', base,
  '-frames:v','1',
  '-vf', [
    // Crop a 16:9 window from the vertical frame then scale.
    'crop=in_w:in_w*9/16:0:(in_h-(in_w*9/16))/2',
    'scale=1280:720',
    'eq=contrast=1.06:saturation=1.05:brightness=-0.01',
    'unsharp=5:5:0.25:5:5:0.0'
  ].join(','),
  '-q:v','3',
  thumbJpg
]);

console.log(JSON.stringify({
  ok: true,
  projectId,
  base: path.relative(AUTO_DIR, base),
  posterPng,
  thumbJpg,
}, null, 2));
