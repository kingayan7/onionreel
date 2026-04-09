import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  return { status: r.status, stdout: (r.stdout||'').toString(), stderr: (r.stderr||'').toString() };
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node qc_export.mjs <projectId>');
  process.exit(2);
}

const rendersDir = path.join(AUTO_DIR, 'renders', projectId);

// Prefer Remotion outputs (dashboard product path), fall back to legacy autoedit master.
const remotionMaster = path.join(rendersDir, 'remotion_master_30s_mastered.mp4');
const remotionMasterRaw = path.join(rendersDir, 'remotion_master_30s.mp4');
const legacyMaster = path.join(rendersDir, 'master_30s.mp4');

const master = fs.existsSync(remotionMaster)
  ? remotionMaster
  : (fs.existsSync(remotionMasterRaw) ? remotionMasterRaw : legacyMaster);

if (!fs.existsSync(master)) {
  console.error('missing master:', master);
  process.exit(2);
}

const report = {
  projectId,
  ts: new Date().toISOString(),
  files: {},
  checks: [],
  issues: [],
  ok: true
};

function statFile(p){
  const st = fs.statSync(p);
  return { bytes: st.size, mb: +(st.size/1024/1024).toFixed(2) };
}

function fail(code, detail){
  report.ok = false;
  report.issues.push({ level: 'fail', code, detail });
}

function warn(code, detail){
  report.issues.push({ level: 'warn', code, detail });
}

function reqFile(label, p, { minBytes = 10_000 } = {}){
  if (!fs.existsSync(p)) {
    fail('missing_required_file', `${label}: ${p}`);
    return null;
  }
  const st = fs.statSync(p);
  if (st.size < minBytes) {
    fail('file_too_small', `${label}: ${p} bytes=${st.size}`);
  }
  report.files[label] = { path: p, ...statFile(p) };
  return p;
}

// 1) Required deliverables (MaxContrax production defaults)
// These are the things we expect for a "top quality" pack.
reqFile('master_30s', master, { minBytes: 200_000 });

const mastered = path.join(rendersDir, 'remotion_master_30s_mastered.mp4');
if (!fs.existsSync(mastered)) {
  warn('missing_mastered', mastered);
} else {
  reqFile('mastered_30s', mastered, { minBytes: 200_000 });
}

const film = path.join(rendersDir, 'remotion_master_30s_film.mp4');
if (!fs.existsSync(film)) {
  warn('missing_film_look', film);
} else {
  reqFile('film_30s', film, { minBytes: 200_000 });
}

const exportDir = path.join(AUTO_DIR, 'exports', projectId);
const poster = path.join(exportDir, 'poster_1080x1920.png');
const thumb = path.join(exportDir, 'thumb_1280x720.jpg');
// Posters are required for the ad pack.
reqFile('poster', poster, { minBytes: 20_000 });
reqFile('thumb', thumb, { minBytes: 10_000 });

// 2) ffprobe duration/resolution
{
  const r = run('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate','-show_entries','format=duration','-of','json', master]);
  if (r.status !== 0) {
    report.ok = false;
    report.checks.push({ kind:'ffprobe', ok:false, detail:r.stderr.trim().slice(0,800) });
  } else {
    const j = JSON.parse(r.stdout);
    const s = (j.streams && j.streams[0]) || {};
    const dur = +(j.format?.duration || 0);
    report.checks.push({ kind:'meta', ok:true, durationSec: dur, width: s.width, height: s.height, fps: s.r_frame_rate });
    // tolerance
    if (dur < 28 || dur > 32) {
      report.ok = false;
      report.checks.push({ kind:'duration', ok:false, detail:`durationSec=${dur}` });
    }
    if (s.width !== 1080 || s.height !== 1920) {
      report.checks.push({ kind:'resolution', ok:false, detail:`${s.width}x${s.height}` });
    }
  }
}

// 3) Black frame detect (quick)
{
  const r = run('ffmpeg', ['-hide_banner','-i', master, '-vf', 'blackdetect=d=0.3:pic_th=0.98', '-an', '-f', 'null', '-']);
  const hasBlack = /black_start:/i.test(r.stderr);
  report.checks.push({ kind:'blackdetect', ok: !hasBlack, detail: hasBlack ? r.stderr.split('\n').filter(l=>l.includes('black_start')).slice(0,5) : [] });
  if (hasBlack) report.ok = false;
}

// 4) Variants (15s + 6s)
// Prefer existing Remotion variants; otherwise generate quick trims from the chosen master.
const remV15 = path.join(rendersDir, 'remotion_variant_15s.mp4');
const remV6 = path.join(rendersDir, 'remotion_variant_6s.mp4');
const v15 = fs.existsSync(remV15) ? remV15 : path.join(rendersDir, 'variant_15s.mp4');
const v6 = fs.existsSync(remV6) ? remV6 : path.join(rendersDir, 'variant_6s.mp4');

for (const [out, seconds] of [[v15,15],[v6,6]]) {
  if (fs.existsSync(out)) {
    // Required output: variants must exist and be non-trivial size.
    reqFile(`variant_${seconds}s`, out, { minBytes: 80_000 });
    report.checks.push({ kind:'variant_present', ok:true, seconds, path: out });
    continue;
  }
  const r = run('ffmpeg', ['-hide_banner','-loglevel','error','-y','-i', master, '-t', String(seconds), '-c:v', 'libx264', '-pix_fmt','yuv420p','-movflags','+faststart', out]);
  if (r.status !== 0) {
    fail('variant_render_failed', `seconds=${seconds} ${(r.stderr||'').trim().slice(0,800)}`);
    report.checks.push({ kind:'variant_render', ok:false, seconds, detail:(r.stderr||'').trim().slice(0,800) });
  } else {
    reqFile(`variant_${seconds}s`, out, { minBytes: 80_000 });
    report.checks.push({ kind:'variant_render', ok:true, seconds });
  }
}

// 5) Export pack manifest
fs.mkdirSync(exportDir, { recursive: true });

const outputs = {
  master_30s: path.relative(AUTO_DIR, master),
  variant_15s: path.relative(AUTO_DIR, v15),
  variant_6s: path.relative(AUTO_DIR, v6),
};

if (fs.existsSync(mastered)) outputs.mastered_30s = path.relative(AUTO_DIR, mastered);
if (fs.existsSync(film)) outputs.film_30s = path.relative(AUTO_DIR, film);
if (fs.existsSync(poster)) outputs.poster = path.relative(AUTO_DIR, poster);
if (fs.existsSync(thumb)) outputs.thumb = path.relative(AUTO_DIR, thumb);

const pack = {
  projectId,
  createdAt: report.ts,
  outputs,
  qcReport: 'qc_report.json'
};

fs.writeFileSync(path.join(exportDir, 'export_pack.json'), JSON.stringify(pack, null, 2) + '\n');
fs.writeFileSync(path.join(exportDir, 'qc_report.json'), JSON.stringify(report, null, 2) + '\n');

console.log(JSON.stringify({ ok:true, projectId, reportOk: report.ok, exportDir }, null, 2));
