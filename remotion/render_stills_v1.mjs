import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');
const OUT_DIR = path.join(OR_DIR, 'autoedit', 'exports', 'still_packs');
fs.mkdirSync(OUT_DIR, { recursive: true });

function run(cmd, args){
  const r = spawnSync(cmd, args, { stdio: 'pipe' });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${(r.stderr||r.stdout||'').toString()}`);
  return (r.stdout||'').toString();
}

const packId = process.argv[2] || ('stillpack_' + Date.now());
const headline = process.env.HEADLINE || 'GET GOV.\nCONTRACTS\nFREE';
const ctaText = process.env.CTA || 'Get Matches';
const offerLine = process.env.OFFER || 'Government contracts • SAM.gov';
const priceLine = process.env.PRICE || '$19.99/mo after • cancel anytime';
const layoutVariant = (Number(process.env.LAYOUT || 1) === 2 ? 2 : (Number(process.env.LAYOUT || 1) === 3 ? 3 : 1));
const theme = (process.env.THEME || 'ice');

const variants = [
  { comp: 'StillAdSquare', size: '1080x1080', theme },
  { comp: 'StillAdFeed', size: '1080x1350', theme },
  { comp: 'StillAdPortrait', size: '1080x1920', theme },
];

const files = [];
for (const v of variants) {
  const out = path.join(OUT_DIR, `${packId}__${v.size}.png`);
  const props = {
    size: v.size,
    headline,
    subline: offerLine,
    ctaText,
    offerLine,
    priceLine,
    theme: v.theme,
    layoutVariant,
    showPerson: false,
  };
  run('bash', ['-lc', `cd "${REM_DIR}" && npx remotion still src/index.ts ${v.comp} "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`]);
  files.push(out);
}

const zip = path.join(OUT_DIR, `${packId}.zip`);
run('zip', ['-j','-q','-o', zip, ...files]);
console.log(JSON.stringify({ ok:true, packId, zip, files }, null, 2));
