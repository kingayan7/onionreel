import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DASH_DIR = path.join(OR_DIR, 'dashboard');
const PORT = process.env.ONIONREEL_DASHBOARD_PORT || '5059';

function log(line){
  const p = path.join(OR_DIR, 'logs', 'dashboard_server.log');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.appendFileSync(p, `[${new Date().toISOString()}] ${line}\n`);
}

const child = spawn(process.execPath, [path.join(DASH_DIR, 'server.mjs')], {
  cwd: DASH_DIR,
  env: { ...process.env, PORT },
  stdio: ['ignore','pipe','pipe']
});

child.stdout.on('data', d => log(d.toString().trimEnd()));
child.stderr.on('data', d => log(d.toString().trimEnd()));
child.on('exit', (code, sig) => log(`exit code=${code} sig=${sig}`));

log(`started dashboard server PORT=${PORT} pid=${child.pid}`);
