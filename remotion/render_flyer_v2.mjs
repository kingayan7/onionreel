import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');

const role = process.argv[2];
const out = process.argv[3];
if (!role || !out) {
  console.error('usage: node remotion/render_flyer_v2.mjs <role> <out.png>');
  process.exit(2);
}

const props = {
  role,
  headline: process.env.HEADLINE || 'GET GOV.\nCONTRACTS\nFREE',
  subline: process.env.SUBLINE || 'Government contracts • SAM.gov',
  ctaText: process.env.CTA || 'Get Matches',
  offerLine: process.env.OFFER || 'Government contracts • SAM.gov',
  priceLine: process.env.PRICE || '$19.99/mo after • cancel anytime',
};

const cmd = `cd "${REM_DIR}" && npx remotion still src/index.ts StillFlyerV2 "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`;
const r = spawnSync('bash', ['-lc', cmd], { stdio: 'inherit', env: process.env });
process.exit(r.status || 0);
