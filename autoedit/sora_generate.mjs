import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');
const SORA_PY = path.join(OR_DIR, 'scripts', 'sora_render.py');

function loadJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function saveJson(p,obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2)+'\n'); }

function sha1(s){ return crypto.createHash('sha1').update(String(s)).digest('hex'); }

function runStreaming(cmd, args, env={}){
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } });
    p.on('error', reject);
    p.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed (exit ${code})`));
    });
  });
}

async function runSoraOnce({ model, size, seconds, prompt, out }){
  const args = [
    SORA_PY,
    '--model', model,
    '--size', size,
    '--seconds', String(seconds || 4),
    '--prompt', prompt,
    '--out', out,
    '--poll', '10'
  ];
  await runStreaming('python3', args);
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node sora_generate.mjs <projectId>');
  process.exit(2);
}

if (!fs.existsSync(SORA_PY)) {
  console.error('missing:', SORA_PY);
  process.exit(2);
}

const projDir = path.join(AUTO_DIR, 'projects', projectId);
const blueprintPath = path.join(projDir, 'blueprint.json');
const manifestPath = path.join(projDir, 'stock_manifest.json');
if (!fs.existsSync(blueprintPath) || !fs.existsSync(manifestPath)) {
  console.error('missing project files in', projDir);
  process.exit(2);
}

const blueprint = loadJson(blueprintPath);
const manifest = loadJson(manifestPath);
manifest.assets = manifest.assets || [];

const outClipsDir = path.join(AUTO_DIR, 'cache', projectId);
fs.mkdirSync(outClipsDir, { recursive: true });

// v1 prompts (aligned to our MaxContrax beats). Keep them clean, cinematic, realistic.
const prompts = blueprint.soraPrompts || [
  {
    id: 'overwhelm_scroll',
    seconds: 4,
    prompt: 'Vertical 9:16 cinematic b-roll. Close-up of a laptop and hands rapidly scrolling through many government contract listings, multiple browser tabs, slight motion blur, modern office lighting, premium commercial look, shallow depth of field.'
  },
  {
    id: 'ai_matching',
    seconds: 4,
    prompt: 'Vertical 9:16 cinematic b-roll. Abstract minimal AI interface visuals: clean data cards gently animating into place with subtle checkmarks, dark premium background, orange accent highlights, realistic screen reflections, modern tech commercial style.'
  },
  {
    id: 'email_alert',
    seconds: 4,
    prompt: 'Vertical 9:16 cinematic b-roll. Smartphone close-up receiving a new email notification, modern UI, subtle glow, premium lighting, shallow depth of field, commercial product shot.'
  },
  {
    id: 'handshake_trust',
    seconds: 4,
    prompt: 'Vertical 9:16 cinematic b-roll. Professional business handshake and contract signing moment, modern office, confident mood, premium commercial lighting, shallow depth of field.'
  }
];

// Allow config override (per-client).
let model = process.env.SORA_MODEL || 'sora-2-pro';
try {
  const { loadClientConfig } = await import('../config/load_config.mjs');
  const cfg = loadClientConfig('maxcontrax');
  model = cfg?.autoedit?.soraModel || model;
} catch {}
const size = `${blueprint.width || 1080}x${blueprint.height || 1920}`;

let generated = 0;

// Deterministic caching: file name includes prompt hash. If prompt changes, we generate a new file.
function desiredOutPath(item){
  const h = sha1(`${model}|${size}|${item.seconds||4}|${item.prompt}`).slice(0,12);
  return path.join(outClipsDir, `${item.id}__${h}.mp4`);
}

const concurrency = Math.max(1, Math.min(3, Number(process.env.SORA_CONCURRENCY || 2)));
const queue = prompts.map(p => ({ ...p }));

async function worker(){
  while (queue.length) {
    const p = queue.shift();
    const out = desiredOutPath(p);
    let a = manifest.assets.find(x => x.id === p.id);

    // Skip if manifest already points to an existing file.
    if (a?.localPath) {
      const abs = path.join(AUTO_DIR, a.localPath);
      if (fs.existsSync(abs)) continue;
    }

    // Skip if desired file already exists.
    if (fs.existsSync(out)) {
      if (!a) { a = { id: p.id, type: 'video', notes: 'sora_generated' }; manifest.assets.push(a); }
      a.localPath = path.relative(AUTO_DIR, out);
      a.source = 'sora';
      a.promptHash = path.basename(out).split('__')[1]?.replace('.mp4','');
      continue;
    }

    let ok = false;
    try {
      await runSoraOnce({ model, size, seconds: p.seconds || 4, prompt: p.prompt, out });
      ok = true;
    } catch (e) {
      const msg = String(e.message || e);
      // Retry once with a safer prompt if blocked/timeouts.
      const safePrompt = `Vertical 9:16 cinematic b-roll. Professional business office scene, clean modern lighting, premium commercial look, shallow depth of field. No text.`;
      try {
        await runSoraOnce({ model, size, seconds: p.seconds || 4, prompt: safePrompt, out });
        ok = true;
        if (a) a.note = `retried_with_safe_prompt_due_to_error: ${msg}`;
      } catch {
        if (a) a.error = `sora_failed: ${msg}`;
      }
    }

    if (ok) {
      generated++;
      if (!a) { a = { id: p.id, type: 'video', notes: 'sora_generated' }; manifest.assets.push(a); }
      a.localPath = path.relative(AUTO_DIR, out);
      a.source = 'sora';
      a.promptHash = path.basename(out).split('__')[1]?.replace('.mp4','');
      a.error = undefined;
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

saveJson(manifestPath, manifest);
console.log(JSON.stringify({ ok:true, projectId, generated, outClipsDir, manifestPath }, null, 2));
