import http from 'node:http';
import { initStore, listProjects, getProject, upsertProject, appendActivity, listActivity } from './store.mjs';

import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT || 5057;
const ROOT = path.resolve(process.cwd());
const ROADMAP = path.resolve(ROOT, '..', 'CONTINUOUS_BUILD_ROADMAP.json');

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

  return json(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => {
  console.log('OnionReel dashboard server listening on http://127.0.0.1:' + PORT);
});
