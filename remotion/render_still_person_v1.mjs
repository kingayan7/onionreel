import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');

const role = process.argv[2];
const out = process.argv[3];
if (!role || !out) {
  console.error('usage: node remotion/render_still_person_v1.mjs <role:contractor|nurse|security> <out.png>');
  process.exit(2);
}

const headline = process.env.HEADLINE || 'GET GOV.\nCONTRACTS\nFREE';
const ctaText = process.env.CTA || 'Get Matches';
const offerLine = process.env.OFFER || 'Government contracts • SAM.gov';
const priceLine = process.env.PRICE || '$19.99/mo after • cancel anytime';
const theme = process.env.THEME || 'ice';
const layoutVariant = Number(process.env.LAYOUT || 2);

const props = {
  size: '1080x1350',
  headline,
  subline: offerLine,
  ctaText,
  offerLine,
  priceLine,
  theme,
  layoutVariant,
  showPerson: true,
  personAsset: `assets/maxcontrax/people/${role}.png`,
};

const cmd = `cd "${REM_DIR}" && npx remotion still src/index.ts StillAdFeed "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`;
const r = spawnSync('bash', ['-lc', cmd], { stdio: 'inherit', env: process.env });
process.exit(r.status || 0);
