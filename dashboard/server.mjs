import http from 'node:http';
import { initStore, listProjects, getProject, upsertProject, appendActivity, listActivity } from './store.mjs';
import { listArtifacts } from '../artifact_store/store.mjs';
import { openDb as openQueueDb, enqueueJob } from '../brain/queue.mjs';
import { spawn } from 'node:child_process';

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

function readBody(req){
  return new Promise((resolve) => {
    let body='';
    req.on('data', c => body += c);
    req.on('end', () => resolve(body));
  });
}

function safeJson(s){
  try { return JSON.parse(s || '{}'); } catch { return null; }
}

function openJobsDb(){
  // brain/queue.mjs manages schema + WAL.
  return openQueueDb();
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
    readBody(req).then((body) => {
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

  // /api/jobs?status=queued|running|done|failed|...
  if (req.url?.startsWith('/api/jobs') && req.method === 'GET') {
    try {
      const u = new URL(req.url, 'http://127.0.0.1');
      const status = u.searchParams.get('status');
      const projectId = u.searchParams.get('projectId');
      const limit = Math.min(500, Math.max(1, Number(u.searchParams.get('limit') || 200)));
      const db = openJobsDb();
      let rows = [];
      if (status && projectId) {
        rows = db.prepare('select * from jobs where status=? and projectId=? order by createdAt desc limit ?').all(status, projectId, limit);
      } else if (status) {
        rows = db.prepare('select * from jobs where status=? order by createdAt desc limit ?').all(status, limit);
      } else if (projectId) {
        rows = db.prepare('select * from jobs where projectId=? order by createdAt desc limit ?').all(projectId, limit);
      } else {
        rows = db.prepare('select * from jobs order by createdAt desc limit ?').all(limit);
      }
      return json(res, 200, {
        jobs: rows.map(r => ({
          ...r,
          payload: safeJson(r.payload),
          outputs: safeJson(r.outputs),
        }))
      });
    } catch (e) {
      return json(res, 500, { error: String(e) });
    }
  }

  // Requests persistence (MVP): dashboard/data/requests.jsonl
  const REQUESTS = path.join(ROOT, 'data', 'requests.jsonl');

  if (req.url === '/api/requests' && req.method === 'GET') {
    try {
      if (!fs.existsSync(REQUESTS)) fs.writeFileSync(REQUESTS, '');
      const lines = fs.readFileSync(REQUESTS, 'utf8').split('\n').filter(Boolean);
      const reqs = lines.map(safeJson).filter(Boolean).slice(-200).reverse();
      return json(res, 200, { requests: reqs });
    } catch (e) {
      return json(res, 500, { error: String(e) });
    }
  }

  if (req.url === '/api/requests' && req.method === 'POST') {
    return readBody(req).then((body) => {
      try {
        if (!fs.existsSync(path.dirname(REQUESTS))) fs.mkdirSync(path.dirname(REQUESTS), { recursive: true });
        if (!fs.existsSync(REQUESTS)) fs.writeFileSync(REQUESTS, '');
        const b = safeJson(body) || {};
        const request = {
          requestId: b.requestId || ('req_' + Date.now()),
          projectId: b.projectId || 'default',
          createdAt: new Date().toISOString(),
          mode: b.mode || 'simple',
          bundle: b.bundle || ['sora_generate','remotion_render','qc_export'],
          payload: b.payload || {},
          note: b.note || ''
        };
        fs.appendFileSync(REQUESTS, JSON.stringify(request) + '\n');
        appendActivity({ kind: 'request_create', message: `Request ${request.requestId} for ${request.projectId}`, projectId: request.projectId });
        return json(res, 200, { ok: true, request });
      } catch (e) {
        return json(res, 400, { ok:false, error: String(e) });
      }
    });
  }

  // POST /api/jobs/enqueue
  // body: { projectId, bundle?: ['sora_generate','remotion_render','qc_export'], maxAttempts?, payload?, requestId? }
  if (req.url === '/api/jobs/enqueue' && req.method === 'POST') {
    return readBody(req).then((body) => {
      try {
        const b = safeJson(body) || {};
        const projectId = b.projectId || 'default';
        const bundle = Array.isArray(b.bundle) && b.bundle.length ? b.bundle : ['sora_generate','remotion_render','qc_export'];
        const maxAttempts = Number(b.maxAttempts || 2);
        const db = openJobsDb();
        const created = [];
        for (const type of bundle) {
          const id = `job_${Date.now()}_${Math.random().toString(16).slice(2)}_${type}`;
          enqueueJob(db, { id, type, projectId, maxAttempts, payload: { ...(b.payload||{}), requestId: b.requestId } });
          created.push({ id, type, projectId });
        }
        appendActivity({ kind: 'jobs_enqueue', message: `Enqueued ${bundle.join(', ')} for ${projectId}`, projectId });
        return json(res, 200, { ok: true, projectId, created });
      } catch (e) {
        return json(res, 400, { ok:false, error: String(e) });
      }
    });
  }

  // POST /api/jobs/run_one — runs brain/job_runner.mjs once (claims + runs next job)
  if (req.url === '/api/jobs/run_one' && req.method === 'POST') {
    const runner = path.resolve(ROOT, '..', 'brain', 'job_runner.mjs');
    const p = spawn(process.execPath, [runner], { cwd: path.resolve(ROOT, '..'), env: process.env });
    let out='';
    let err='';
    p.stdout.on('data', d => out += d.toString());
    p.stderr.on('data', d => err += d.toString());
    p.on('close', (code) => {
      appendActivity({ kind: 'job_runner_once', message: `job_runner exit ${code}`, projectId: 'system' });
      return json(res, 200, { ok: code === 0, code, stdout: out.slice(-4000), stderr: err.slice(-4000) });
    });
    return;
  }

  // POST /api/jobs/run_until_empty
  // body: { maxJobs?: number } (defaults 25)
  if (req.url === '/api/jobs/run_until_empty' && req.method === 'POST') {
    return readBody(req).then(async (body) => {
      const b = safeJson(body) || {};
      const maxJobs = Math.min(200, Math.max(1, Number(b.maxJobs || 25)));
      const runner = path.resolve(ROOT, '..', 'brain', 'job_runner.mjs');

      const results = [];
      for (let i = 0; i < maxJobs; i++) {
        const r = await new Promise((resolve) => {
          const p = spawn(process.execPath, [runner], { cwd: path.resolve(ROOT, '..'), env: process.env });
          let out='';
          let err='';
          p.stdout.on('data', d => out += d.toString());
          p.stderr.on('data', d => err += d.toString());
          p.on('close', (code) => resolve({ code, stdout: out, stderr: err }));
        });
        results.push({ i, code: r.code, stdout: r.stdout.slice(-2000), stderr: r.stderr.slice(-2000) });
        if ((r.stdout || '').includes('no queued jobs')) break;
      }

      appendActivity({ kind: 'job_runner_loop', message: `run_until_empty ran ${results.length} times`, projectId: 'system' });
      return json(res, 200, { ok: true, ran: results.length, results });
    });
  }

  // POST /api/jobs/:id/retry — sets job back to queued (best-effort)
  if (req.url?.startsWith('/api/jobs/') && req.url?.endsWith('/retry') && req.method === 'POST') {
    const id = req.url.split('/').at(3);
    try {
      const db = openJobsDb();
      db.prepare("update jobs set status='queued', runAt=?, lastError=null where id=?").run(Date.now(), id);
      appendActivity({ kind: 'job_retry', message: `Retry ${id}`, projectId: 'system' });
      return json(res, 200, { ok:true, id });
    } catch (e) {
      return json(res, 500, { ok:false, error: String(e) });
    }
  }

  // POST /api/jobs/:id/cancel — marks job cancelled (runner will ignore because it only claims queued)
  if (req.url?.startsWith('/api/jobs/') && req.url?.endsWith('/cancel') && req.method === 'POST') {
    const id = req.url.split('/').at(3);
    try {
      const db = openJobsDb();
      db.prepare("update jobs set status='cancelled', finishedAt=? where id=?").run(Date.now(), id);
      appendActivity({ kind: 'job_cancel', message: `Cancel ${id}`, projectId: 'system' });
      return json(res, 200, { ok:true, id });
    } catch (e) {
      return json(res, 500, { ok:false, error: String(e) });
    }
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
