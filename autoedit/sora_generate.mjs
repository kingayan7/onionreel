import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');
const SORA_PY = path.join(OR_DIR, 'scripts', 'sora_render.py');

function loadJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function saveJson(p,obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2)+'\n'); }

function run(cmd, args, env={}){
  const r = spawnSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  if (r.status !== 0) throw new Error(`${cmd} failed`);
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

const model = process.env.SORA_MODEL || 'sora-2-pro';
const size = `${blueprint.width || 1080}x${blueprint.height || 1920}`;

let generated = 0;
for (const p of prompts) {
  const out = path.join(outClipsDir, `${p.id}.mp4`);
  if (fs.existsSync(out)) continue;
  // Run Sora render. If moderation blocks, retry once with a safer prompt.
  const argsBase = [
    SORA_PY,
    '--model', model,
    '--size', size,
    '--seconds', String(p.seconds || 4),
    '--prompt', p.prompt,
    '--out', out,
    '--poll', '10'
  ];

  let ok = false;
  let a = manifest.assets.find(x => x.id === p.id);
  try {
    run('python3', argsBase);
    ok = true;
  } catch (e) {
    const msg = String(e.message || e);
    // Common failure: moderation_blocked or transient network timeout. Retry once with a safer prompt.
    const safePrompt = `Vertical 9:16 cinematic b-roll. Professional business office scene, clean modern lighting, premium commercial look, shallow depth of field. No text.`;
    try {
      const argsRetry = [...argsBase];
      const idx = argsRetry.indexOf('--prompt');
      if (idx !== -1) argsRetry[idx + 1] = safePrompt;
      run('python3', argsRetry);
      ok = true;
      if (a) a.note = `retried_with_safe_prompt_due_to_error: ${msg}`;
    } catch (e2) {
      if (a) a.error = `sora_failed: ${msg}`;
    }
  }

  if (ok) generated++;

  // update manifest asset localPath
  let a = manifest.assets.find(x => x.id === p.id);
  if (!a) { a = { id: p.id, type: 'video', notes: 'sora_generated' }; manifest.assets.push(a); }
  a.localPath = path.relative(AUTO_DIR, out);
  a.source = 'sora';
}

saveJson(manifestPath, manifest);
console.log(JSON.stringify({ ok:true, projectId, generated, outClipsDir, manifestPath }, null, 2));
