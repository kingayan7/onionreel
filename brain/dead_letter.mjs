import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DLQ = path.join(ROOT, 'dead_letter');

export function writeDeadLetter(job, error){
  fs.mkdirSync(DLQ, { recursive: true });
  const p = path.join(DLQ, `${job.id}.json`);
  const payload = {
    ts: new Date().toISOString(),
    job,
    error: String(error || '')
  };
  fs.writeFileSync(p, JSON.stringify(payload, null, 2) + '\n');
  return p;
}
