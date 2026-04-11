import path from 'node:path';
import {spawnSync} from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');

const out = process.argv[2];
if (!out) {
  console.error('usage: node remotion/render_flyer_v16.mjs <out.png>');
  process.exit(2);
}

const props = {
  cta: process.env.CTA || 'Get Government Contracts Free',
  trialLine: process.env.TRIAL || '( 7 Day free Trial • $19.99/mo after)',
  subline: process.env.SUBLINE || 'Contract alerts tailored to your business',
};

const cmd = `cd "${REM_DIR}" && npx remotion still src/index.ts StillFlyerV16 "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`;
const r = spawnSync('bash', ['-lc', cmd], {stdio: 'inherit', env: process.env});
process.exit(r.status || 0);
