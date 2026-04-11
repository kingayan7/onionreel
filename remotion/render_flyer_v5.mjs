import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');

const role = process.argv[2];
const out = process.argv[3];
if (!role || !out) {
  console.error('usage: node remotion/render_flyer_v5.mjs <role> <out.png>');
  process.exit(2);
}

const props = {
  role,
  ctaText: process.env.CTA || 'Get Gov Contracts Free (7 Days)',
  subline: process.env.SUBLINE || 'AI matches contracts to your business',
  offerLine: process.env.OFFER || 'Start Free • 7-day trial',
  priceLine: process.env.PRICE || '$19.99/mo after • cancel anytime',
};

const cmd = `cd "${REM_DIR}" && npx remotion still src/index.ts StillFlyerV5 "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`;
const r = spawnSync('bash', ['-lc', cmd], { stdio: 'inherit', env: process.env });
process.exit(r.status || 0);
