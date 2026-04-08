import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), 'data');
const PROJECTS = path.join(DATA_DIR, 'projects.json');
const ACTIVITY = path.join(DATA_DIR, 'activity.json');

function ensureFile(p, init){
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(init, null, 2) + '\n');
}

export function initStore(){
  ensureFile(PROJECTS, { projects: [] });
  ensureFile(ACTIVITY, { events: [] });
}

export function listProjects(){
  initStore();
  return JSON.parse(fs.readFileSync(PROJECTS, 'utf8')).projects || [];
}

export function getProject(id){
  return listProjects().find(p => p.id === id) || null;
}

export function upsertProject(project){
  initStore();
  const data = JSON.parse(fs.readFileSync(PROJECTS, 'utf8'));
  const projects = data.projects || [];
  const i = projects.findIndex(p => p.id === project.id);
  if (i >= 0) projects[i] = { ...projects[i], ...project, updatedAt: new Date().toISOString() };
  else projects.push({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  fs.writeFileSync(PROJECTS, JSON.stringify({ projects }, null, 2) + '\n');
  return project;
}

export function appendActivity(evt){
  initStore();
  const data = JSON.parse(fs.readFileSync(ACTIVITY, 'utf8'));
  const events = data.events || [];
  events.push({
    id: crypto.randomUUID?.() || String(Date.now()),
    ts: new Date().toISOString(),
    ...evt
  });
  fs.writeFileSync(ACTIVITY, JSON.stringify({ events }, null, 2) + '\n');
}

export function listActivity(limit=100){
  initStore();
  const events = (JSON.parse(fs.readFileSync(ACTIVITY, 'utf8')).events || []).slice(-limit);
  return events;
}
