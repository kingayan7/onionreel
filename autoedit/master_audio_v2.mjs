import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) {
    throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  }
  return (r.stdout||'').toString();
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node autoedit/master_audio_v2.mjs <projectId>');
  process.exit(2);
}

const rendersDir = path.join(AUTO_DIR, 'renders', projectId);
fs.mkdirSync(rendersDir, { recursive: true });

// Inputs
const masterIn = path.join(rendersDir, 'remotion_master_30s.mp4');
if (!fs.existsSync(masterIn)) {
  throw new Error(`missing input video: ${masterIn}`);
}

// Optional VO: autoedit/projects/<pid>/vo.wav (or vo.mp3)
const projDir = path.join(AUTO_DIR, 'projects', projectId);
const voWav = path.join(projDir, 'vo.wav');
const voMp3 = path.join(projDir, 'vo.mp3');
const voIn = fs.existsSync(voWav) ? voWav : (fs.existsSync(voMp3) ? voMp3 : null);

// Music bed: autoedit/projects/<pid>/music.wav (optional)
const musicWav = path.join(projDir, 'music.wav');
const musicIn = fs.existsSync(musicWav) ? musicWav : null;

// Output
const out = path.join(rendersDir, 'remotion_master_30s_mastered.mp4');

// If we have no VO/music, just copy.
if (!voIn && !musicIn) {
  fs.copyFileSync(masterIn, out);
  console.log(JSON.stringify({ ok:true, projectId, out, mode:'copy_no_audio_inputs' }, null, 2));
  process.exit(0);
}

// Create a basic cinematic mastering chain:
// - Music bed at low volume
// - Duck music when VO present
// - Add subtle whoosh/ping SFX (generated)
// - Loudness normalize to -14 LUFS, TP -1.5

const tmp = path.join(rendersDir, 'tmp_mastering');
fs.mkdirSync(tmp, { recursive: true });

// Generate SFX (quick + deterministic)
const whoosh = path.join(tmp, 'whoosh.wav');
const ping = path.join(tmp, 'ping.wav');
run('ffmpeg', ['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','anoisesrc=color=white:amplitude=0.22','-filter_complex',
  'highpass=f=500,lowpass=f=9500,afade=t=in:st=0:d=0.03,afade=t=out:st=0.14:d=0.06,volume=0.25',
  '-t','0.22', whoosh]);
run('ffmpeg', ['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','sine=frequency=1200:sample_rate=48000','-filter_complex',
  'afade=t=in:st=0:d=0.01,afade=t=out:st=0.08:d=0.08,volume=0.12',
  '-t','0.16', ping]);

// Prepare inputs list
const inputs = [
  ['-i', masterIn],
];
if (musicIn) inputs.push(['-i', musicIn]);
if (voIn) inputs.push(['-i', voIn]);
inputs.push(['-i', whoosh]);
inputs.push(['-i', ping]);

const flatInputs = inputs.flat();

// Build filter graph
// Streams:
// 0:a = original video audio (ignored)
// 1:a = music (if present)
// 2:a = vo (if present)
// last two are whoosh/ping
let musicIdx = musicIn ? 1 : null;
let voIdx = voIn ? (musicIn ? 2 : 1) : null;
let whooshIdx = (musicIn ? 2 : 1) + (voIn ? 1 : 0);
let pingIdx = whooshIdx + 1;

let parts = [];
let amixInputs = [];

if (musicIdx !== null) {
  // music base
  parts.push(`[${musicIdx}:a]volume=0.10,aresample=48000[music]`);
}
if (voIdx !== null) {
  parts.push(`[${voIdx}:a]volume=1.0,aresample=48000[vo]`);
}

// Duck music under VO
if (musicIdx !== null && voIdx !== null) {
  parts.push(`[music][vo]sidechaincompress=threshold=0.02:ratio=8:attack=5:release=200:makeup=1.0[mduck]`);
  amixInputs.push('[mduck]');
  amixInputs.push('[vo]');
} else if (musicIdx !== null) {
  amixInputs.push('[music]');
} else if (voIdx !== null) {
  amixInputs.push('[vo]');
}

// Place SFX: whoosh at 0s and 2s; ping at 10s
parts.push(`[${whooshIdx}:a]adelay=0|0,volume=0.8[w0]`);
parts.push(`[${whooshIdx}:a]adelay=2000|2000,volume=0.6[w1]`);
parts.push(`[${pingIdx}:a]adelay=10000|10000,volume=0.9[p0]`);

amixInputs.push('[w0]');
amixInputs.push('[w1]');
amixInputs.push('[p0]');

// Mix + loudnorm
parts.push(`${amixInputs.join('')}amix=inputs=${amixInputs.length}:duration=longest, loudnorm=I=-14:TP=-1.5:LRA=11[mix]`);

const filter = parts.join(';');

run('ffmpeg', [
  '-hide_banner','-loglevel','error','-y',
  ...flatInputs,
  '-map','0:v:0','-map','[mix]',
  '-filter_complex', filter,
  '-c:v','copy',
  '-c:a','aac','-b:a','256k',
  '-movflags','+faststart',
  out
]);

console.log(JSON.stringify({ ok:true, projectId, out, mode:'master_audio_v2', hasMusic: !!musicIn, hasVo: !!voIn }, null, 2));
