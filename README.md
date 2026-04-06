# ReelFoundry

A reusable, AI-first ad production system for **Meta-ready short-form video ads**.

## What this repo is
- A **knowledge base** that drives how we produce scroll-stopping ads (hook → proof → offer → CTA)
- Scripts to generate **realistic b-roll** via Sora and assemble polished ads with **ffmpeg**

## Folder layout
- `kb/` — production KB (the driver)
- `scripts/` — render + assembly helpers

## Quickstart
1) Ensure `OPENAI_API_KEY` is set in your environment.
2) See `kb/VIDEO_AD_PRODUCTION_KB.md` and follow the pipeline.

## Notes
This repo is intentionally **brand-agnostic**. Use placeholders like:
- `{BRAND_NAME}`
- `{SOURCE_SITE}` (e.g. SAM.gov)
- `{TRIAL_LINE}`
- `{PRICE_LINE}`
- `{PROOF_CHIP}`
- `{CTA_TEXT}`
