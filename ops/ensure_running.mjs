import { execSync } from 'child_process';

const AGENTS = [
  '/Users/adrianissac/Library/LaunchAgents/com.onionreel.runner.plist',
  '/Users/adrianissac/Library/LaunchAgents/com.onionreel.watchdog.plist',
  '/Users/adrianissac/Library/LaunchAgents/com.onionreel.status_alert.plist'
];

function isLoaded(label) {
  try {
    const out = execSync('launchctl list', { encoding: 'utf8' });
    return out.includes(label);
  } catch {
    return false;
  }
}

function load(plist) {
  try {
    execSync(`launchctl load ${plist}`);
  } catch {
    // ignore
  }
}

// Ensure these never quietly stop.
if (!isLoaded('com.onionreel.runner')) load(AGENTS[0]);
if (!isLoaded('com.onionreel.watchdog')) load(AGENTS[1]);
if (!isLoaded('com.onionreel.status_alert')) load(AGENTS[2]);
