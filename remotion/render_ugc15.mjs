import path from 'node:path';
import {spawnSync} from 'node:child_process';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REM_DIR = path.join(OR_DIR, 'remotion');

const out = process.argv[2];
if (!out) {
  console.error('usage: node remotion/render_ugc15.mjs <out.mp4>');
  process.exit(2);
}

const props = {
  ctaExact: process.env.CTA || 'Get Government Contracts Free',
  url: process.env.URL || 'https://maxcontrax.com',
};

const cmd = `cd "${REM_DIR}" && npx remotion render src/index.ts UGC15 "${out}" --props='${JSON.stringify(props).replace(/'/g, "'\\''")}' --log=warn`;
const r = spawnSync('bash', ['-lc', cmd], {stdio: 'inherit', env: process.env});
process.exit(r.status || 0);
