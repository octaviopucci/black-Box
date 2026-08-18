---
name: premium-site-brief
description: >-
  Intake brief before building a premium landing. Use at the start of a new
  demo/site request to lock brand, visual direction, assets, CTA, and which
  scroll craft to use — before writing UI code.
disable-model-invocation: true
---

# Premium Site Brief

Run this **before** coding a new premium landing. Invoke with `/premium-site-brief`.

## Collect (ask only what is missing)

1. **Brand**: name, person vs company, one-line promise
2. **Audience**: who must feel “this is for me” in 3 seconds
3. **Visual direction**: 1–2 real references (sites/photos), mood words (editorial, clinical, garage, atelier…)
4. **Assets**: logo, fonts, photos, video (yes/no; scrub video or ambient loop?)
5. **Primary CTA**: WhatsApp, booking, form, call
6. **Must-have sections** after hero (max 4–6; one job each)
7. **Scroll craft**: none / hero parallax / pinned corridor / scroll-scrubbed video (pick one primary)
8. **Constraints**: stack (default Vite+React+Tailwind like other `apps/*`), domain/path under Black Box

## Decide

- Color tokens (ink / paper / accent / mute) — avoid AI-default palettes
- Display + body font pairing
- Hero media plan (full-bleed photo vs video scrub vs corridor later)
- Which skills to load next: `anti-ai-landing` always; `scroll-cinematic` if scroll craft ≠ none

## Output to the user

A short locked brief (bullet list), then proceed to implement. Do not start a card-grid wireframe.
