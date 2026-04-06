# {BRAND_NAME} — Video Ad Production KB (AI + industry-style)

Purpose: this is the **operating system** for how we produce *real, industry-quality* ads (Meta-first) using:
- Sora (realistic b-roll clips)
- ffmpeg (editing, transitions, color, export)
- on-screen motion graphics (PNG overlays)
- voiceover + music + SFX (audio mix)

This doc is written as a **driver**: follow it every time.

---

## 0) Goal & North Star
A “Meta-ready” ad is not a pretty montage.
It is:
- **Hook-first** (0–1.5s): stops scroll.
- **Problem → promise → proof → offer → CTA**.
- **Fast pacing**: pattern interrupts every ~1–2 seconds.
- **Legible** on a phone with sound off.
- **Trust signals** ({SOURCE_SITE} + UI proof + realistic b-roll).

---

## 1) Creative brief (always lock these)
### Offer truth
- **{TRIAL_LINE}**
- **{PRICE_LINE}**
- Nationwide
- **Government contracts** + **{SOURCE_SITE}** must appear

### What we’re selling
Not “free government contracts.”
We sell: **matches/alerts + workflow to find opportunities first**.

### Brand
- Use the **correct {BRAND_NAME} icon** (black rounded square, clipped top-right, white M, orange check, orange corner accent).
- Lockup is part of design; avoid collisions.

---

## 2) Meta/Reels format rules
- Primary deliverable: **1080×1920, 20s**
- Safe zones:
  - Keep critical text away from top/bottom UI overlays.
  - Use large type (≥ 44px equivalent for primary line; bigger for hook).
- Captions/burned-in text: assume **sound off**.

---

## 3) Proven 20s structure (template)
Use this unless Craig asks otherwise.

### Timeline (20s)
**0.0–1.5s (Hook):**
- “GET GOVERNMENT CONTRACTS FIRST”
- Optional secondary: “Try it FREE (7-day trial)”

**1.5–6s (Who it’s for / pattern interrupts):**
- 3–5 quick career cuts (IT / nursing / janitorial / construction / logistics, etc.)
- Lower-third label per career (1 word)

**6–12s (What it does):**
- “{BRAND_NAME} scans {SOURCE_SITE}”
- “Finds opportunities that fit”

**12–16s (Proof):**
- Quick UI beat: “TODAY’S OPPORTUNITIES • 4 NEW”
- Show listings + match badges + “View Posting”

**16–20s (Offer + CTA end card):**
- {TRIAL_LINE}
- {PRICE_LINE}
- CTA: “{CTA_TEXT}”

---

## 4) Clip generation (Sora) playbook
### Clip specs
- Generate clips in **4s or 8s** (supported seconds). Keep them short.
- Always: 9:16 vertical, production lighting, shallow depth of field.
- Avoid any logos/brands in scene.

### Prompt formula
Use: **shot type + subject + action + setting + lighting + camera + restrictions**.
Example:
> Ultra-realistic commercial b-roll, 9:16. A janitorial cleaner in a modern office hallway wipes a glass door, confident smile. Natural lighting, shallow depth of field, handheld but stable, cinematic. No logos, no text overlays.

### Consistency controls
- Keep wardrobe/props realistic and clean.
- Prefer: office lobbies, clinics, job sites, vans.

---

## 5) On-screen copy system (no clutter)
Hard rule: **no repeating the same line multiple times**.

### Copy set (exact phrases)
- Proof: **{PROOF_CHIP}**
- Trial: **{TRIAL_LINE}**
- Price: **{PRICE_LINE}**
- CTA: **{CTA_TEXT}**

### Typography rules
- 1–2 lines max per overlay.
- High contrast (white on dark translucent box).
- Use rounded rectangles, subtle shadows.

---

## 6) Editing & pacing rules
### Pattern interrupts
- Change **scene OR text OR camera motion** every ~1–2 seconds.
- If we use 4s clips, we can still “speed-ramp” via hard cuts and overlay changes.

### Transitions
- Prefer simple **hard cuts** + occasional **quick crossfade**.
- Avoid cheesy wipes.

### UI beat
- Always include a UI/proof moment.
- If the UI is static, add subtle zoom/pan.

---

## 7) Audio: make it sound like a real ad
### VO
- Should sound **conversational, punchy**, not read.
- Use shorter sentences.
- Emphasize verbs and outcomes.

### Mix targets (rules of thumb)
- VO is the star.
- Music is a bed (duck under VO).
- Add subtle SFX: whoosh, click, pop (optional but helps).

### Processing chain (our current free toolchain)
- EQ: highpass ~80–100Hz, reduce muddiness ~250–400Hz if needed.
- Compression/compand: smooth dynamics.
- Subtle room tone / very light echo for “space” (careful).
- Limiter at end.

---

## 8) Deliverables checklist (before sending)
- [ ] 1080×1920 MP4 H.264, yuv420p, faststart
- [ ] 20.0s duration
- [ ] Hook visible in first second
- [ ] {SOURCE_SITE} mentioned
- [ ] Offer truth (trial + price) included once
- [ ] CTA present
- [ ] No clutter, no repeated text
- [ ] Safe margins respected
- [ ] Audio balanced (VO clear)

---

## 9) Free tools we can add (optional)
We already installed ffmpeg.
Next free additions that help “production” quality:
- **sox** (better audio processing, noise reduction)
- **audacity** (manual polish when needed)
- **imagemagick** (quick image transforms)

(Ask Craig before installing anything beyond ffmpeg.)

---

## 10) Iteration loop (how we get to winning)
For each new version:
1) Change **ONE primary variable** (hook wording, pacing, VO style, UI beat timing).
2) Keep the rest stable.
3) Ship vN quickly.
4) Craig feedback → update KB + next vN.
