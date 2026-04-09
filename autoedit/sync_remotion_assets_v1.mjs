import fs from 'node:fs';
import path from 'node:path';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');
const REM_PUBLIC = path.join(OR_DIR, 'remotion', 'public');

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/sync_remotion_assets_v1.mjs <projectId>');
  process.exit(2);
}

const projDir = path.join(AUTO_DIR, 'projects', projectId);
const manifestPath = path.join(projDir, 'stock_manifest.json');
const captionsPath = path.join(projDir, 'captions.srt');
if (!fs.existsSync(manifestPath)) throw new Error('missing stock_manifest.json');
if (!fs.existsSync(captionsPath)) throw new Error('missing captions.srt');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const assets = manifest.assets || [];

const outDir = path.join(REM_PUBLIC, 'clips', projectId);
fs.mkdirSync(outDir, { recursive: true });

function copyAsset(id){
  const a = assets.find(x => x.id === id);
  if (!a?.localPath) throw new Error(`asset ${id} missing localPath (run sora_generate first)`);
  const src = path.join(AUTO_DIR, a.localPath);
  if (!fs.existsSync(src)) throw new Error(`missing file: ${src}`);
  const dst = path.join(outDir, `${id}.mp4`);
  fs.copyFileSync(src, dst);
  return { id, src, dst };
}

const copied = [];
for (const id of ['overwhelm_scroll','ai_matching','email_alert','shortlist_focus']) {
  copied.push(copyAsset(id));
}

fs.copyFileSync(captionsPath, path.join(outDir, 'captions.srt'));

console.log(JSON.stringify({ ok:true, projectId, outDir, copiedCount: copied.length }, null, 2));
