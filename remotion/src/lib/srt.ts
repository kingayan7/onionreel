export type SrtCue = { startMs: number; endMs: number; text: string };

function parseTime(t: string){
  // 00:00:01,234
  const [hh, mm, rest] = t.trim().split(':');
  const [ss, ms] = rest.split(',');
  return ((Number(hh) * 3600 + Number(mm) * 60 + Number(ss)) * 1000 + Number(ms));
}

export function parseSrt(srt: string): SrtCue[] {
  const blocks = srt.replace(/\r/g,'').trim().split(/\n\s*\n/g);
  const cues: SrtCue[] = [];
  for (const b of blocks) {
    const lines = b.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;
    const timeLine = lines.find(l => l.includes('-->'));
    if (!timeLine) continue;
    const [a,b2] = timeLine.split('-->').map(x => x.trim());
    const startMs = parseTime(a);
    const endMs = parseTime(b2);
    const textLines = lines.slice(lines.indexOf(timeLine)+1);
    const text = textLines.join('\n');
    cues.push({ startMs, endMs, text });
  }
  return cues;
}
