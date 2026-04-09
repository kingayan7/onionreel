import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args, opts={}){
  const r = spawnSync(cmd, args, { stdio: 'pipe', ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  }
  return (r.stdout||'').toString();
}

const projectId = process.argv[2] || 'maxcontrax-reel-v1';
const outDir = path.join(AUTO_DIR, 'renders', projectId);
fs.mkdirSync(outDir, { recursive: true });

const master = path.join(outDir, 'remotion_master_30s.mp4');
const v15 = path.join(outDir, 'remotion_variant_15s.mp4');
const v6 = path.join(outDir, 'remotion_variant_6s.mp4');

// Render 30s via Remotion.
// Pass props so we can render any projectId without editing Root.tsx.
let props = null;
try {
  const bpPath = path.join(AUTO_DIR, 'projects', projectId, 'blueprint.json');
  if (fs.existsSync(bpPath)) {
    const bp = JSON.parse(fs.readFileSync(bpPath, 'utf8'));
    props = {
      title: 'MaxContrax',
      cta: 'Start Free at MaxContrax.com',
      accent: '#E17B3B',
      bg: '#FFFFFF',
      fg: '#0B0B0B',
      projectId,
      beats: bp.beats,
      clips: {
        overwhelm: 'overwhelm_scroll.mp4',
        ai: 'ai_matching.mp4',
        email: 'email_alert.mp4',
        trust: 'shortlist_focus.mp4',
      },
    };
  }
} catch {}
const propsArg = props ? ` --props='${JSON.stringify(props).replace(/'/g,"'\\''")}'` : '';
run('bash', ['-lc', `cd "${REM_DIR}" && npx remotion render src/index.ts Reel30 "${master}" --log=warn${propsArg}`]);

// Variants via ffmpeg trim (fast + deterministic)
// If project has markers.json, snap cutpoints to the nearest prior marker so variants feel intentionally cut.
let cut15 = 15;
let cut6 = 6;
try {
  const markersPath = path.join(AUTO_DIR, 'projects', projectId, 'markers.json');
  if (fs.existsSync(markersPath)) {
    const m = JSON.parse(fs.readFileSync(markersPath, 'utf8'));
    const pts = (m.cutPointsSec || []).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
    const snap = (t) => {
      const prior = pts.filter(x => x <= t + 0.05);
      return prior.length ? prior[prior.length - 1] : t;
    };
    cut15 = snap(15);
    cut6 = snap(6);
  }
} catch {}

run('ffmpeg', ['-y','-i', master, '-t', String(cut15), '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart', v15]);
run('ffmpeg', ['-y','-i', master, '-t', String(cut6), '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart', v6]);

console.log(JSON.stringify({ ok:true, projectId, master, v15, v6 }, null, 2));
