import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/export_final_pack_v1.mjs <projectId>');
  process.exit(2);
}

const rendersDir = path.join(AUTO_DIR, 'renders', projectId);
const exportsDir = path.join(AUTO_DIR, 'exports', projectId);
if (!fs.existsSync(rendersDir) || !fs.existsSync(exportsDir)) {
  console.error('missing renders/exports for project:', projectId);
  process.exit(2);
}

const outZip = path.join(exportsDir, 'final_pack.zip');

const candidates = [
  path.join(rendersDir, 'remotion_master_30s.mp4'),
  path.join(rendersDir, 'remotion_master_30s_mastered.mp4'),
  path.join(rendersDir, 'remotion_master_30s_film.mp4'),
  path.join(rendersDir, 'remotion_variant_15s.mp4'),
  path.join(rendersDir, 'remotion_variant_6s.mp4'),
  path.join(rendersDir, 'master_30s.mp4'),
  path.join(rendersDir, 'variant_15s.mp4'),
  path.join(rendersDir, 'variant_6s.mp4'),
  path.join(exportsDir, 'export_pack.json'),
  path.join(exportsDir, 'qc_report.json'),
  path.join(exportsDir, 'poster_1080x1920.png'),
  path.join(exportsDir, 'thumb_1280x720.jpg'),
  path.join(AUTO_DIR, 'projects', projectId, 'script.md'),
  path.join(AUTO_DIR, 'projects', projectId, 'captions.srt'),
  path.join(AUTO_DIR, 'projects', projectId, 'blueprint.json'),
];

const files = candidates.filter((p) => fs.existsSync(p));
if (!files.length) {
  console.error('no files to zip');
  process.exit(2);
}

const r = spawnSync('zip', ['-j', '-q', '-o', outZip, ...files], { stdio: 'pipe' });
if (r.status !== 0) {
  console.error((r.stderr || r.stdout || '').toString());
  process.exit(r.status || 1);
}

console.log(JSON.stringify({ ok: true, projectId, outZip, count: files.length }, null, 2));
