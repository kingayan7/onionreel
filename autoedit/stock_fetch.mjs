import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');
const CACHE_DIR = path.join(AUTO_DIR, 'cache');

function sha1(s){return crypto.createHash('sha1').update(s).digest('hex');}

async function download(url, outPath){
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`download failed ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}

function loadJson(p){return JSON.parse(fs.readFileSync(p,'utf8'));}
function saveJson(p,obj){fs.writeFileSync(p, JSON.stringify(obj,null,2)+'\n');}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node stock_fetch.mjs <projectId>');
  process.exit(2);
}

fs.mkdirSync(CACHE_DIR, { recursive: true });
const projDir = path.join(AUTO_DIR, 'projects', projectId);
const manifestPath = path.join(projDir, 'stock_manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('missing manifest:', manifestPath);
  process.exit(2);
}

const manifest = loadJson(manifestPath);
manifest.assets = manifest.assets || [];

let fetched = 0;
for (const a of manifest.assets) {
  if (a.localPath && fs.existsSync(path.join(AUTO_DIR, a.localPath))) continue;
  if (!a.url) continue;
  const ext = a.ext || (a.type === 'video' ? 'mp4' : 'jpg');
  const file = `${a.id || sha1(a.url).slice(0,12)}.${ext}`;
  const rel = path.join('cache', file);
  const abs = path.join(AUTO_DIR, rel);
  try {
    await download(a.url, abs);
    a.localPath = rel;
    fetched++;
  } catch (e) {
    a.error = String(e.message || e);
  }
}

saveJson(manifestPath, manifest);
console.log(JSON.stringify({ ok:true, fetched, manifestPath }, null, 2));
