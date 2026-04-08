import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DATA = path.join(ROOT, 'data');

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function jwrite(p, obj){ ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); }
function jread(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }

export function initStore(){
  ensureDir(DATA);
}

export function putArtifact({ projectId='default', type, name, content, metadata={} }){
  if(!type) throw new Error('type required');
  initStore();
  const id = (globalThis.crypto?.randomUUID?.() || ('a_'+Date.now()));
  const dir = path.join(DATA, projectId, id);
  ensureDir(dir);
  const meta = { id, projectId, type, name: name||id, createdAt: new Date().toISOString(), metadata };
  jwrite(path.join(dir, 'meta.json'), meta);
  fs.writeFileSync(path.join(dir, 'content.txt'), String(content ?? ''));
  return meta;
}

export function listArtifacts({ projectId='default', limit=50, type } = {}){
  initStore();
  const pdir = path.join(DATA, projectId);
  if(!fs.existsSync(pdir)) return [];
  const ids = fs.readdirSync(pdir).slice(-limit);
  const out=[];
  for(const id of ids){
    const mp = path.join(pdir, id, 'meta.json');
    if(fs.existsSync(mp)) out.push(jread(mp));
  }
  let sorted = out.sort((a,b)=> (a.createdAt||'').localeCompare(b.createdAt||''));
  if (type) sorted = sorted.filter(a => (a.type || a.kind) === type);
  return sorted;
}

export function latestArtifact({ projectId='default', type } = {}){
  const all = listArtifacts({ projectId, limit: 500, type });
  return all.length ? all[all.length - 1] : null;
}
