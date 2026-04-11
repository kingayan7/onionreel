import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(OR_DIR, 'autoedit', 'exports', 'still_packs');
fs.mkdirSync(OUT_DIR, { recursive: true });

const STOP_FILE = path.join(OR_DIR, 'ops', 'STOP_STILL_FARM');

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'inherit', env: process.env });
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status})`);
}

const CTA = 'Get Matches';
const OFFER = 'Government contracts • SAM.gov';
const PRICE = '$19.99/mo after • cancel anytime';

const HEADLINES = [
  'GET GOV.\nCONTRACTS\nFREE',
  'GET\nMATCHED\nDAILY',
  'STOP\nSCROLLING\nSAM.GOV',
  'FIND\nTHE RIGHT\nCONTRACTS',
  'SEE\nONLY\nMATCHES',
];

const VARIANTS = [
  { layout: 1, theme: 'ice' },
  { layout: 2, theme: 'ice' },
  { layout: 3, theme: 'ice' },
];

const maxRuns = Number(process.env.STILL_MAX_RUNS || 5);
const sleepSec = Number(process.env.STILL_SLEEP_SEC || 2);

for (let i = 0; i < maxRuns; i++) {
  if (fs.existsSync(STOP_FILE)) process.exit(0);

  const headline = HEADLINES[i % HEADLINES.length];
  const v = VARIANTS[i % VARIANTS.length];
  const packId = `maxcontrax-still-pro-${String(i+1).padStart(3,'0')}`;

  const env = {
    ...process.env,
    HEADLINE: headline,
    CTA,
    OFFER,
    PRICE,
    LAYOUT: String(v.layout),
    THEME: v.theme,
  };

  spawnSync('bash', ['-lc', `cd "${OR_DIR}" && node remotion/render_stills_v1.mjs ${packId}`], { stdio: 'inherit', env });

  if (sleepSec) spawnSync('bash', ['-lc', `sleep ${sleepSec}`], { stdio: 'inherit' });
}

console.log('done');
