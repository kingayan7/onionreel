import http from 'node:http';
import { initStore, listProjects, getProject, upsertProject, appendActivity, listActivity } from './store.mjs';
import { listArtifacts } from '../artifact_store/store.mjs';

import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT || 5057;
const ROOT = path.resolve(process.cwd());
const ROADMAP = path.resolve(ROOT, '..', 'CONTINUOUS_BUILD_ROADMAP.json');
const AUTOEDIT = path.resolve(ROOT, '..', 'autoedit');

function json(res, code, obj){
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj, null, 2));
}

initStore();

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  if (req.url === '/api/projects' && req.method === 'GET') {
    return json(res, 200, { projects: listProjects() });
  }

  if (req.url?.startsWith('/api/projects/') && req.method === 'GET') {
    const id = req.url.split('/').pop();
    const project = getProject(id);
    return json(res, project ? 200 : 404, project ? project : { error: 'not_found' });
  }

  if (req.url === '/api/projects' && req.method === 'POST') {
    let body='';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const project = JSON.parse(body || '{}');
        if (!project.id) project.id = 'proj_' + Date.now();
        upsertProject(project);
        appendActivity({ kind: 'project_upsert', message: `Project upsert: ${project.id}`, projectId: project.id });
        return json(res, 200, { ok: true, project });
      } catch (e) {
        return json(res, 400, { error: String(e) });
      }
    });
    return;
  }

  if (req.url === '/api/activity' && req.method === 'GET') {
    return json(res, 200, { events: listActivity(200) });
  }

  if (req.url === '/api/roadmap') {
    try {
      const raw = fs.readFileSync(ROADMAP, 'utf8');
      return json(res, 200, JSON.parse(raw));
    } catch (e) {
      return json(res, 500, { error: String(e) });
    }
  }

  // /api/artifacts?projectId=...&type=...
  if (req.url?.startsWith('/api/artifacts') && req.method === 'GET') {
    const u = new URL(req.url, 'http://127.0.0.1');
    const projectId = u.searchParams.get('projectId') || 'default';
    const type = u.searchParams.get('type') || undefined;
    const artifacts = listArtifacts({ projectId, limit: 200, type }).slice().reverse();
    return json(res, 200, { projectId, type, artifacts });
  }

  // /api/artifacts_latest?projectId=...&type=...
  if (req.url?.startsWith('/api/artifacts_latest') && req.method === 'GET') {
    const u = new URL(req.url, 'http://127.0.0.1');
    const projectId = u.searchParams.get('projectId') || 'default';
    const type = u.searchParams.get('type') || undefined;
    const latest = listArtifacts({ projectId, limit: 500, type }).at(-1) || null;
    return json(res, 200, { projectId, type, latest });
  }

  // /api/autoedit?projectId=...
  // Returns latest render/export files so the UI can show download links.
  if (req.url?.startsWith('/api/autoedit') && req.method === 'GET') {
    const u = new URL(req.url, 'http://127.0.0.1');
    const projectId = u.searchParams.get('projectId') || 'default';
    const rendersDir = path.join(AUTOEDIT, 'renders', projectId);
    const exportsDir = path.join(AUTOEDIT, 'exports', projectId);

    function listFiles(dir){
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => !f.startsWith('.'))
        .map(f => {
          const p = path.join(dir, f);
          const st = fs.statSync(p);
          return { name: f, bytes: st.size, mtime: st.mtimeMs };
        })
        .sort((a,b)=>b.mtime-a.mtime);
    }

    return json(res, 200, {
      projectId,
      renders: listFiles(rendersDir),
      exports: listFiles(exportsDir)
    });
  }

  // /dl/autoedit/<projectId>/<kind>/<filename>
  if (req.url?.startsWith('/dl/autoedit/')) {
    const parts = req.url.split('/').filter(Boolean); // dl autoedit <pid> <kind> <file>
    const projectId = parts[2];
    const kind = parts[3];
    const file = parts.slice(4).join('/');
    if (!projectId || !kind || !file) return json(res, 400, { error: 'bad_request' });
    const base = kind === 'renders' ? path.join(AUTOEDIT, 'renders') : path.join(AUTOEDIT, 'exports');
    const abs = path.join(base, projectId, file);
    if (!abs.startsWith(base)) return json(res, 400, { error: 'bad_path' });
    if (!fs.existsSync(abs)) return json(res, 404, { error: 'not_found' });
    const ext = path.extname(abs).toLowerCase();
    const ct = ext === '.mp4' ? 'video/mp4' : (ext === '.json' ? 'application/json' : 'application/octet-stream');
    res.writeHead(200, { 'content-type': ct });
    fs.createReadStream(abs).pipe(res);
    return;
  }

  return json(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => {
  console.log('OnionReel dashboard server listening on http://127.0.0.1:' + PORT);
});
