import fs from 'fs';
import path from 'path';

export function withLock(lockPath, ttlMs, fn){
  const now = Date.now();
  try {
    if (fs.existsSync(lockPath)) {
      const st = fs.statSync(lockPath);
      if (now - st.mtimeMs < ttlMs) {
        return { skipped: true, reason: 'lock_active' };
      }
    }
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    fs.writeFileSync(lockPath, JSON.stringify({ ts: now }, null, 2));
    const res = fn();
    return { skipped: false, res };
  } finally {
    try { fs.unlinkSync(lockPath); } catch {}
  }
}
