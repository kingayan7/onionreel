# MaxContrax Template: MC1

**Status:** Approved template (locked)

## What this is
MC1 is the currently-approved MaxContrax still-ad template built on the `StillFlyerV9` recipe:
- CTA is **standalone typography** (not inside a bubble/card)
- Person on right
- Category chips
- Contract Alerts sample card
- Corner buttons

## Source
- Composition: `remotion/src/compositions/StillFlyerV9.tsx`
- Render script: `remotion/render_flyer_v9.mjs`

This folder contains a snapshot copy of the composition at time of approval.

## Default copy
CTA:
- `Get Government\nContracts Free`

Trial/pricing line (small, under CTA):
- `( 7 Day free Trial • $19.99/mo after)`

## Render (example)
From repo root:

```bash
mkdir -p autoedit/exports/still_packs/MC1
CTA='Get Government\nContracts Free' \
SUBLINE='AI matches contracts to your business' \
OFFER='( 7 Day free Trial • $19.99/mo after)' \
node remotion/render_flyer_v9.mjs contractor autoedit/exports/still_packs/MC1/contractor.png
```

## Assets used
- `remotion/public/assets/maxcontrax/logo_transparent_v2.png` (current transparent logo)
- `remotion/public/assets/maxcontrax/people/contractor_v5.png`
- `remotion/public/assets/maxcontrax/ui_contract_alerts_v1.png`

## Preview
- `preview_contractor.png`
