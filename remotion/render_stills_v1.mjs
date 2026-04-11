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
const ctaText = process.env.CTA || 'Get Government Contracts Free';
const offerLine = process.env.OFFER || 'Government contracts • SAM.gov';
const priceLine = process.env.PRICE || '$19.99/mo after • cancel anytime';

const variants = [
  { comp: 'StillAdSquare', size: '1080x1080', theme: 'sunset' },
  { comp: 'StillAdFeed', size: '1080x1350', theme: 'ice' },
  { comp: 'StillAdPortrait', size: '1080x1920', theme: 'violet' },
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
    showPerson: false,
  };
  run('bash', ['-lc', `cd "${REM_DIR}" && npx remotion still src/index.ts ${v.comp} "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`]);
  files.push(out);
}

const zip = path.join(OUT_DIR, `${packId}.zip`);
run('zip', ['-j','-q','-o', zip, ...files]);
console.log(JSON.stringify({ ok:true, packId, zip, files }, null, 2));
