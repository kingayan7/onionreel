import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE = '/Users/adrianissac/.openclaw/workspace';
const OR_DIR = path.join(WORKSPACE, 'onionreel');
const ROADMAP_PATH = path.join(OR_DIR, 'CONTINUOUS_BUILD_ROADMAP.json');
const MEMORY_PATH = path.join(WORKSPACE, 'memory', '2026-04-06.md');
const OPENCLAW_CONFIG = path.join('/Users/adrianissac/.openclaw', 'openclaw.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function isoNowNY() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', 'T') + '-04:00';
}

function computePercent(roadmap) {
  const steps = roadmap.phases.flatMap(p => p.steps);
  const done = steps.filter(s => s.status === 'done').length;
  const doing = steps.filter(s => s.status === 'doing').length;
  const total = steps.length || 1;
  const score = done + 0.5 * doing;
  const pct = Math.round((score / total) * 100);
  return { pct, done, doing, total };
}

function latestLoopLogLine() {
  if (!fs.existsSync(MEMORY_PATH)) return null;
  const txt = fs.readFileSync(MEMORY_PATH, 'utf8');
  const lines = txt.split('\n');
  const idx = lines.findIndex(l => l.trim() === '## OnionReel Loop Log');
  if (idx === -1) return null;
  const tail = lines.slice(idx + 1).filter(l => l.startsWith('- '));
  // Prefer last "Shipped" line
  const shipped = tail.filter(l => l.includes('Shipped:'));
  return (shipped.at(-1) || tail.at(-1) || null)?.replace(/^\-\s*/, '') ?? null;
}

async function telegramSend(botToken, chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Telegram send failed: ${res.status} ${res.statusText} ${body}`);
  }
}

function appendMemory(line) {
  if (!fs.existsSync(MEMORY_PATH)) return;
  fs.appendFileSync(MEMORY_PATH, `\n- ${line}\n`);
}

function writeStamp(kind, payload) {
  const p = path.join(OR_DIR, 'logs', `last_${kind}.json`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(payload, null, 2) + '\n');
}

async function main() {
  const cfg = readJson(OPENCLAW_CONFIG);
  const botToken = cfg?.channels?.telegram?.botToken;
  if (!botToken) throw new Error('Missing channels.telegram.botToken in openclaw.json');

  const roadmap = readJson(ROADMAP_PATH);
  const { pct, done, doing, total } = computePercent(roadmap);

  const last = latestLoopLogLine() || 'No loop log entry found yet.';

  // Dynamic focus/next from roadmap: focus = current DOING step (or first TODO), next = next TODO after focus.
  const steps = roadmap.phases.flatMap(p => p.steps.map(s => ({ phaseId: p.id, phaseName: p.name, ...s })));
  const focusStep = steps.find(s => s.status === 'doing') || steps.find(s => s.status === 'todo');
  const focusLabel = focusStep ? (focusStep.text || focusStep.name || '') : '';
  const focus = focusStep
    ? `${focusStep.id} — ${focusLabel}`
    : 'No active step (roadmap empty).';

  const startIdx = focusStep ? steps.findIndex(s => s.id === focusStep.id) : -1;
  const nextStep = startIdx >= 0 ? steps.slice(startIdx + 1).find(s => s.status === 'todo') : null;
  const nextLabel = nextStep ? (nextStep.text || nextStep.name || '') : '';
  const next = nextStep
    ? `${nextStep.id} — ${nextLabel}`
    : 'No queued TODO step found.';

  // Add freshness info
  const logsDir = path.join(OR_DIR, 'logs');
  function readStampSafe(name){
    try {
      const p = path.join(logsDir, name);
      if (!fs.existsSync(p)) return null;
      return JSON.parse(fs.readFileSync(p,'utf8'));
    } catch { return null; }
  }
  function ageMin(ts){
    if (!ts) return null;
    return (Date.now() - ts) / 60000;
  }
  const lastBuild = readStampSafe('last_build.json');
  const lastCycle = readStampSafe('last_cycle.json');
  const lastErr = readStampSafe('last_error.json');

  const msg = [
    `OnionReel Build Status — ${pct}%`,
    `- Focus: ${focus}`,
    `- Last shipped: ${last}`,
    `- Freshness: build ${lastBuild?.ts ? ageMin(lastBuild.ts).toFixed(1)+'m' : 'n/a'} | cycle ${lastCycle?.ts ? ageMin(lastCycle.ts).toFixed(1)+'m' : 'n/a'}`,
    lastCycle && lastCycle.ok === false ? `- Last error: ${String(lastCycle.error||'').slice(0,160)}` : (lastErr ? `- Last error: ${String(lastErr.error||'').slice(0,160)}` : ''),
    `- Next: ${next}`,
    `- Roadmap: ${done} done, ${doing} doing, ${total} total`
  ].filter(Boolean).join('\n');

  try {
    await telegramSend(botToken, '-5020096204', msg);
  } catch (e) {
    // Never fail the loop because Telegram is flaky.
    const stamp = isoNowNY().slice(11,16);
    fs.appendFileSync(path.join(OR_DIR, 'logs', 'ping_send.err.log'), `[${stamp}] ${e?.stack || e}\n`);
  }

  appendMemory(`${isoNowNY().slice(11,16)} — Ping attempted: ${pct}%.`);
  writeStamp('ping', { ts: Date.now(), iso: isoNowNY(), pct, done, doing, total });
}

main().catch(err => {
  try {
    const stamp = isoNowNY().slice(11,16);
    fs.appendFileSync(path.join(OR_DIR, 'logs', 'ping_send.err.log'), `[${stamp}] ${err.stack || err.message}\n`);
  } catch {}
  // Always exit 0: status pings must not break the continuous loop.
  process.exitCode = 0;
});
