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
  ok: true
};

function statFile(p){
  const st = fs.statSync(p);
  return { bytes: st.size, mb: +(st.size/1024/1024).toFixed(2) };
}

// 1) Basic file metadata
report.files.master_30s = { path: master, ...statFile(master) };

// Bonus: if film look / posters exist, capture them too (for dashboard + final pack coherence)
const film = path.join(rendersDir, 'remotion_master_30s_film.mp4');
if (fs.existsSync(film)) report.files.film_30s = { path: film, ...statFile(film) };
const poster = path.join(AUTO_DIR, 'exports', projectId, 'poster_1080x1920.png');
const thumb = path.join(AUTO_DIR, 'exports', projectId, 'thumb_1280x720.jpg');
if (fs.existsSync(poster)) report.files.poster = { path: poster, ...statFile(poster) };
if (fs.existsSync(thumb)) report.files.thumb = { path: thumb, ...statFile(thumb) };

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
    report.files[path.basename(out)] = { path: out, ...statFile(out) };
    report.checks.push({ kind:'variant_present', ok:true, seconds, path: out });
    continue;
  }
  const r = run('ffmpeg', ['-hide_banner','-loglevel','error','-y','-i', master, '-t', String(seconds), '-c:v', 'libx264', '-pix_fmt','yuv420p','-movflags','+faststart', out]);
  if (r.status !== 0) {
    report.ok = false;
    report.checks.push({ kind:'variant_render', ok:false, seconds, detail:(r.stderr||'').trim().slice(0,800) });
  } else {
    report.files[path.basename(out)] = { path: out, ...statFile(out) };
    report.checks.push({ kind:'variant_render', ok:true, seconds });
  }
}

// 5) Export pack manifest
const exportDir = path.join(AUTO_DIR, 'exports', projectId);
fs.mkdirSync(exportDir, { recursive: true });

const outputs = {
  master_30s: path.relative(AUTO_DIR, master),
  variant_15s: path.relative(AUTO_DIR, v15),
  variant_6s: path.relative(AUTO_DIR, v6),
};

const filmOut = path.join(rendersDir, 'remotion_master_30s_film.mp4');
if (fs.existsSync(filmOut)) outputs.film_30s = path.relative(AUTO_DIR, filmOut);
const posterOut = path.join(exportDir, 'poster_1080x1920.png');
const thumbOut = path.join(exportDir, 'thumb_1280x720.jpg');
if (fs.existsSync(posterOut)) outputs.poster = path.relative(AUTO_DIR, posterOut);
if (fs.existsSync(thumbOut)) outputs.thumb = path.relative(AUTO_DIR, thumbOut);

const pack = {
  projectId,
  createdAt: report.ts,
  outputs,
  qcReport: 'qc_report.json'
};

fs.writeFileSync(path.join(exportDir, 'export_pack.json'), JSON.stringify(pack, null, 2) + '\n');
fs.writeFileSync(path.join(exportDir, 'qc_report.json'), JSON.stringify(report, null, 2) + '\n');

console.log(JSON.stringify({ ok:true, projectId, reportOk: report.ok, exportDir }, null, 2));
