import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const AUTO_DIR = path.join(OR_DIR, 'autoedit');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${cmd} failed`);
}

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node mix_audio.mjs <projectId>');
  process.exit(2);
}

const projDir = path.join(AUTO_DIR, 'projects', projectId);
const outDir = path.join(AUTO_DIR, 'renders', projectId);
fs.mkdirSync(outDir, { recursive: true });

// VO script (already decided). Keep it local so we can replace with OpenAI TTS later.
const voText = [
  'Stop scrolling SAM dot gov for hours.',
  'MaxContrax uses AI to match government contracts to you.',
  'So you only see opportunities that fit.',
  'Daily alerts. Personalized matches.',
  'Less noise. More real shots.',
  'Start free for seven days.',
  'Start free at MaxContrax dot com.'
].join(' ');

const voTxtPath = path.join(projDir, 'vo_script.txt');
fs.mkdirSync(projDir, { recursive: true });
fs.writeFileSync(voTxtPath, voText + '\n');

const voAiff = path.join(outDir, 'vo.aiff');
const voWav = path.join(outDir, 'vo.wav');
const musicWav = path.join(outDir, 'music_silence.wav');
const mixWav = path.join(outDir, 'mix.wav');

// Generate VO using macOS "say" as a no-dependency v1 placeholder.
// (Later replace with OpenAI TTS for a real studio voice.)
run('say', ['-v', 'Alex', '-o', voAiff, voText]);
run('ffmpeg', ['-y', '-i', voAiff, '-ac', '2', '-ar', '48000', voWav]);

// Placeholder music bed: silence (30s) so we can wire ducking later.
run('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', '30', musicWav]);

// Mix and loudness-normalize (integrated loudness target -14 LUFS typical social).
run('ffmpeg', [
  '-y',
  '-i', musicWav,
  '-i', voWav,
  '-filter_complex',
  // simple mix: lower music, keep VO prominent
  '[0:a]volume=0.25[a0];[1:a]volume=1.0[a1];[a0][a1]amix=inputs=2:duration=longest:dropout_transition=0, loudnorm=I=-14:TP=-1.5:LRA=11',
  '-t', '30',
  mixWav
]);

console.log(JSON.stringify({ ok:true, projectId, voTxtPath, mixWav, note:'v1 placeholder mix using macOS say + silence bed' }, null, 2));
