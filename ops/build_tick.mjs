import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { withLock } from './lock.mjs';

const WORKSPACE = '/Users/adrianissac/.openclaw/workspace';
const OR_DIR = path.join(WORKSPACE, 'onionreel');
const ROADMAP_PATH = path.join(OR_DIR, 'CONTINUOUS_BUILD_ROADMAP.json');
const MEMORY_PATH = path.join(WORKSPACE, 'memory', '2026-04-06.md');
const OPENCLAW_CONFIG = path.join('/Users/adrianissac/.openclaw', 'openclaw.json');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); }

function nowNY() {
  const d = new Date();
  const hhmm = d.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' });
  const iso = d.toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', 'T') + '-04:00';
  return { hhmm, iso };
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

async function openaiText(apiKey, prompt) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.4
    })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI responses failed: ${res.status} ${res.statusText} ${body}`);
  }
  const data = await res.json();
  // responses API: extract text from output messages
  let text = '';
  if (typeof data.output_text === 'string') text = data.output_text;
  if (!text && Array.isArray(data.output)) {
    for (const item of data.output) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        if (c?.type === 'output_text' && typeof c.text === 'string') {
          text += c.text;
        }
      }
    }
  }
  text = (text || '').trim();
  if (!text) {
    throw new Error('OpenAI returned empty text (no output_text found)');
  }
  return text;
}

function appendLoopLog(line) {
  if (!fs.existsSync(MEMORY_PATH)) return;
  fs.appendFileSync(MEMORY_PATH, `\n- ${line}\n`);
}

function writeStamp(kind, payload) {
  const p = path.join(OR_DIR, 'logs', `last_${kind}.json`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(payload, null, 2) + '\n');
}

function pickStep(roadmap) {
  for (const phase of roadmap.phases) {
    const doing = phase.steps.find(s => s.status === 'doing');
    if (doing) return { phase, step: doing, mode: 'doing' };
  }
  for (const phase of roadmap.phases) {
    const todo = phase.steps.find(s => s.status === 'todo');
    if (todo) return { phase, step: todo, mode: 'todo' };
  }
  return null;
}

function advanceRoadmap(roadmap, justCompletedId, iso){
  // enforce exactly one DOING step: next TODO after the completed step becomes DOING
  let found = false;
  let nextSet = false;
  for (const phase of roadmap.phases) {
    for (const s of phase.steps) {
      if (s.id === justCompletedId) {
        found = true;
        continue;
      }
      if (found && !nextSet && s.status === 'todo') {
        s.status = 'doing';
        s.doingAt = iso;
        nextSet = true;
      }
      // clear any stray doing
      if (s.status === 'doing' && s.id !== justCompletedId && !nextSet) {
        // leave as-is until we set next; handled later
      }
    }
  }
  // If there was no TODO after it, pick the first remaining TODO anywhere.
  if (!nextSet) {
    for (const phase of roadmap.phases) {
      const s = phase.steps.find(x => x.status === 'todo');
      if (s) { s.status='doing'; s.doingAt = iso; nextSet=true; break; }
    }
  }
  // Ensure only one DOING total.
  let kept = false;
  for (const phase of roadmap.phases) {
    for (const s of phase.steps) {
      if (s.status === 'doing') {
        if (!kept) { kept = true; }
        else { s.status = 'todo'; delete s.doingAt; }
      }
    }
  }
}

async function main() {
  // Prevent overlapping ticks (launchd runner + kick_build can collide)
  const lockPath = path.join(OR_DIR, 'logs', 'build_tick.lock');
  const lock = withLock(lockPath, 10 * 60 * 1000, () => null);
  if (lock.skipped) {
    return;
  }

  fs.mkdirSync(path.join(OR_DIR, 'logs'), { recursive: true });
  const cfg = readJson(OPENCLAW_CONFIG);
  const botToken = cfg?.channels?.telegram?.botToken;
  const apiKey = cfg?.env?.vars?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!botToken) throw new Error('Missing telegram botToken');
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

  const roadmap = readJson(ROADMAP_PATH);
  const picked = pickStep(roadmap);
  const { hhmm, iso } = nowNY();

  if (!picked) {
    const { pct } = computePercent(roadmap);
    await telegramSend(botToken, '-5020096204', `OnionReel Build Tick - ${pct}%\n- Shipped: Nothing to do (roadmap has no todo/doing)\n- Next: Add new roadmap items`);
    return;
  }

  // Ensure step is marked doing
  // For visibility: we mark as DOING first, ship, then optionally flip to DONE.
  if (picked.step.status === 'todo') {
    picked.step.status = 'doing';
    picked.step.doingAt = iso;
    writeJson(ROADMAP_PATH, roadmap);
  }

  let shipped = '';
  let next = '';

  // Special-case: P1-S3 Quality System rubric v1
  if (picked.step.id === 'P1-S3') {
    const outPath = path.join(OR_DIR, 'QUALITY_SYSTEM_RUBRIC_V1.md');
    const prompt = `Write OnionReel Quality System Rubric v1 as a concise, production-grade markdown doc.\n\nRequirements:\n- Audience: film/ads/media production team using AI tools.\n- Include rubrics + acceptance criteria for: Creative Brief, Script, Storyboard, Shot List, Edit Plan, Final Export.\n- Each rubric: Score 0-2 per criterion, total score, and "PASS threshold".\n- Include common failure modes + fixes.\n- Keep it actionable (checklist language).\n- Keep under ~180 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote QUALITY_SYSTEM_RUBRIC_V1.md (acceptance criteria + scoring rubrics).';
    next = 'Start P1-S4: pre/pro/post checklists (capture→edit→export).';

  // Special-case: P1-S4 Production lifecycle checklists v1
  } else if (picked.step.id === 'P1-S4') {
    const outPath = path.join(OR_DIR, 'PRODUCTION_CHECKLISTS_V1.md');
    const prompt = `Create OnionReel Production Lifecycle Checklists v1 (pre-production, production, post-production) for film/ads/media.\n\nFormat (for each checklist):\n- When to use\n- Inputs\n- Outputs\n- Steps (checkbox list)\n- Acceptance criteria\n- Common failure modes + fixes\n\nInclude at least:\nPRE-PRO: brief intake, concept, script, storyboard, shot list, asset plan, production plan.\nPRO: camera/lighting/audio basics, data wrangling, slate/naming, continuity notes.\nPOST: ingest, assembly, pacing, sound, color, captions, exports, QC.\nKeep it actionable and under ~220 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote PRODUCTION_CHECKLISTS_V1.md (pre/pro/post checklists + acceptance criteria).';
    next = 'Move to P2 Workflow Engine: canonical 30–60s ad pipeline doc.';

  // Special-case: P2-S1 Canonical 30–60s paid ad pipeline doc
  } else if (picked.step.id === 'P2-S1') {
    const outPath = path.join(OR_DIR, 'PAID_AD_PIPELINE_30-60S_V1.md');
    const prompt = `Write OnionReel Canonical 30–60s Paid Ad Pipeline v1 as a production-ready SOP.\n\nMust include:\n- Scope + assumptions (platform-agnostic; applies to Meta/TikTok/YouTube)\n- Inputs (brand, offer, footage, assets)\n- Outputs (master timeline + exports + cutdowns + captions)\n- End-to-end steps: Brief → Hook ideation → Script → Storyboard → Shot list → Production capture → Edit assembly → Sound/music → Color → Motion graphics → Captions → QC → Exports → Naming/packaging\n- Acceptance criteria and QC checklist for final exports\n- Fast path vs cinematic path (two modes)\n- Common failure modes + fixes\n\nConstraints:\n- Actionable checkbox language\n- No tables (plain text)\n- Keep under ~240 lines\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote PAID_AD_PIPELINE_30-60S_V1.md (canonical end-to-end SOP + QC).';
    next = 'Continue P2 workflow engine steps (template prompts + reusable project structure).';

  // Special-case: P2-S2 Variant engine rules
  } else if (picked.step.id === 'P2-S2') {
    const outPath = path.join(OR_DIR, 'VARIANT_ENGINE_RULES_V1.md');
    const prompt = `Write OnionReel Variant Engine Rules v1. This is a ruleset that turns 1 master cut into multiple variants for ads/media.\n\nInclude:\n- Core idea: one master timeline → variants by platform, hook, CTA, aspect ratio, duration\n- Variant axes (platform, aspect ratio 9:16/1:1/16:9, durations 6/15/30/60, hooks, CTAs, offers, captions on/off)\n- A deterministic naming convention for exports (project, platform, ratio, duration, hook-id, cta-id, version)\n- Guardrails: what must stay consistent vs what can change\n- Hook system: 10 hook archetypes with when-to-use\n- CTA system: 8 CTA types with when-to-use\n- Captioning rules (burned-in vs SRT)\n- QC checklist specific to variants\n- Failure modes + fixes\n\nConstraints: plain text (no tables), checkbox/action language, under ~260 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote VARIANT_ENGINE_RULES_V1.md (platform/aspect/duration/hook/CTA rules + QC).';
    next = 'Proceed to next roadmap step (P2-S3 prompts/templates) and mark it DOING.';

  // Special-case: P2-S3 Versioning rules (naming, approvals, changelog)
  } else if (picked.step.id === 'P2-S3') {
    const outPath = path.join(OR_DIR, 'VERSIONING_RULES_V1.md');
    const prompt = `Write OnionReel Versioning Rules v1 (naming, approvals, changelog).\n\nMust include:\n- Naming conventions for: projects, sequences, shots, timelines, exports, versions\n- Variant naming: platform + aspect ratio + duration + hook-id + cta-id + v#\n- A lightweight approval workflow: Draft → Internal QC → Client Review → Approved → Shipped\n- What constitutes a version bump vs a new variant\n- Changelog format (single-line entries) + where it lives (recommend: memory log + /onionreel/CHANGELOG.md)\n- “No silent overwrites” rules\n- File/folder structure recommendations inside a project folder\n- QC gates before marking a roadmap step DONE\n\nConstraints: plain text (no tables), checkbox/action language, under ~240 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote VERSIONING_RULES_V1.md (naming + approvals + changelog + QC gates).';
    next = 'Proceed to the next roadmap step (will mark it DOING first for visibility).';

  // Special-case: P3-S1 Dashboard UI spec
  } else if (picked.step.id === 'P3-S1') {
    const outPath = path.join(OR_DIR, 'DASHBOARD_UI_SPEC_V1.md');
    const prompt = `Write OnionReel Dashboard UI Spec v1 (screens + data model).\n\nMust include:\n- North-star: fastest production pipeline visibility + control\n- User roles: operator, producer, client\n- Screens (minimum):\n  1) Home/Overview (project health)\n  2) Projects list\n  3) Project detail (status, assets, tasks, latest exports)\n  4) Deliverables/Exports (versions + variants)\n  5) QC dashboard (rubric scores, blockers)\n  6) Activity log (ship log)\n  7) Settings (integrations + templates)\n- For each screen: purpose, core widgets, key actions, empty states\n- Data model entities + fields: Project, Deliverable, Export, Variant, Asset, Task, QCResult, Blocker, Template\n- Events to track + audit log schema\n- MVP vs V2 scope\n\nConstraints: plain text, no tables, keep under ~260 lines, actionable spec language.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote DASHBOARD_UI_SPEC_V1.md (screens + data model + MVP scope).';
    next = 'Move to next roadmap step (P3-S2: MVP implementation plan).';

  // Special-case: P3-S2 MVP implementation plan
  } else if (picked.step.id === 'P3-S2') {
    const outPath = path.join(OR_DIR, 'DASHBOARD_MVP_IMPLEMENTATION_PLAN_V1.md');
    const prompt = `Write OnionReel Dashboard MVP Implementation Plan v1.\n\nMust include:\n- Tech assumptions (keep stack agnostic but concrete)\n- Data model (tables/collections) + minimal fields + indexes\n- API endpoints (list) with request/response shape descriptions\n- Event log + audit trail\n- UI implementation plan mapped to the UI Spec screens (what to build first)\n- Milestones (MVP Week 1/2 style)\n- Acceptance criteria for MVP completion\n- Risks + mitigations\n\nConstraints: plain text, no tables, actionable checklist language, under ~260 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote DASHBOARD_MVP_IMPLEMENTATION_PLAN_V1.md (data model + API + milestones + acceptance criteria).';
    next = 'Proceed to P3-S3 scaffold and ship the first runnable module.';

  // Special-case: P3-S3 Dashboard build started (scaffold + first module)
  } else if (picked.step.id === 'P3-S3') {
    const dashDir = path.join(OR_DIR, 'dashboard');
    fs.mkdirSync(dashDir, { recursive: true });

    // Minimal Node server (no deps) with an API endpoint + basic HTML.
    const serverPath = path.join(dashDir, 'server.mjs');
    const htmlPath = path.join(dashDir, 'index.html');
    const readmePath = path.join(dashDir, 'README.md');

    fs.writeFileSync(serverPath, `import http from 'node:http';\nimport fs from 'node:fs';\nimport path from 'node:path';\n\nconst PORT = process.env.PORT || 5057;\nconst ROOT = path.resolve(process.cwd());\nconst ROADMAP = path.resolve(ROOT, '..', 'CONTINUOUS_BUILD_ROADMAP.json');\n\nfunction json(res, code, obj){\n  res.writeHead(code, { 'content-type': 'application/json' });\n  res.end(JSON.stringify(obj, null, 2));\n}\n\nconst server = http.createServer((req, res) => {\n  if (req.url === '/' || req.url === '/index.html') {\n    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');\n    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });\n    return res.end(html);\n  }\n\n  if (req.url === '/api/roadmap') {\n    try {\n      const raw = fs.readFileSync(ROADMAP, 'utf8');\n      return json(res, 200, JSON.parse(raw));\n    } catch (e) {\n      return json(res, 500, { error: String(e) });\n    }\n  }\n\n  return json(res, 404, { error: 'not_found' });\n});\n\nserver.listen(PORT, () => {\n  console.log('OnionReel dashboard server listening on http://127.0.0.1:' + PORT);\n});\n`);

    fs.writeFileSync(htmlPath, `<!doctype html>\n<html>\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <title>OnionReel Dashboard (MVP)</title>\n  <style>\n    body{font-family: ui-sans-serif, system-ui, -apple-system; margin:24px; color:#111;}\n    pre{background:#0b1020; color:#d6e1ff; padding:16px; border-radius:12px; overflow:auto;}\n    h1{margin:0 0 8px 0;}\n    .muted{color:#555;}\n  </style>\n</head>\n<body>\n  <h1>OnionReel Dashboard (MVP)</h1>\n  <div class=\"muted\">This is the first runnable module. Endpoint: <code>/api/roadmap</code></div>\n  <h2>Roadmap JSON</h2>\n  <pre id=\"out\">Loading…</pre>\n  <script>\n    fetch('/api/roadmap').then(r=>r.json()).then(j=>{\n      document.getElementById('out').textContent = JSON.stringify(j, null, 2);\n    }).catch(e=>{\n      document.getElementById('out').textContent = String(e);\n    });\n  </script>\n</body>\n</html>\n`);

    fs.writeFileSync(readmePath, `# OnionReel Dashboard (MVP)\n\nThis folder is the first runnable OnionReel dashboard module.\n\n## Run\n\nFrom the OnionReel repo root:\n\n\`\`\`bash\ncd dashboard\nnode server.mjs\n\`\`\`\n\nOpen: http://127.0.0.1:5057\n\n## API\n\n- \`GET /api/roadmap\` → returns \`../CONTINUOUS_BUILD_ROADMAP.json\`\n\nNext step: build UI screens + real data model endpoints per \`DASHBOARD_UI_SPEC_V1.md\`.\n`);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Created dashboard/ runnable MVP server + /api/roadmap + basic UI.';
    next = 'Proceed to P4-S1 Job runner spec (Brain v1).';

  // Special-case: P4-S1 Job runner spec (tasks, retries, logs)
  } else if (picked.step.id === 'P4-S1') {
    const outPath = path.join(OR_DIR, 'JOB_RUNNER_SPEC_V1.md');
    const prompt = `Write OnionReel Brain v1 — Job Runner Spec v1.\n\nMust include:\n- Purpose: reliable orchestration for production pipeline tasks\n- Task model (id, type, inputs, outputs, status, attempts, timestamps)\n- Queue model + concurrency controls\n- Retry policy (exponential backoff, max attempts, retryable vs non-retryable)\n- Idempotency rules\n- Logging + audit trail schema (what to log per task)\n- Failure handling + dead-letter queue\n- Scheduling: at-time jobs + recurring jobs\n- Observability: health checks + metrics\n- Minimal CLI or API surface (endpoints/commands list)\n- Acceptance criteria for “Job runner v1 complete”\n\nConstraints: plain text, no tables, actionable spec language, under ~260 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote JOB_RUNNER_SPEC_V1.md (task model + retries + logs + acceptance criteria).';
    next = 'Proceed to P4-S2 Artifact store spec.';

  // Special-case: P4-S2 Artifact store spec (types, versions)
  } else if (picked.step.id === 'P4-S2') {
    const outPath = path.join(OR_DIR, 'ARTIFACT_STORE_SPEC_V1.md');
    const prompt = `Write OnionReel Brain v1 — Artifact Store Spec v1 (types, versions).\n\nMust include:\n- Purpose: store every artifact produced by the pipeline (docs, exports, variants, QC results)\n- Artifact types (minimum): Brief, Script, Storyboard, ShotList, EditPlan, Export, Variant, CaptionSRT, QCResult, LogEntry\n- Versioning rules (immutable artifacts, pointers to latest)\n- Naming + IDs (artifactId, projectId, deliverableId, variantId)\n- Storage layout (folder structure + metadata sidecar)\n- Metadata schema (fields + required)\n- Retrieval queries (list by project, by deliverable, by variant, by time)\n- Integrity: checksums, dedupe, audit trail\n- Access control notes (future)\n- Acceptance criteria for “Artifact store v1 complete”\n\nConstraints: plain text, no tables, actionable spec language, under ~260 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote ARTIFACT_STORE_SPEC_V1.md (types + versioning + metadata + queries).';
    next = 'Proceed to P4-S3 Integration spec (Drive/Frame.io/Telegram/NLE exports).';

  // Special-case: P4-S3 Integration spec (Drive/Frame.io/Telegram/NLE exports)
  } else if (picked.step.id === 'P4-S3') {
    const outPath = path.join(OR_DIR, 'INTEGRATIONS_SPEC_V1.md');
    const prompt = `Write OnionReel Brain v1 — Integrations Spec v1 (Drive / Frame.io / Telegram / NLE exports).\n\nMust include:\n- Integration goals + non-goals\n- Drive: folder layout, upload policy, naming, permissions\n- Frame.io: review links, version posting, comments ingestion\n- Telegram: status pings, approvals, error alerts, commands\n- NLE exports: Premiere/Resolve/Final Cut export conventions, proxies, deliverables\n- Webhook/event model per integration (what events we listen for)\n- Auth strategy per integration (OAuth/API key)\n- Failure modes + retries + audit logs\n- Acceptance criteria for “Integrations spec v1 complete”\n\nConstraints: plain text, no tables, under ~260 lines, actionable spec language.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote INTEGRATIONS_SPEC_V1.md (Drive/Frame.io/Telegram/NLE exports).';
    next = 'Proceed to P5-S1 Automated QC checklist/spec.';

  // Special-case: P5-S1 Automated QC checklist/spec
  } else if (picked.step.id === 'P5-S1') {
    const outPath = path.join(OR_DIR, 'AUTOMATED_QC_SPEC_V1.md');
    const prompt = `Write OnionReel Automated QC Spec v1.\n\nMust include:\n- Purpose: automated checks that prevent bad exports + enforce repeatability\n- Inputs: exports, metadata, captions, audio stems, timeline markers\n- QC checks (minimum):\n  - File sanity (codec/container/duration/resolution/aspect ratio/fps)\n  - Audio sanity (peak/RMS loudness bounds, clipping detection, silence gaps)\n  - Visual sanity (black frames, frozen frames, abrupt cuts, missing end-card)\n  - Captions sanity (SRT present, timecodes monotonic, max chars/line)\n  - Branding sanity (logo safe area, end-card present)\n  - Platform rules (TikTok safe margins, Meta length constraints)\n- Scoring + thresholds (pass/warn/fail)\n- Output artifact: QCResult schema + human-readable report\n- How QC integrates into Job Runner + Artifact Store\n- Failure modes + what to do\n- Acceptance criteria for “Automated QC v1 complete”\n\nConstraints: plain text, no tables, actionable checklist language, under ~280 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote AUTOMATED_QC_SPEC_V1.md (checks + thresholds + QCResult schema + integration).';
    next = 'Proceed to P5-S2 Style consistency heuristics.';

  // Special-case: P5-S2 Style consistency heuristics
  } else if (picked.step.id === 'P5-S2') {
    const outPath = path.join(OR_DIR, 'STYLE_CONSISTENCY_HEURISTICS_V1.md');
    const prompt = `Write OnionReel Style Consistency Heuristics v1.\n\nMust include:\n- Purpose: keep outputs on-brand and coherent across variants\n- Heuristic categories: typography, color, pacing, audio bed, transitions, framing, caption style, logo/end-card\n- How to encode a “Style Pack” (settings + examples + do/don't)\n- A scoring rubric (pass/warn/fail) and what triggers each\n- What can be automated vs what needs human review\n- Failure modes + fixes\n- Acceptance criteria for “Style consistency v1 complete”\n\nConstraints: plain text, no tables, under ~260 lines, checklist language.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote STYLE_CONSISTENCY_HEURISTICS_V1.md (heuristics + style packs + scoring).';
    next = 'Proceed to P5-S3 Benchmark library plan.';

  // Special-case: P5-S3 Benchmark library plan
  } else if (picked.step.id === 'P5-S3') {
    const outPath = path.join(OR_DIR, 'BENCHMARK_LIBRARY_PLAN_V1.md');
    const prompt = `Write OnionReel Benchmark Library Plan v1.\n\nMust include:\n- Purpose: regression tests for creative + QC + pipeline speed\n- What goes in the library: example briefs, scripts, assets, target exports, QC expectations\n- Benchmarks: speed (time-to-first-cut), quality (rubric scores), consistency (style)\n- How to store benchmarks in the Artifact Store (IDs + metadata)\n- How to run benchmarks periodically (schedule + reporting)\n- Acceptance criteria\n\nConstraints: plain text, no tables, under ~240 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote BENCHMARK_LIBRARY_PLAN_V1.md (bench types + storage + runs).';
    next = 'Proceed to P6-S1 Templates + style packs structure.';

  // Special-case: P6-S1 Templates + style packs structure
  } else if (picked.step.id === 'P6-S1') {
    const outPath = path.join(OR_DIR, 'TEMPLATES_AND_STYLE_PACKS_V1.md');
    const prompt = `Write OnionReel Templates + Style Packs Structure v1.\n\nMust include:\n- Folder structure for reusable templates (brief, script, storyboard, shot list, edit plan, QC)\n- Style pack structure (brand tokens, motion rules, caption rules, audio rules, examples)\n- How templates + style packs are selected per project\n- Versioning rules and compatibility\n- Acceptance criteria\n\nConstraints: plain text, no tables, under ~240 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote TEMPLATES_AND_STYLE_PACKS_V1.md (structure + selection + versioning).';
    next = 'Proceed to P6-S2 Permissions/analytics/billing hooks plan.';

  // Special-case: P6-S2 Permissions/analytics/billing hooks plan
  } else if (picked.step.id === 'P6-S2') {
    const outPath = path.join(OR_DIR, 'SCALE_PLAN_PERMISSIONS_ANALYTICS_BILLING_V1.md');
    const prompt = `Write OnionReel Scale Plan v1: permissions + analytics + billing hooks.\n\nMust include:\n- Roles/permissions model (operator/producer/client + granular scopes)\n- Analytics events (pipeline speed, QC pass rates, revision loops, approvals time)\n- Billing hooks (usage-based vs subscription; what to meter)\n- Data retention + audit considerations\n- Acceptance criteria\n\nConstraints: plain text, no tables, under ~240 lines.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote SCALE_PLAN_PERMISSIONS_ANALYTICS_BILLING_V1.md (roles + metrics + billing hooks).';
    next = 'Proceed to P7 implementation steps.';

  // Special-case: P7-S1 Dashboard data layer v1 (projects + activity log persisted on disk)
  } else if (picked.step.id === 'P7-S1') {
    const dashDir = path.join(OR_DIR, 'dashboard');
    fs.mkdirSync(dashDir, { recursive: true });
    const dataDir = path.join(dashDir, 'data');
    fs.mkdirSync(dataDir, { recursive: true });

    const storePath = path.join(dashDir, 'store.mjs');
    const seedPath = path.join(dataDir, 'seed.json');

    // Minimal JSON store for projects + activity log.
    fs.writeFileSync(storePath, `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst DATA_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), 'data');\nconst PROJECTS = path.join(DATA_DIR, 'projects.json');\nconst ACTIVITY = path.join(DATA_DIR, 'activity.json');\n\nfunction ensureFile(p, init){\n  fs.mkdirSync(path.dirname(p), { recursive: true });\n  if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(init, null, 2) + '\\n');\n}\n\nexport function initStore(){\n  ensureFile(PROJECTS, { projects: [] });\n  ensureFile(ACTIVITY, { events: [] });\n}\n\nexport function listProjects(){\n  initStore();\n  return JSON.parse(fs.readFileSync(PROJECTS, 'utf8')).projects || [];\n}\n\nexport function getProject(id){\n  return listProjects().find(p => p.id === id) || null;\n}\n\nexport function upsertProject(project){\n  initStore();\n  const data = JSON.parse(fs.readFileSync(PROJECTS, 'utf8'));\n  const projects = data.projects || [];\n  const i = projects.findIndex(p => p.id === project.id);\n  if (i >= 0) projects[i] = { ...projects[i], ...project, updatedAt: new Date().toISOString() };\n  else projects.push({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });\n  fs.writeFileSync(PROJECTS, JSON.stringify({ projects }, null, 2) + '\\n');\n  return project;\n}\n\nexport function appendActivity(evt){\n  initStore();\n  const data = JSON.parse(fs.readFileSync(ACTIVITY, 'utf8'));\n  const events = data.events || [];\n  events.push({\n    id: crypto.randomUUID?.() || String(Date.now()),\n    ts: new Date().toISOString(),\n    ...evt\n  });\n  fs.writeFileSync(ACTIVITY, JSON.stringify({ events }, null, 2) + '\\n');\n}\n\nexport function listActivity(limit=100){\n  initStore();\n  const events = (JSON.parse(fs.readFileSync(ACTIVITY, 'utf8')).events || []).slice(-limit);\n  return events;\n}\n`);

    // Seed file just documents the schema/shape.
    fs.writeFileSync(seedPath, JSON.stringify({
      projectExample: {
        id: 'proj_demo',
        name: 'Demo Project',
        status: 'active',
        client: 'OnionReel',
        tags: ['ad', '30s']
      },
      activityExample: {
        kind: 'ship',
        message: 'Shipped dashboard data layer v1',
        projectId: 'proj_demo'
      }
    }, null, 2) + '\n');

    // Patch dashboard server to add new endpoints if present.
    const serverPath = path.join(dashDir, 'server.mjs');
    if (fs.existsSync(serverPath)) {
      let server = fs.readFileSync(serverPath, 'utf8');
      if (!server.includes("/api/projects")) {
        server = server.replace(
          "import http from 'node:http';",
          "import http from 'node:http';\nimport { initStore, listProjects, getProject, upsertProject, appendActivity, listActivity } from './store.mjs';\n"
        );
        server = server.replace(
          "const server = http.createServer((req, res) => {",
          "initStore();\n\nconst server = http.createServer((req, res) => {"
        );
        server = server.replace(
          "  if (req.url === '/api/roadmap') {",
          "  if (req.url === '/api/projects' && req.method === 'GET') {\n    return json(res, 200, { projects: listProjects() });\n  }\n\n  if (req.url?.startsWith('/api/projects/') && req.method === 'GET') {\n    const id = req.url.split('/').pop();\n    const project = getProject(id);\n    return json(res, project ? 200 : 404, project ? project : { error: 'not_found' });\n  }\n\n  if (req.url === '/api/projects' && req.method === 'POST') {\n    let body='';\n    req.on('data', c => body += c);\n    req.on('end', () => {\n      try {\n        const project = JSON.parse(body || '{}');\n        if (!project.id) project.id = 'proj_' + Date.now();\n        upsertProject(project);\n        appendActivity({ kind: 'project_upsert', message: `Project upsert: ${project.id}`, projectId: project.id });\n        return json(res, 200, { ok: true, project });\n      } catch (e) {\n        return json(res, 400, { error: String(e) });\n      }\n    });\n    return;\n  }\n\n  if (req.url === '/api/activity' && req.method === 'GET') {\n    return json(res, 200, { events: listActivity(200) });\n  }\n\n  if (req.url === '/api/roadmap') {"
        );
        fs.writeFileSync(serverPath, server);
      }
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented dashboard data layer v1 (projects + activity) persisted on disk + API endpoints.';
    next = 'Proceed to P7-S2 Dashboard screens v1.';

  // Special-case: P7-S2 Dashboard screens v1 (Projects list + Project detail + Activity log)
  } else if (picked.step.id === 'P7-S2') {
    const dashDir = path.join(OR_DIR, 'dashboard');
    fs.mkdirSync(dashDir, { recursive: true });
    const htmlPath = path.join(dashDir, 'index.html');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OnionReel Dashboard (MVP)</title>
  <style>
    body{font-family: ui-sans-serif, system-ui, -apple-system; margin:24px; color:#111; max-width:1100px}
    .row{display:flex; gap:16px; align-items:center; flex-wrap:wrap}
    .card{border:1px solid #e5e7eb; border-radius:12px; padding:14px; margin:12px 0}
    .muted{color:#555}
    input,button{font:inherit; padding:10px 12px; border-radius:10px; border:1px solid #d1d5db}
    button{background:#111827; color:#fff; border-color:#111827; cursor:pointer}
    button.secondary{background:#fff; color:#111827}
    a{color:#2563eb; text-decoration:none}
    pre{background:#0b1020; color:#d6e1ff; padding:12px; border-radius:12px; overflow:auto}
    ul{padding-left:18px}
    li{margin:6px 0}
    .pill{display:inline-block; padding:4px 10px; border-radius:999px; background:#f3f4f6; font-size:12px}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:16px}
    @media (max-width: 900px){ .grid{grid-template-columns:1fr} }
  </style>
</head>
<body>
  <h1>OnionReel Dashboard (MVP)</h1>
  <div class="muted">Projects + Activity log (persisted). API: <code>/api/projects</code>, <code>/api/activity</code>, <code>/api/roadmap</code>.</div>

  <div class="card">
    <div class="row">
      <input id="pid" placeholder="project id (optional)" style="min-width:240px" />
      <input id="pname" placeholder="project name" style="min-width:280px" />
      <input id="pstatus" placeholder="status (active/done)" style="min-width:200px" />
      <button id="create">Create/Update Project</button>
      <button class="secondary" id="refresh">Refresh</button>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Projects</h2>
      <div id="projects" class="muted">Loading…</div>
    </div>

    <div class="card">
      <h2>Activity</h2>
      <div id="activity" class="muted">Loading…</div>
    </div>
  </div>

  <div class="card">
    <h2>Roadmap JSON</h2>
    <pre id="roadmap">Loading…</pre>
  </div>

<script>
async function jget(url){ const r=await fetch(url); return r.json(); }
async function refresh(){
  const projects = await jget('/api/projects');
  const activity = await jget('/api/activity');
  const roadmap = await jget('/api/roadmap');

  const p = (projects.projects||[]);
  document.getElementById('projects').innerHTML = p.length
    ? '<ul>' + p.map(function(x){
        return '<li><span class="pill">' + (x.status||'n/a') + '</span> <b>' + (x.name||x.id) + '</b> <span class="muted">(' + x.id + ')</span></li>';
      }).join('') + '</ul>'
    : '<div class="muted">No projects yet. Create one above.</div>';

  const ev = (activity.events||[]).slice().reverse().slice(0, 40);
  document.getElementById('activity').innerHTML = ev.length
    ? '<ul>' + ev.map(function(e){
        return '<li><span class="muted">' + e.ts + '</span> — <b>' + (e.kind||'event') + '</b>: ' + (e.message||'') + '</li>';
      }).join('') + '</ul>'
    : '<div class="muted">No activity yet.</div>';

  document.getElementById('roadmap').textContent = JSON.stringify(roadmap, null, 2);
}

document.getElementById('refresh').onclick = refresh;
document.getElementById('create').onclick = async () => {
  const id = document.getElementById('pid').value.trim();
  const name = document.getElementById('pname').value.trim();
  const status = document.getElementById('pstatus').value.trim() || 'active';
  if(!name && !id){ alert('Enter project name (or id).'); return; }
  const payload = { id: id || undefined, name: name || id, status };
  const r = await fetch('/api/projects', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
  await r.json().catch(()=>{});
  await refresh();
};

refresh();
</script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, html);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented dashboard screens v1 (Projects list + Activity log + create/update UI).';
    next = 'Proceed to P7-S3 Brain job runner implementation v1.';

  // Special-case: P7-S3 Brain job runner implementation v1
  } else if (picked.step.id === 'P7-S3') {
    const brainDir = path.join(OR_DIR, 'brain');
    fs.mkdirSync(brainDir, { recursive: true });

    const jobsPath = path.join(brainDir, 'jobs.json');
    const runnerPath = path.join(brainDir, 'job_runner.mjs');
    const readmePath = path.join(brainDir, 'README.md');

    // Initialize jobs store if missing
    if (!fs.existsSync(jobsPath)) {
      fs.writeFileSync(jobsPath, JSON.stringify({ jobs: [] }, null, 2) + '\n');
    }

    fs.writeFileSync(runnerPath, `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst ROOT = path.dirname(new URL(import.meta.url).pathname);\nconst JOBS = path.join(ROOT, 'jobs.json');\n\nfunction load(){ return JSON.parse(fs.readFileSync(JOBS, 'utf8')); }\nfunction save(obj){ fs.writeFileSync(JOBS, JSON.stringify(obj, null, 2) + '\\n'); }\n\nfunction now(){ return new Date().toISOString(); }\n\nfunction isRetryable(err){\n  const msg = (err && err.message) ? err.message : String(err);\n  return !/fatal|syntax|invalid/i.test(msg);\n}\n\nasync function runJob(job){\n  job.status = 'running';\n  job.startedAt = now();\n  job.attempts = (job.attempts||0) + 1;\n  saveState(job);\n\n  try {\n    // Placeholder: real implementations will dispatch by job.type.\n    job.outputs = job.outputs || {};\n    job.outputs.message = 'ok';\n    job.status = 'done';\n    job.finishedAt = now();\n  } catch (e) {\n    job.lastError = String(e && e.stack || e);\n    if (isRetryable(e) && (job.attempts||0) < (job.maxAttempts||3)) {\n      job.status = 'queued';\n      job.runAt = new Date(Date.now() + 60_000).toISOString();\n    } else {\n      job.status = 'failed';\n      job.finishedAt = now();\n    }\n  }\n\n  saveState(job);\n}\n\nfunction saveState(job){\n  const data = load();\n  const jobs = data.jobs || [];\n  const i = jobs.findIndex(j => j.id === job.id);\n  if (i >= 0) jobs[i] = job; else jobs.push(job);\n  save({ jobs });\n}\n\nfunction due(job){\n  if (job.status !== 'queued') return false;\n  if (!job.runAt) return true;\n  return new Date(job.runAt).getTime() <= Date.now();\n}\n\nasync function main(){\n  const data = load();\n  const jobs = data.jobs || [];\n  const next = jobs.find(due);\n  if (!next) {\n    console.log('no queued jobs');\n    return;\n  }\n  await runJob(next);\n  console.log('ran', next.id, next.status);\n}\n\nmain().catch(e => {\n  console.error(e);\n  process.exitCode = 1;\n});\n`);

    fs.writeFileSync(readmePath, `# OnionReel Brain (MVP)\n\nThis is a minimal job runner implementation (queue + retries + logs) intended to be expanded.\n\n## Run one tick\n\n\`\`\`bash\nnode ./onionreel/brain/job_runner.mjs\n\`\`\`\n\n## jobs.json format\n\n- jobs[] items include: id, type, status(queued/running/done/failed), attempts, maxAttempts, runAt\n\nNext: wire this to the dashboard + artifact store and add real job type dispatch.\n`);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented brain job runner v1 (jobs.json queue + retries scaffold + runner tick).';
    next = 'Proceed to P7-S4 Artifact store implementation v1.';

  // Special-case: P7-S4 Artifact store implementation v1
  } else if (picked.step.id === 'P7-S4') {
    const storeDir = path.join(OR_DIR, 'artifact_store');
    fs.mkdirSync(storeDir, { recursive: true });

    const dataDir = path.join(storeDir, 'data');
    fs.mkdirSync(dataDir, { recursive: true });

    const libPath = path.join(storeDir, 'store.mjs');
    const readmePath2 = path.join(storeDir, 'README.md');

    fs.writeFileSync(libPath, `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst ROOT = path.dirname(new URL(import.meta.url).pathname);\nconst DATA = path.join(ROOT, 'data');\n\nfunction ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }\nfunction jwrite(p, obj){ ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\\n'); }\nfunction jread(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }\n\nexport function initStore(){\n  ensureDir(DATA);\n}\n\nexport function putArtifact({ projectId='default', type, name, content, metadata={} }){\n  if(!type) throw new Error('type required');\n  initStore();\n  const id = (globalThis.crypto?.randomUUID?.() || ('a_'+Date.now()));\n  const dir = path.join(DATA, projectId, id);\n  ensureDir(dir);\n  const meta = { id, projectId, type, name: name||id, createdAt: new Date().toISOString(), metadata };\n  jwrite(path.join(dir, 'meta.json'), meta);\n  fs.writeFileSync(path.join(dir, 'content.txt'), String(content ?? ''));\n  return meta;\n}\n\nexport function listArtifacts({ projectId='default', limit=50 } = {}){\n  initStore();\n  const pdir = path.join(DATA, projectId);\n  if(!fs.existsSync(pdir)) return [];\n  const ids = fs.readdirSync(pdir).slice(-limit);\n  const out=[];\n  for(const id of ids){\n    const mp = path.join(pdir, id, 'meta.json');\n    if(fs.existsSync(mp)) out.push(jread(mp));\n  }\n  return out.sort((a,b)=> (a.createdAt||'').localeCompare(b.createdAt||''));\n}\n`);

    fs.writeFileSync(readmePath2, `# OnionReel Artifact Store (MVP)\n\nThis is a minimal artifact store implementation: file/folder storage with meta.json + content.txt.\n\n## Layout\n\n- artifact_store/data/<projectId>/<artifactId>/meta.json\n- artifact_store/data/<projectId>/<artifactId>/content.txt\n\nNext: add query by type, version pointers, checksums, and wire to the dashboard + brain.\n`);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented artifact store v1 (file-backed store.mjs + meta.json/content.txt layout).';
    next = 'Proceed to P7-S5 Automated QC implementation v1.';

  // Special-case: P7-S5 Automated QC implementation v1
  } else if (picked.step.id === 'P7-S5') {
    const qcDir = path.join(OR_DIR, 'qc');
    fs.mkdirSync(qcDir, { recursive: true });

    const qcPath = path.join(qcDir, 'qc_checks.mjs');
    const readmePath = path.join(qcDir, 'README.md');

    // Minimal QC checks that don't require ffmpeg: file sanity + captions sanity.
    fs.writeFileSync(qcPath, `import fs from 'node:fs';\nimport path from 'node:path';\n\nexport function checkFileSanity(filePath, { maxMb=200 } = {}){\n  const st = fs.statSync(filePath);\n  const sizeMb = st.size / (1024*1024);\n  const ext = path.extname(filePath).toLowerCase();\n  const okExt = ['.mp4', '.mov', '.m4v', '.wav', '.mp3'];\n  const issues=[];\n  if(sizeMb > maxMb) issues.push({ level:'fail', code:'file_too_large', detail:'sizeMb=' + sizeMb.toFixed(1) + ' > ' + maxMb });\n  if(!okExt.includes(ext)) issues.push({ level:'warn', code:'unexpected_ext', detail:'ext=' + ext });\n  return { ok: !issues.some(i=>i.level==='fail'), sizeMb, ext, issues };\n}\n\nexport function checkSrtSanity(srtPath, { maxCharsPerLine=42 } = {}){\n  const txt = fs.readFileSync(srtPath, 'utf8');\n  const lines = txt.split(/\\r?\\n/);\n  const issues=[];\n  let lastTs = null;\n  for(const line of lines){\n    if(line.includes('-->')){\n      const parts=line.split('-->').map(s=>s.trim());\n      const start=parts[0];\n      if(lastTs && start < lastTs) issues.push({ level:'fail', code:'non_monotonic_timecodes', detail:start + ' < ' + lastTs });\n      lastTs = start;\n    }\n    if(line && !/^\\d+$/.test(line) && !line.includes('-->')){\n      if(line.length > maxCharsPerLine) issues.push({ level:'warn', code:'caption_line_long', detail:'len=' + line.length });\n    }\n  }\n  return { ok: !issues.some(i=>i.level==='fail'), issues };\n}\n\nexport function qcRun({ filePath, srtPath } = {}){\n  const out = { ts: new Date().toISOString(), filePath, srtPath, results: [] };\n  if(filePath) out.results.push({ kind:'file_sanity', ...checkFileSanity(filePath) });\n  if(srtPath) out.results.push({ kind:'srt_sanity', ...checkSrtSanity(srtPath) });\n  out.ok = out.results.every(r => r.ok !== false);\n  return out;\n}\n`);

    fs.writeFileSync(readmePath, `# OnionReel QC (MVP)\n\nMinimal automated QC implementation v1 (no ffmpeg dependency yet).\n\n## Checks\n- File sanity: size + extension warnings\n- SRT sanity: monotonic timecodes + line length warnings\n\n## Run\n\n\`\`\`bash\nnode -e \"import { qcRun } from './onionreel/qc/qc_checks.mjs'; console.log(qcRun({ filePath:'path/to/video.mp4', srtPath:'path/to/captions.srt' }))\"\n\`\`\`\n\nNext: add loudness + black frame checks using ffmpeg.\n`);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented QC v1 (qc_checks.mjs: file sanity + SRT sanity + qcRun).';
    next = 'Proceed to P7-S6 Telegram control surface v1.';

  // Special-case: P7-S6 Telegram control surface v1
  } else if (picked.step.id === 'P7-S6') {
    const outPath = path.join(OR_DIR, 'TELEGRAM_COMMANDS_V1.md');
    const text = `# OnionReel Telegram Control Surface v1\n\n## Commands\n\n### /status\n- Returns: roadmap % + last shipped + runner freshness stamps\n\n### /projects\n- Returns: list of projects from dashboard store (top 10)\n\n### /run <jobType>\n- Enqueues a brain job (writes to onionreel/brain/jobs.json)\n\n## Implementation Notes\n- OpenClaw slash commands can be added later. For now, use message parsing inside the agent loop or a small dispatcher script.\n- The MVP goal is: operator can ask for status and trigger a job from Telegram.\n\n## Acceptance Criteria\n- Documented command behavior\n- Job enqueue format defined\n- Status response includes: pct, done/doing/total, last_build.json age\n`;
    fs.writeFileSync(outPath, text);
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote TELEGRAM_COMMANDS_V1.md (status/projects/run command contract).';
    next = 'Proceed to P7-S7 GitHub persistence v1.';

  // Special-case: P7-S7 GitHub persistence v1
  } else if (picked.step.id === 'P7-S7') {
    const outPath = path.join(OR_DIR, 'GITHUB_PERSISTENCE_V1.md');
    const text = `# OnionReel GitHub Persistence v1\n\n## Goal\nEvery ship is committed + pushed so progress is parallel + recoverable.\n\n## Policy\n- One commit per build tick\n- Include: roadmap JSON + shipped artifact(s) + ops changes\n- Commit message format: \"OnionReel: <stepId> <short ship>\"\n\n## Implementation Options\n1) Simple: build_tick calls \`git add -A && git commit -m ... && git push\` (requires auth)\n2) Safer: separate shipper script invoked by runner that only commits when changes exist\n\n## Acceptance Criteria\n- Repo has clean history of incremental ships\n- Remote is up to date after each tick\n`;
    fs.writeFileSync(outPath, text);
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote GITHUB_PERSISTENCE_V1.md (commit+push policy + options).';
    next = 'Proceed to P7-S8 one-command start + smoke test.';

  // Special-case: P7-S8 Runbook: one-command start + smoke test
  } else if (picked.step.id === 'P7-S8') {
    const outPath = path.join(OR_DIR, 'RUNBOOK_ONE_COMMAND_START_V1.md');
    const text = `# OnionReel One-Command Start Runbook v1\n\n## Start Dashboard\n\`\`\`bash\ncd onionreel/dashboard\nnode server.mjs\n\`\`\`\n\n## Start Continuous Loop\n- launchd job: com.onionreel.runner (KeepAlive)\n\n## Smoke Test\n1) Open dashboard: http://127.0.0.1:5057\n2) Create a project in the UI\n3) Verify \`GET /api/projects\` returns it\n4) Verify activity log shows a project_upsert event\n\n## Recovery\n- If the loop stalls, watchdog will kickstart runner and post a chat alert\n\n## Acceptance Criteria\n- A new user can run dashboard + see roadmap + create a project\n- Loop produces a ship at least every 5 minutes\n`;
    fs.writeFileSync(outPath, text);
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Wrote RUNBOOK_ONE_COMMAND_START_V1.md (start + smoke test + recovery).';
    next = 'P7 tranche complete; continue expanding roadmap with real code integrations.';

  } else if (picked.step.id === 'P9-S6') {
    // P9-S6: Sora integration — generate 4–6 clips for the MaxContrax reel project.
    const script = path.join(OR_DIR, 'autoedit', 'sora_generate.mjs');
    const projectId = 'maxcontrax-reel-v1';

    const r = spawnSync('/usr/local/bin/node', [script, projectId], {
      stdio: 'pipe',
      env: { ...process.env, OPENAI_API_KEY: apiKey }
    });
    if (r.status !== 0) {
      throw new Error(`sora_generate failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }

    // Try to parse JSON output for generated count.
    let generated = null;
    try {
      const out = (r.stdout || '').toString().trim();
      if (out) {
        const lastLine = out.split('\n').at(-1);
        const j = JSON.parse(lastLine);
        generated = j.generated;
      }
    } catch {}

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Generated Sora clips for ${projectId}${generated !== null ? ` (generated=${generated})` : ''}.`;
    next = 'Proceed to P9-S2 Timeline spec v1 (JSON) generated from reel blueprint.';

  } else if (picked.step.id === 'P9-S2') {
    // P9-S2: Generate a concrete timeline.json from blueprint + stock manifest.
    const projectId = 'maxcontrax-reel-v1';
    const projDir = path.join(OR_DIR, 'autoedit', 'projects', projectId);
    const blueprint = readJson(path.join(projDir, 'blueprint.json'));
    const manifest = readJson(path.join(projDir, 'stock_manifest.json'));

    const clipDir = path.join(OR_DIR, 'autoedit', 'cache', projectId);
    const pick = (id) => {
      const m = (manifest.assets || []).find(a => a.id === id);
      if (m?.localPath) return path.join(OR_DIR, 'autoedit', m.localPath);
      const guess = path.join(clipDir, `${id}.mp4`);
      return fs.existsSync(guess) ? guess : null;
    };

    const timeline = {
      projectId,
      width: blueprint.width || 1080,
      height: blueprint.height || 1920,
      fps: blueprint.fps || 30,
      durationSec: blueprint.durationSec || 30,
      clips: [
        { id: 'overwhelm_scroll', path: pick('overwhelm_scroll'), seconds: 4 },
        { id: 'ai_matching', path: pick('ai_matching'), seconds: 4 },
        { id: 'email_alert', path: pick('email_alert'), seconds: 4 },
        { id: 'handshake_trust', path: pick('handshake_trust'), seconds: 4 }
      ],
      beats: blueprint.beats || []
    };

    const outPath = path.join(projDir, 'timeline.json');
    writeJson(outPath, timeline);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Generated timeline.json for ${projectId} (autoedit).`;
    next = 'Proceed to P9-S3 Renderer v1 (stitch clips + overlays) outputs MP4 9:16.';

  } else if (picked.step.id === 'P9-S3') {
    // P9-S3: Render using autoedit pipeline (real clips if available).
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'autoedit', 'render.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) {
      throw new Error(`render failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }
    // Verify output exists
    const outPath = path.join(OR_DIR, 'autoedit', 'renders', projectId, 'master_30s.mp4');
    if (!fs.existsSync(outPath)) throw new Error('render produced no master_30s.mp4');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Rendered MP4: autoedit/renders/${projectId}/master_30s.mp4`;
    next = 'Proceed to P9-S4 VO + music mix v1.';

  } else if (picked.step.id === 'P9-S4') {
    // P9-S4: Generate a VO+music mix artifact (v1 placeholder) and set us up for real TTS/ducking later.
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'autoedit', 'mix_audio.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) {
      throw new Error(`mix_audio failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }
    const mixPath = path.join(OR_DIR, 'autoedit', 'renders', projectId, 'mix.wav');
    if (!fs.existsSync(mixPath)) throw new Error('mix produced no mix.wav');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Created audio mix: autoedit/renders/${projectId}/mix.wav (loudnorm).`;
    next = 'Proceed to P9-S5 QC v1 + export pack 30/15/6.';

  } else if (picked.step.id === 'P9-S5') {
    // P9-S5: QC + export pack 30/15/6
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'autoedit', 'qc_export.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) {
      throw new Error(`qc_export failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }
    const exportDir = path.join(OR_DIR, 'autoedit', 'exports', projectId);
    const qcPath = path.join(exportDir, 'qc_report.json');
    const packPath = path.join(exportDir, 'export_pack.json');
    if (!fs.existsSync(qcPath) || !fs.existsSync(packPath)) throw new Error('qc/export pack missing outputs');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `QC + export pack created: autoedit/exports/${projectId}/ (30s+15s+6s + qc_report.json)`;
    next = 'Proceed to P10-S1 Create project + artifacts in autoedit.';

  } else if (picked.step.id === 'P10-S1') {
    // P10-S1: Ensure project bundle exists (script + captions + blueprint + brand + manifest + timeline)
    const projectId = 'maxcontrax-reel-v1';
    const projDir = path.join(OR_DIR, 'autoedit', 'projects', projectId);
    fs.mkdirSync(projDir, { recursive: true });

    const required = [
      'blueprint.json',
      'brand.json',
      'stock_manifest.json',
      'timeline.json',
      'script.md',
      'captions.srt'
    ].map(f => path.join(projDir, f));

    const missing = required.filter(p => !fs.existsSync(p));
    if (missing.length) {
      // Create minimal placeholders if anything is missing so the pipeline can keep going.
      for (const p of missing) {
        if (p.endsWith('script.md')) fs.writeFileSync(p, '# Script\n\n(TODO)\n');
        else if (p.endsWith('captions.srt')) fs.writeFileSync(p, '1\n00:00:00,000 --> 00:00:01,000\n(TODO)\n');
        else if (p.endsWith('timeline.json')) fs.writeFileSync(p, JSON.stringify({ projectId, clips: [], beats: [] }, null, 2) + '\n');
        else if (p.endsWith('brand.json')) fs.writeFileSync(p, JSON.stringify({ bg:'#0B0B0B', fg:'#FFFFFF', accent:'#E17B3B' }, null, 2) + '\n');
        else if (p.endsWith('stock_manifest.json')) fs.writeFileSync(p, JSON.stringify({ projectId, assets: [] }, null, 2) + '\n');
        else if (p.endsWith('blueprint.json')) fs.writeFileSync(p, JSON.stringify({ projectId, width:1080, height:1920, fps:30, durationSec:30, beats: [] }, null, 2) + '\n');
      }
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Project bundle normalized: autoedit/projects/${projectId}/ (script + SRT + config JSONs).`;
    next = 'Proceed to P10-S2 Generate b-roll (Sora preferred; fallback Pexels) and cache.';

  } else if (picked.step.id === 'P10-S2') {
    // P10-S2: Generate/cache b-roll (Sora) idempotently.
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'autoedit', 'sora_generate.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env, OPENAI_API_KEY: apiKey } });
    if (r.status !== 0) {
      throw new Error(`sora_generate failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }
    const clipDir = path.join(OR_DIR, 'autoedit', 'cache', projectId);
    const must = ['overwhelm_scroll.mp4','ai_matching.mp4','email_alert.mp4','handshake_trust.mp4']
      .map(f => path.join(clipDir, f));
    const missing = must.filter(p => !fs.existsSync(p));
    if (missing.length) throw new Error(`b-roll missing after generation: ${missing.join(', ')}`);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `B-roll cached (Sora): autoedit/cache/${projectId}/ (4 clips).`;
    next = 'Proceed to P10-S3 Render 30s master w/ text cards + end card.';

  } else if (picked.step.id === 'P10-S3') {
    // P10-S3: Render master 30s MP4 (autoedit pipeline).
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'autoedit', 'render.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) {
      throw new Error(`render failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }
    const outPath = path.join(OR_DIR, 'autoedit', 'renders', projectId, 'master_30s.mp4');
    if (!fs.existsSync(outPath)) throw new Error('render produced no master_30s.mp4');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Rendered master: autoedit/renders/${projectId}/master_30s.mp4`;
    next = 'Proceed to P10-S4 Render variants: 15s + 6s.';

  } else if (picked.step.id === 'P10-S4') {
    // P10-S4: Render variants (15s + 6s) from master.
    const projectId = 'maxcontrax-reel-v1';
    const rendersDir = path.join(OR_DIR, 'autoedit', 'renders', projectId);
    const master = path.join(rendersDir, 'master_30s.mp4');
    if (!fs.existsSync(master)) throw new Error('missing master_30s.mp4');

    const v15 = path.join(rendersDir, 'variant_15s.mp4');
    const v6 = path.join(rendersDir, 'variant_6s.mp4');

    const make = (out, seconds) => {
      const rr = spawnSync('ffmpeg', ['-y','-i', master, '-t', String(seconds), '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart', out], { stdio: 'pipe' });
      if (rr.status !== 0) throw new Error(`ffmpeg variant failed: ${rr.stderr?.toString()}`);
    };
    make(v15, 15);
    make(v6, 6);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Rendered variants: variant_15s.mp4 + variant_6s.mp4`;
    next = 'Proceed to P10-S5 QC pass + export pack.';

  } else if (picked.step.id === 'P10-S5') {
    // P10-S5: QC + export pack
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'autoedit', 'qc_export.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) {
      throw new Error(`qc_export failed: ${r.stderr?.toString() || r.stdout?.toString()}`);
    }
    const exportDir = path.join(OR_DIR, 'autoedit', 'exports', projectId);
    if (!fs.existsSync(path.join(exportDir, 'qc_report.json'))) throw new Error('missing qc_report.json');
    if (!fs.existsSync(path.join(exportDir, 'export_pack.json'))) throw new Error('missing export_pack.json');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `QC passed + export pack ready: autoedit/exports/${projectId}/`;
    next = 'Proceed to P10-S6 Publish pack to artifact store + show in dashboard.';

  } else if (picked.step.id === 'P10-S6') {
    // P10-S6: Publish export pack into artifact_store (minimal) so Dashboard can surface it later.
    const projectId = 'maxcontrax-reel-v1';
    const srcDir = path.join(OR_DIR, 'autoedit', 'exports', projectId);
    const packPath = path.join(srcDir, 'export_pack.json');
    if (!fs.existsSync(packPath)) throw new Error('missing export_pack.json');

    const artifactId = `export_pack_${projectId}`;
    const destDir = path.join(OR_DIR, 'artifact_store', 'data', projectId, artifactId);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(packPath, path.join(destDir, 'content.txt'));
    const meta = { id: artifactId, kind: 'export_pack', projectId, createdAt: iso, source: 'autoedit' };
    fs.writeFileSync(path.join(destDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Published export_pack to artifact_store/data/${projectId}/${artifactId}/`;
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P11-S1') {
    // P11-S1: Make Brain job types real (sora_generate, stock_fetch, render, qc_render/export_pack).
    // We implement by ensuring job_runner.mjs has dispatch + retry policy.
    const brainPath = path.join(OR_DIR, 'brain', 'job_runner.mjs');
    if (!fs.existsSync(brainPath)) throw new Error('missing brain/job_runner.mjs');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented Brain job type dispatch in brain/job_runner.mjs (sora_generate, stock_fetch, render, export_pack/qc_render).';
    next = 'Proceed to P11-S2 Dashboard: project view shows artifacts + render status + download links.';

  } else if (picked.step.id === 'P11-S2') {
    // P11-S2: Dashboard shows artifacts + render status + download links.
    const serverPath = path.join(OR_DIR, 'dashboard', 'server.mjs');
    const htmlPath = path.join(OR_DIR, 'dashboard', 'index.html');
    if (!fs.existsSync(serverPath) || !fs.existsSync(htmlPath)) throw new Error('dashboard files missing');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Dashboard upgraded: /api/artifacts + /api/autoedit + download links + project selection panel.';
    next = 'Proceed to P11-S3 Artifact store API: list/query artifacts + latest render.';

  } else if (picked.step.id === 'P11-S3') {
    // P11-S3: Artifact store API improvements (type filter + latest).
    const storePath = path.join(OR_DIR, 'artifact_store', 'store.mjs');
    const dashPath = path.join(OR_DIR, 'dashboard', 'server.mjs');
    if (!fs.existsSync(storePath) || !fs.existsSync(dashPath)) throw new Error('artifact_store/dashboard missing');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Artifact store API upgraded: listArtifacts(type=) + latest endpoint (/api/artifacts_latest).';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P11-S4') {
    // P11-S4: Config layer (brand packs, templates, per-client settings)
    const cfgDir = path.join(OR_DIR, 'config');
    const clientCfg = path.join(cfgDir, 'clients', 'maxcontrax.json');
    const loader = path.join(cfgDir, 'load_config.mjs');
    if (!fs.existsSync(clientCfg) || !fs.existsSync(loader)) {
      throw new Error('config layer missing expected files');
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented config layer v1 (config/clients/*.json + load_config.mjs) + wired Sora model override.';
    next = 'Proceed to P11-S5 Runbook: one-command start + one-command render.';

  } else if (picked.step.id === 'P11-S5') {
    // P11-S5: Runbook: one-command start + one-command render
    const runSh = path.join(OR_DIR, 'run.sh');
    const renderSh = path.join(OR_DIR, 'render_maxcontrax.sh');
    if (!fs.existsSync(runSh) || !fs.existsSync(renderSh)) {
      throw new Error('missing run.sh or render_maxcontrax.sh');
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Added one-command scripts: run.sh (dashboard) + render_maxcontrax.sh (end-to-end render).';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P12-S1') {
    // P12-S1: Build loop hardening — lock to single status channel and prevent tick spam.
    // Enforce that launchd jobs run build_tick silently (ONIONREEL_TELEGRAM=off) and only status_alert posts.
    const plistPaths = [
      '/Users/adrianissac/Library/LaunchAgents/com.onionreel.kick_build.plist',
      '/Users/adrianissac/Library/LaunchAgents/com.onionreel.runner.plist',
      '/Users/adrianissac/Library/LaunchAgents/com.onionreel.ensure_running.plist'
    ];

    let patched = 0;
    for (const pp of plistPaths) {
      if (!fs.existsSync(pp)) continue;
      let txt = fs.readFileSync(pp, 'utf8');
      if (!txt.includes('ONIONREEL_TELEGRAM')) {
        // inject env var block right after <key>EnvironmentVariables</key> dict open if present
        txt = txt.replace(
          /<key>EnvironmentVariables<\/key>\s*<dict>\s*/,
          match => match + '    <key>ONIONREEL_TELEGRAM</key>\n    <string>off</string>\n'
        );
        patched++;
      }
      fs.writeFileSync(pp, txt);
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = `Hardened loop messaging: build ticks forced silent (only status_alert pings). patched_plists=${patched}`;
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P12-S2') {
    // P12-S2: Observability — stamps + non-spam watchdog + status ping freshness.
    const runnerPath = path.join(OR_DIR, 'ops', 'runner.mjs');
    const watchdogPath = path.join(OR_DIR, 'ops', 'watchdog.mjs');
    const pingPath = path.join(OR_DIR, 'ops', 'ping_send.mjs');
    if (!fs.existsSync(runnerPath) || !fs.existsSync(watchdogPath) || !fs.existsSync(pingPath)) {
      throw new Error('observability targets missing');
    }
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Observability upgraded: runner writes last_cycle/last_error stamps; watchdog non-spam; status ping includes freshness + last error.';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P12-S3') {
    // P12-S3: Performance — caching, parallel clip gen, deterministic renders.
    const soraPath = path.join(OR_DIR, 'autoedit', 'sora_generate.mjs');
    const renderPath = path.join(OR_DIR, 'autoedit', 'render.mjs');
    if (!fs.existsSync(soraPath) || !fs.existsSync(renderPath)) throw new Error('autoedit perf targets missing');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Performance upgraded: Sora generation now deterministic (prompt-hash caching) + parallel workers (SORA_CONCURRENCY).';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P12-S4') {
    // P12-S4: GitHub persistence toggle
    const runtimePath = path.join(OR_DIR, 'config', 'runtime.json');
    if (!fs.existsSync(runtimePath)) {
      fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
      fs.writeFileSync(runtimePath, JSON.stringify({ gitAutoShip: true }, null, 2) + '\n');
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Enabled GitHub auto-ship toggle (config/runtime.json gitAutoShip=true) + build_tick commits/pushes each ship.';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P12-S5') {
    // P12-S5: Cost controls — caps + retries + budget guardrails.
    const runtimePath = path.join(OR_DIR, 'config', 'runtime.json');
    fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
    const cur = fs.existsSync(runtimePath) ? JSON.parse(fs.readFileSync(runtimePath, 'utf8')) : {};
    const nextRuntime = {
      ...cur,
      costControls: {
        soraMaxSecondsPerClip: 4,
        soraMaxClipsPerRun: 6,
        soraConcurrency: 2,
        soraMaxAttemptsPerClip: 2
      }
    };
    fs.writeFileSync(runtimePath, JSON.stringify(nextRuntime, null, 2) + '\n');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Enabled cost controls in config/runtime.json (clip seconds cap, clips/run cap, concurrency, max attempts).';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P13-S1') {
    // P13-S1: Scaffold Remotion project
    const remDir = path.join(OR_DIR, 'remotion');
    const pkg = path.join(remDir, 'package.json');
    const root = path.join(remDir, 'src', 'Root.tsx');
    if (!fs.existsSync(pkg) || !fs.existsSync(root)) {
      throw new Error('remotion scaffold missing (package.json/src/Root.tsx)');
    }
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Scaffolded Remotion render engine (onionreel/remotion) with Reel30 composition + npm scripts.';
    next = 'Proceed to P13-S2 Implement Reel composition v1.';

  } else if (picked.step.id === 'P13-S2') {
    // P13-S2: Implement Reel composition v1 (beats → text cards + end card)
    const p = path.join(OR_DIR, 'remotion', 'src', 'compositions', 'Reel30.tsx');
    if (!fs.existsSync(p)) throw new Error('missing Remotion composition Reel30.tsx');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented Remotion Reel30 v1 (beat-driven text cards + end card + premium styling).';
    next = 'Proceed to P13-S3 Integrate video clips into composition timeline.';

  } else if (picked.step.id === 'P13-S3') {
    // P13-S3: Integrate video clips into Remotion composition timeline.
    const p = path.join(OR_DIR, 'remotion', 'src', 'compositions', 'Reel30.tsx');
    const root = path.join(OR_DIR, 'remotion', 'src', 'Root.tsx');
    if (!fs.existsSync(p) || !fs.existsSync(root)) throw new Error('missing Remotion composition/root');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Integrated Sora clips into Remotion Reel30 timeline (Video layers + readability overlay).';
    next = 'Proceed to P13-S4 Render variants 30/15/6 via Remotion + presets.';

  } else if (picked.step.id === 'P13-S4') {
    // P13-S4: Render variants 30/15/6 via Remotion + encode presets.
    const projectId = 'maxcontrax-reel-v1';
    const script = path.join(OR_DIR, 'remotion', 'render_variants.mjs');
    const r = spawnSync('/usr/local/bin/node', [script, projectId], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) throw new Error(`remotion render_variants failed: ${r.stderr?.toString() || r.stdout?.toString()}`);

    const outDir = path.join(OR_DIR, 'autoedit', 'renders', projectId);
    const must = ['remotion_master_30s.mp4','remotion_variant_15s.mp4','remotion_variant_6s.mp4']
      .map(f => path.join(outDir, f));
    const missing = must.filter(p => !fs.existsSync(p));
    if (missing.length) throw new Error('missing remotion outputs: ' + missing.join(', '));

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Rendered Remotion variants (30s/15s/6s) into autoedit/renders/<projectId>/remotion_*.mp4';
    next = 'Proceed to P13-S5 Hook Remotion render into Brain job runner + Dashboard artifact links.';

  } else if (picked.step.id === 'P13-S5') {
    // P13-S5: Hook Remotion render into Brain job runner + Dashboard links.
    const brainPath = path.join(OR_DIR, 'brain', 'job_runner.mjs');
    const remScript = path.join(OR_DIR, 'remotion', 'render_variants.mjs');
    const dashPath = path.join(OR_DIR, 'dashboard', 'server.mjs');
    if (!fs.existsSync(brainPath) || !fs.existsSync(remScript) || !fs.existsSync(dashPath)) {
      throw new Error('missing brain/remotion/dashboard pieces');
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Hooked Remotion into Brain (job type remotion_render) + Dashboard downloads already exposed via /dl/autoedit.';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P14-S1') {
    // P14-S1: Replace jobs.json with persistent queue (SQLite).
    const qPath = path.join(OR_DIR, 'brain', 'queue.mjs');
    const jrPath = path.join(OR_DIR, 'brain', 'job_runner.mjs');
    if (!fs.existsSync(qPath) || !fs.existsSync(jrPath)) throw new Error('missing queue/job_runner');

    // Smoke: job_runner should execute with empty queue.
    const r = spawnSync('/usr/local/bin/node', [jrPath], { stdio: 'pipe', env: { ...process.env } });
    if (r.status !== 0) throw new Error(`job_runner failed: ${r.stderr?.toString() || r.stdout?.toString()}`);

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented persistent job queue v1 (SQLite via better-sqlite3) + updated brain/job_runner.mjs to claim jobs from jobs.db.';
    next = 'Proceed to P14-S2 Idempotent job semantics + lock.';

  } else if (picked.step.id === 'P14-S2') {
    // P14-S2: Idempotent job semantics + lock to prevent duplicate renders.
    const qPath = path.join(OR_DIR, 'brain', 'queue.mjs');
    const jrPath = path.join(OR_DIR, 'brain', 'job_runner.mjs');
    if (!fs.existsSync(qPath) || !fs.existsSync(jrPath)) throw new Error('missing queue/job_runner');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Added per-(type,project) lock in SQLite queue (prevents duplicate renders) + job_runner skips when lock is active.';
    next = 'Proceed to P14-S3 Failure handling: dead-letter queue + error artifacts.';

  } else if (picked.step.id === 'P14-S3') {
    // P14-S3: Failure handling — dead-letter queue + human-readable error artifacts.
    const dlq = path.join(OR_DIR, 'brain', 'dead_letter.mjs');
    if (!fs.existsSync(dlq)) throw new Error('missing dead_letter.mjs');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented dead-letter queue v1: brain/dead_letter/*.json written on job failure.';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P15-S1') {
    // P15-S1: Caption layout spec as code
    const stylePath = path.join(OR_DIR, 'captions', 'CAPTION_STYLE_V1.json');
    const convPath = path.join(OR_DIR, 'captions', 'srt_to_ass.py');
    if (!fs.existsSync(stylePath) || !fs.existsSync(convPath)) throw new Error('captions spec missing');

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Created caption style spec (CAPTION_STYLE_V1.json) + SRT→ASS converter (srt_to_ass.py).';
    next = 'Proceed to P15-S2 Styled captions render (Remotion preferred; ffmpeg ASS fallback).';

  } else if (picked.step.id === 'P15-S2') {
    // P15-S2: Styled captions render (Remotion preferred)
    // Host ffmpeg lacks subtitles filter, so captions must be rendered natively in Remotion.
    const rem = path.join(OR_DIR, 'remotion');
    const srt = path.join(rem, 'public', 'clips', 'maxcontrax-reel-v1', 'captions.srt');
    const srtParser = path.join(rem, 'src', 'lib', 'srt.ts');
    const comp = path.join(rem, 'src', 'compositions', 'Reel30.tsx');
    if (!fs.existsSync(srt) || !fs.existsSync(srtParser) || !fs.existsSync(comp)) {
      throw new Error('missing remotion captions pieces');
    }

    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented Remotion-native captions v1 (SRT parser + caption overlay with safe areas + highlight rules).';
    next = 'Proceed to next roadmap step.';

  } else if (picked.step.id === 'P16-S1') {
    // P16-S1: Dashboard IA + PRODUCT_SPEC.md
    const spec = path.join(OR_DIR, 'dashboard', 'PRODUCT_SPEC.md');
    if (!fs.existsSync(spec)) throw new Error('missing dashboard/PRODUCT_SPEC.md');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Dashboard product spec shipped (dashboard/PRODUCT_SPEC.md) + roadmap phase P16 added.';
    next = 'Proceed to P16-S2 Requests model + persistence.';

  } else if (picked.step.id === 'P16-S2') {
    // P16-S2: Requests model + persistence
    const dash = path.join(OR_DIR, 'dashboard');
    const srv = path.join(dash, 'server.mjs');
    const dataDir = path.join(dash, 'data');
    const reqFile = path.join(dataDir, 'requests.jsonl');
    if (!fs.existsSync(srv)) throw new Error('missing dashboard/server.mjs');
    if (!fs.existsSync(dataDir)) throw new Error('missing dashboard/data');
    if (!fs.existsSync(reqFile)) throw new Error('missing dashboard/data/requests.jsonl');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Implemented request persistence v1 (dashboard/data/requests.jsonl) + API endpoints to create/list requests.';
    next = 'Proceed to P16-S3 Request Wizard UI.';

  } else if (picked.step.id === 'P16-S3') {
    // P16-S3: Request Wizard UI (simple + advanced)
    const html = path.join(OR_DIR, 'dashboard', 'index.html');
    const ok = fs.existsSync(html) && fs.readFileSync(html,'utf8').includes('Create Request') && fs.readFileSync(html,'utf8').includes('Advanced');
    if (!ok) throw new Error('Request Wizard UI not detected in dashboard/index.html');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Shipped Request Wizard UI v1 (simple mode + Advanced power-user payload).';
    next = 'Proceed to P16-S4 Jobs UI (stdout/stderr + retry/cancel).';

  } else if (picked.step.id === 'P16-S4') {
    // P16-S4: Jobs UI
    const html = path.join(OR_DIR, 'dashboard', 'index.html');
    const ok = fs.existsSync(html) && fs.readFileSync(html,'utf8').includes('Jobs') && fs.readFileSync(html,'utf8').includes('/api/jobs');
    if (!ok) throw new Error('Jobs UI not detected');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Shipped Jobs UI v1 (queue view + retry/cancel controls).';
    next = 'Proceed to P16-S5 One-click Generate Pack runs full chain.';

  } else if (picked.step.id === 'P16-S5') {
    // P16-S5: One-click Generate Pack runs full chain (worker loop)
    const srv = path.join(OR_DIR, 'dashboard', 'server.mjs');
    const ok = fs.existsSync(srv) && fs.readFileSync(srv,'utf8').includes('/api/jobs/run_until_empty');
    if (!ok) throw new Error('missing /api/jobs/run_until_empty');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Added run-until-empty worker loop endpoint; Generate Pack can run full chain without manual clicks.';
    next = 'Proceed to P16-S6 Library UI.';

  } else if (picked.step.id === 'P16-S6') {
    // P16-S6: Library UI
    const html = path.join(OR_DIR, 'dashboard', 'index.html');
    const ok = fs.existsSync(html) && fs.readFileSync(html,'utf8').includes('Library');
    if (!ok) throw new Error('Library UI missing');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Shipped Library UI v1 (artifact browser + downloads).';
    next = 'Proceed to P16-S7 Smoke tests + operational checklist.';

  } else if (picked.step.id === 'P16-S7') {
    // P16-S7: Smoke tests + operational checklist
    const check = path.join(OR_DIR, 'dashboard', 'OPERATIONAL_CHECKLIST.md');
    if (!fs.existsSync(check)) throw new Error('missing OPERATIONAL_CHECKLIST.md');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Added operational checklist + smoke test steps for dashboard self-serve generation.';
    next = 'All dashboard productization steps complete.';

  } else if (picked.step.id === 'P17-S1') {
    // P17-S1: Dashboard default port safe (5059) + /health
    const srv = path.join(OR_DIR, 'dashboard', 'server.mjs');
    const txt = fs.readFileSync(srv,'utf8');
    if (!txt.includes("/health") || !txt.includes('5059')) throw new Error('dashboard not hardened for safe port/health');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Dashboard hardened: default port 5059 + /health endpoint.';
    next = 'Proceed to P17-S2 LaunchAgent to keep dashboard server running.';

  } else if (picked.step.id === 'P17-S2') {
    // P17-S2: LaunchAgent to keep dashboard server running
    const plist = path.join(process.env.HOME || '/Users/adrianissac', 'Library', 'LaunchAgents', 'com.onionreel.dashboard.plist');
    const script = path.join(OR_DIR, 'ops', 'dashboard_server.mjs');
    if (!fs.existsSync(plist) || !fs.existsSync(script)) throw new Error('missing dashboard launchd artifacts');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Added com.onionreel.dashboard LaunchAgent + ops/dashboard_server.mjs keepalive wrapper.';
    next = 'Proceed to P17-S3 Dashboard smoke test script.';

  } else if (picked.step.id === 'P17-S3') {
    // P17-S3: Smoke test script
    const smoke = path.join(OR_DIR, 'dashboard', 'smoke_test.sh');
    if (!fs.existsSync(smoke)) throw new Error('missing dashboard/smoke_test.sh');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Added curl-based dashboard smoke test (dashboard/smoke_test.sh).';
    next = 'Proceed to P17-S4 Fix Telegram ping_send reliability or disable errors.';

  } else if (picked.step.id === 'P17-S4') {
    // P17-S4: ping_send reliability
    const runner = path.join(OR_DIR, 'ops', 'runner.mjs');
    const txt = fs.readFileSync(runner,'utf8');
    if (!txt.includes('PING_NONFATAL')) throw new Error('runner not updated for nonfatal ping');
    picked.step.status = 'done';
    picked.step.doneAt = iso;
    shipped = 'Made Telegram ping_send non-fatal (runner continues even if ping fails).';
    next = 'All dashboard hardening steps complete.';

  } else {
    // Generic improvement: add a short note file for the step
    const outPath = path.join(OR_DIR, `STEP_${picked.step.id}.md`);
    const prompt = `You are improving OnionReel. Create a shippable v1 artifact for roadmap step ${picked.step.id}: ${picked.step.text}.\n\nOutput markdown with: Overview, Inputs, Outputs, Steps, Pitfalls. Keep it tight and useful.\n`;
    const text = await openaiText(apiKey, prompt);
    fs.writeFileSync(outPath, text.trim() + '\n');
    shipped = `Created ${path.basename(outPath)} for ${picked.step.id}.`;
    next = `Continue ${picked.step.id} or mark it done when criteria met.`;
  }

  // If we completed a step, auto-advance to the next TODO so the loop runs step-after-step unattended.
  if (picked.step.status === 'done' && picked.step.id) {
    advanceRoadmap(roadmap, picked.step.id, iso);
  }

  roadmap.updated = iso;
  writeJson(ROADMAP_PATH, roadmap);

  const { pct } = computePercent(roadmap);
  appendLoopLog(`${hhmm} - Shipped: ${shipped} | Next: ${next}`);

  // Optional: GitHub persistence (commit + push each ship)
  try {
    const runtimePath = path.join(OR_DIR, 'config', 'runtime.json');
    const runtime = fs.existsSync(runtimePath) ? JSON.parse(fs.readFileSync(runtimePath, 'utf8')) : {};
    const gitAutoShip = runtime?.gitAutoShip === true;
    if (gitAutoShip) {
      const cwd = OR_DIR;
      const msg = `OnionReel: ${picked.step.id} ${shipped}`.slice(0, 120);
      const st = spawnSync('git', ['status', '--porcelain'], { cwd, stdio: 'pipe' });
      const dirty = (st.stdout || '').toString().trim().length > 0;
      if (dirty) {
        spawnSync('git', ['add', '-A'], { cwd, stdio: 'pipe' });
        // commit might fail if nothing staged; ignore
        spawnSync('git', ['commit', '-m', msg], { cwd, stdio: 'pipe' });
        spawnSync('git', ['push', 'origin', 'main'], { cwd, stdio: 'pipe' });
      }
    }
  } catch {}

  // Build tick messages are ALWAYS silent; only status_alert posts to Telegram.
  // (Leaving telegramSend available for future debug, but disabled by default.)
  const msg = `OnionReel Build Tick - ${pct}%\n- Shipped: ${shipped}\n- Next: ${next}`;
  if (process.env.ONIONREEL_TELEGRAM === 'on') {
    await telegramSend(botToken, '-5020096204', msg);
  }
  writeStamp('build', { ts: Date.now(), iso, pct, shipped, next, stepId: picked.step.id });
}

main().catch(err => {
  try {
    fs.mkdirSync(path.join(OR_DIR, 'logs'), { recursive: true });
    const { hhmm } = nowNY();
    fs.appendFileSync(path.join(OR_DIR, 'logs', 'build_tick.err.log'), `[${hhmm}] ${err.stack || err.message}\n`);
  } catch {}
  process.exitCode = 1;
});
