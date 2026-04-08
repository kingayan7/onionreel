import fs from 'fs';
import path from 'path';

const OR_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CFG_DIR = path.join(OR_DIR, 'config');

export function loadClientConfig(clientId = 'default'){
  const p = path.join(CFG_DIR, 'clients', `${clientId}.json`);
  if (!fs.existsSync(p)) return { clientId };
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
