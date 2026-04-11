import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');

const role = process.argv[2];
const out = process.argv[3];
if (!role || !out) {
  console.error('usage: node remotion/render_flyer_v10.mjs <role> <out.png>');
  process.exit(2);
}

const props = {
  role,
  ctaLine1: process.env.CTA1 || 'Get Government',
  ctaLine2: process.env.CTA2 || 'Contracts Free',
  trialLine: process.env.TRIAL || '( 7 Day free Trial • $19.99/mo after)',
  subline: process.env.SUBLINE || 'AI matches contracts to your business',
};

const cmd = `cd "${REM_DIR}" && npx remotion still src/index.ts StillFlyerV10 "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`;
const r = spawnSync('bash', ['-lc', cmd], { stdio: 'inherit', env: process.env });
process.exit(r.status || 0);
