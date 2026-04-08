import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DB_PATH = path.join(ROOT, 'jobs.db');

export function openDb(){
  fs.mkdirSync(ROOT, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(`
    create table if not exists jobs (
      id text primary key,
      type text not null,
      projectId text,
      status text not null,
      runAt integer,
      attempts integer not null default 0,
      maxAttempts integer not null default 3,
      payload text,
      outputs text,
      lastError text,
      createdAt integer not null,
      startedAt integer,
      finishedAt integer
    );
    create index if not exists idx_jobs_status_runAt on jobs(status, runAt);

    create table if not exists locks (
      key text primary key,
      ts integer not null
    );
  `);
  return db;
}

export function acquireLock(db, key, ttlMs = 10 * 60 * 1000){
  const now = Date.now();
  const row = db.prepare('select ts from locks where key=?').get(key);
  if (row && (now - row.ts) < ttlMs) return false;
  db.prepare('insert or replace into locks(key, ts) values(?, ?)').run(key, now);
  return true;
}

export function releaseLock(db, key){
  try { db.prepare('delete from locks where key=?').run(key); } catch {}
}

export function enqueueJob(db, job){
  const now = Date.now();
  const j = {
    id: job.id,
    type: job.type,
    projectId: job.projectId || null,
    status: 'queued',
    runAt: job.runAt ? new Date(job.runAt).getTime() : now,
    attempts: 0,
    maxAttempts: job.maxAttempts || 3,
    payload: JSON.stringify(job.payload || {}),
    outputs: null,
    lastError: null,
    createdAt: now,
  };
  db.prepare(`insert or replace into jobs (id,type,projectId,status,runAt,attempts,maxAttempts,payload,outputs,lastError,createdAt)
              values (@id,@type,@projectId,@status,@runAt,@attempts,@maxAttempts,@payload,@outputs,@lastError,@createdAt)`).run(j);
  return j;
}

export function claimNextJob(db){
  const now = Date.now();
  const row = db.prepare(`select * from jobs where status='queued' and (runAt is null or runAt<=?) order by runAt asc limit 1`).get(now);
  if (!row) return null;
  db.prepare(`update jobs set status='running', startedAt=?, attempts=attempts+1 where id=?`).run(now, row.id);
  return { ...row, payload: safeJson(row.payload), outputs: safeJson(row.outputs) };
}

export function markDone(db, id, outputs){
  db.prepare(`update jobs set status='done', finishedAt=?, outputs=? where id=?`).run(Date.now(), JSON.stringify(outputs||{}), id);
}

export function markFailed(db, id, err){
  db.prepare(`update jobs set status='failed', finishedAt=?, lastError=? where id=?`).run(Date.now(), String(err||''), id);
}

export function requeue(db, id, delayMs, err){
  const runAt = Date.now() + delayMs;
  db.prepare(`update jobs set status='queued', runAt=?, lastError=? where id=?`).run(runAt, String(err||''), id);
}

function safeJson(s){
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}
