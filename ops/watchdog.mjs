import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const OPENCLAW_CONFIG = '/Users/adrianissac/.openclaw/openclaw.json';

const WORKSPACE = '/Users/adrianissac/.openclaw/workspace';
const OR_DIR = path.join(WORKSPACE, 'onionreel');
const LOG_DIR = path.join(OR_DIR, 'logs');
const LAST_BUILD = path.join(LOG_DIR, 'last_build.json');
const LAST_PING = path.join(LOG_DIR, 'last_ping.json');

const UID = process.getuid?.() ?? 502;
const DOMAIN = `gui/${UID}`;

function readStamp(p) {
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function ageMin(tsMs) {
  return (Date.now() - tsMs) / 60000;
}

function kick(label) {
  execSync(`launchctl kickstart -k ${DOMAIN}/${label}`, { stdio: 'ignore' });
}

function getBotToken() {
  try {
    const cfg = JSON.parse(fs.readFileSync(OPENCLAW_CONFIG, 'utf8'));
    return cfg?.channels?.telegram?.botToken || null;
  } catch {
    return null;
  }
}

// Watchdog is non-spam: it never sends Telegram messages.
// Status is communicated via the regular 10-minute status ping.
async function telegramSend(_text) { /* disabled */ }

function append(line) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(path.join(LOG_DIR, 'watchdog.log'), line + '\n');
}

async function main() {
  const build = readStamp(LAST_BUILD);
  const ping = readStamp(LAST_PING);

  const buildAge = build?.ts ? ageMin(build.ts) : Infinity;
  const pingAge = ping?.ts ? ageMin(ping.ts) : Infinity;

  const buildStale = buildAge > 7;
  const pingStale = pingAge > 7;

  if (buildStale) {
    append(`[${new Date().toISOString()}] build stale (${buildAge.toFixed(1)}m) → kickstart runner`);
    kick('com.onionreel.runner');
    await telegramSend(`OnionReel Watchdog: build looked stale (${buildAge.toFixed(1)}m) — kickstarted runner to keep the 5‑min loop alive.`);
  }

  if (pingStale) {
    append(`[${new Date().toISOString()}] ping stale (${pingAge.toFixed(1)}m) → kickstart runner`);
    kick('com.onionreel.runner');
    await telegramSend(`OnionReel Watchdog: ping looked stale (${pingAge.toFixed(1)}m) — kickstarted runner to keep updates flowing.`);
  }

  if (!buildStale && !pingStale) {
    append(`[${new Date().toISOString()}] ok (build ${buildAge.toFixed(1)}m, ping ${pingAge.toFixed(1)}m)`);
  }
}

main().catch(e => {
  append(`[${new Date().toISOString()}] watchdog error: ${e?.stack || e}`);
  process.exitCode = 1;
});
