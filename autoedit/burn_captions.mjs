import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) throw new Error((r.stderr||r.stdout||'').toString());
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node burn_captions.mjs <projectId>');
  process.exit(2);
}

const renders = path.join(AUTO, 'renders', projectId);
const src = path.join(renders, 'remotion_master_30s.mp4');
const out = path.join(renders, 'remotion_master_30s_captions.mp4');
const ass = path.join(AUTO, 'projects', projectId, 'captions.ass');

if (!fs.existsSync(src)) throw new Error('missing source video: ' + src);
if (!fs.existsSync(ass)) throw new Error('missing captions.ass: ' + ass);

// ffmpeg subtitles filter is available on this host.
const assEsc = ass
  .replace(/\\/g, '\\\\')
  .replace(/:/g, '\\:')
  .replace(/,/g, '\\,')
  .replace(/\[/g, '\\[')
  .replace(/\]/g, '\\]');

run('ffmpeg', ['-y','-i', src, '-vf', `subtitles='${assEsc}'`, '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart', out]);

console.log(JSON.stringify({ ok:true, out }, null, 2));
