import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/gen_vo_music_v1.mjs <projectId>');
  process.exit(2);
}

const projDir = path.join(AUTO_DIR, 'projects', projectId);
fs.mkdirSync(projDir, { recursive: true });

const voScriptPath = [
  path.join(projDir, 'vo_script_v3.txt'),
  path.join(projDir, 'vo_script_v2.txt'),
  path.join(projDir, 'vo_script.txt'),
].find(p => fs.existsSync(p));

if (!voScriptPath) throw new Error('missing VO script file (vo_script_v3.txt/v2/txt)');
const voText = fs.readFileSync(voScriptPath, 'utf8').trim().replace(/\s+/g, ' ');

const aiff = path.join(projDir, 'vo.aiff');
const wav = path.join(projDir, 'vo.wav');

// macOS say voice placeholder
run('say', ['-v', process.env.SAY_VOICE || 'Alex', '-o', aiff, voText]);
run('ffmpeg', ['-hide_banner','-loglevel','error','-y', '-i', aiff, '-ac', '2', '-ar', '48000', wav]);

// Simple music bed: tone + filtered noise (deterministic), 30s
const music = path.join(projDir, 'music.wav');
run('ffmpeg', [
  '-hide_banner','-loglevel','error','-y',
  '-f','lavfi','-i','sine=frequency=98:sample_rate=48000',
  '-f','lavfi','-i','anoisesrc=color=white:amplitude=0.05:sample_rate=48000',
  '-filter_complex',
  '[0:a]volume=0.06,lowpass=f=180,highpass=f=35[a0];[1:a]lowpass=f=1200,highpass=f=200,volume=0.02[a1];[a0][a1]amix=inputs=2:duration=shortest,afade=t=in:st=0:d=0.15,afade=t=out:st=29.6:d=0.4',
  '-t','30',
  '-ac','2','-ar','48000',
  music
]);

console.log(JSON.stringify({ ok:true, projectId, voScriptPath, voWav: wav, musicWav: music }, null, 2));
