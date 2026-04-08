import fs from 'node:fs';
import path from 'node:path';

export function checkFileSanity(filePath, { maxMb=200 } = {}){
  const st = fs.statSync(filePath);
  const sizeMb = st.size / (1024*1024);
  const ext = path.extname(filePath).toLowerCase();
  const okExt = ['.mp4', '.mov', '.m4v', '.wav', '.mp3'];
  const issues=[];
  if(sizeMb > maxMb) issues.push({ level:'fail', code:'file_too_large', detail:'sizeMb=' + sizeMb.toFixed(1) + ' > ' + maxMb });
  if(!okExt.includes(ext)) issues.push({ level:'warn', code:'unexpected_ext', detail:'ext=' + ext });
  return { ok: !issues.some(i=>i.level==='fail'), sizeMb, ext, issues };
}

export function checkSrtSanity(srtPath, { maxCharsPerLine=42 } = {}){
  const txt = fs.readFileSync(srtPath, 'utf8');
  const lines = txt.split(/\r?\n/);
  const issues=[];
  let lastTs = null;
  for(const line of lines){
    if(line.includes('-->')){
      const parts=line.split('-->').map(s=>s.trim());
      const start=parts[0];
      if(lastTs && start < lastTs) issues.push({ level:'fail', code:'non_monotonic_timecodes', detail:start + ' < ' + lastTs });
      lastTs = start;
    }
    if(line && !/^d+$/.test(line) && !line.includes('-->')){
      if(line.length > maxCharsPerLine) issues.push({ level:'warn', code:'caption_line_long', detail:'len=' + line.length });
    }
  }
  return { ok: !issues.some(i=>i.level==='fail'), issues };
}

export function qcRun({ filePath, srtPath } = {}){
  const out = { ts: new Date().toISOString(), filePath, srtPath, results: [] };
  if(filePath) out.results.push({ kind:'file_sanity', ...checkFileSanity(filePath) });
  if(srtPath) out.results.push({ kind:'srt_sanity', ...checkSrtSanity(srtPath) });
  out.ok = out.results.every(r => r.ok !== false);
  return out;
}
