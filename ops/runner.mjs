import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE = '/Users/adrianissac/.openclaw/workspace';
const OR_DIR = path.join(WORKSPACE, 'onionreel');
const LOG_DIR = path.join(OR_DIR, 'logs');
const BUILD = path.join(OR_DIR, 'ops', 'build_tick.mjs');
const PING = path.join(OR_DIR, 'ops', 'ping_send.mjs');

fs.mkdirSync(LOG_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function writeStamp(name, payload) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(LOG_DIR, name), JSON.stringify(payload, null, 2) + '\n');
}

function log(line) {
  const stamp = new Date().toISOString();
  fs.appendFileSync(path.join(LOG_DIR, 'runner.log'), `[${stamp}] ${line}\n`);
}

function runNode(scriptPath, timeoutMs = 12 * 60 * 1000) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, ONIONREEL_TELEGRAM: 'off' };
    const p = spawn('/usr/local/bin/node', [scriptPath], { stdio: ['ignore', 'pipe', 'pipe'], env });
    let out = '';
    let err = '';
    p.stdout.on('data', d => (out += d.toString()));
    p.stderr.on('data', d => (err += d.toString()));

    const t = setTimeout(() => {
      try { p.kill('SIGKILL'); } catch {}
      reject(new Error(`timeout after ${timeoutMs}ms: ${path.basename(scriptPath)}\n${err || out}`));
    }, timeoutMs);

    p.on('error', e => {
      clearTimeout(t);
      reject(e);
    });

    p.on('exit', code => {
      clearTimeout(t);
      if (code === 0) resolve({ out, err });
      else reject(new Error(`exit ${code}: ${path.basename(scriptPath)}\n${err || out}`));
    });
  });
}

async function main() {
  log('runner start');

  let consecutiveFailures = 0;

  while (true) {
    const cycleStart = Date.now();
    try {
      // Always: build tick first, then ping.
      await runNode(BUILD);

      // PING_NONFATAL: Telegram ping failures should not break the loop.
      try {
        await runNode(PING);
      } catch (e) {
        writeStamp('last_error.json', { ts: Date.now(), iso: new Date().toISOString(), error: String(e?.stack || e) });
        log(`ping non-fatal error: ${e?.stack || e}`);
      }

      consecutiveFailures = 0;
      writeStamp('last_cycle.json', { ts: Date.now(), iso: new Date().toISOString(), ok: true });
      log('cycle ok (build + ping)');
    } catch (e) {
      consecutiveFailures += 1;
      writeStamp('last_cycle.json', { ts: Date.now(), iso: new Date().toISOString(), ok: false, error: String(e?.stack || e) });
      writeStamp('last_error.json', { ts: Date.now(), iso: new Date().toISOString(), error: String(e?.stack || e) });
      log(`cycle ERROR (failures=${consecutiveFailures}): ${e?.stack || e}`);
      // Keep going forever; small backoff to avoid hot-looping.
      const backoffMs = Math.min(5 * 60 * 1000, 10_000 * consecutiveFailures);
      await sleep(backoffMs);
    }

    // Target ~5m cadence from cycle start.
    const elapsed = Date.now() - cycleStart;
    const wait = Math.max(30_000, 5 * 60 * 1000 - elapsed);
    await sleep(wait);
  }
}

main().catch(e => {
  log(`FATAL: ${e?.stack || e}`);
  process.exitCode = 1;
});
