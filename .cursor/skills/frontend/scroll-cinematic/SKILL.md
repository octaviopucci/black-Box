---
name: scroll-cinematic
description: >-
  Implement scroll-linked cinematic effects: background video scrubbed by
  scroll, pinned horizontal corridors, parallax heroes, and GSAP ScrollTrigger
  timelines. Use when the user asks for vídeo no scroll, background animado,
  scrub, pin, corridor, or Apple-like scroll storytelling.
paths:
  - "apps/**/*.{tsx,jsx,css}"
  - "portal/**/*.{tsx,jsx,css}"
---

# Scroll Cinematic

Patterns for sites where media and motion follow the scroll — without turning
the page into a janky gimmick.

## When to use

- Background / hero video that advances with scroll
- Pinned sections, horizontal galleries, timeline scrubbing
- Parallax full-bleed heroes
- User mentions: "vídeo acompanhando o scroll", "cinematic scroll", "scrub", "pin"

Pair with `anti-ai-landing` for composition and anti-slop rules. Motion must serve
brand presence, not decorate a weak layout.

## Stack preference (this repo)

| Need | Prefer |
| --- | --- |
| Scroll scrub / pin / horizontal track | GSAP + `ScrollTrigger` |
| Soft parallax / opacity on hero | Framer Motion `useScroll` + `useTransform` |
| Reduced motion | Skip scrub/pin; show static poster/frame |

Register once: `gsap.registerPlugin(ScrollTrigger)`.

## Pattern A — Scroll-scrubbed video

Goal: `video.currentTime` tracks scroll progress through a tall section.

Rules:

1. Use a short, compressed MP4 (`H.264`, muted, `playsInline`, `preload="auto"`).
2. Always provide a poster image for first paint and reduced-motion fallback.
3. Wait for `loadedmetadata` (and ideally enough buffered data) before scrubbing.
4. Drive time from ScrollTrigger `onUpdate` using `self.progress * duration`.
5. Prefer a **pinned** scrub section so the video fills the viewport while the user scrolls through the story.
6. Never rely on autoplay-with-sound. Keep `muted`.
7. On mobile, consider shorter pin distance or a static hero if decode jank is bad.

See [references/scroll-video.md](references/scroll-video.md) for a drop-in React pattern.

## Pattern B — Pinned horizontal corridor

Used in `clinica-dna` Corridor, `na-veiculos` Garage, `clinica-harmonie` Score:

1. Section pins while an inner track translates on X.
2. `end` distance = track overflow width.
3. `scrub: 0.6–1`, `anticipatePin: 1`, `invalidateOnRefresh: true`.
4. Scope with `gsap.matchMedia()` — pin on desktop; allow native horizontal swipe/stack on mobile.
5. Kill tweens on cleanup; `clearProps` transform when needed.

## Pattern C — Hero parallax (lighter)

For photo heroes (e.g. `dr-marcelo-prado`):

- `useScroll` on the section with `offset: ['start start', 'end start']`
- Transform `y` / `opacity` / brand offset subtly (`0→12%`, fade to ~0.2)
- Keep brand typography dominant over the media

## Performance & a11y checklist

- [ ] `prefers-reduced-motion: reduce` → no pin/scrub; static frame
- [ ] Passive scroll listeners when not using GSAP
- [ ] Video file weight sensible (aim well under ~5–8MB for hero loops; shorter for scrub narratives)
- [ ] Poster + dimension reserved to avoid CLS
- [ ] `ScrollTrigger.refresh()` after late-loading images/fonts when layout shifts
- [ ] No scroll-jacking that traps keyboard/screen-reader users; keep real document scroll

## Workflow

1. Confirm asset: do we have a real video/photo, or must we design for a poster-first hero?
2. Choose one primary scroll craft (video scrub **or** corridor **or** parallax) — do not stack all three in the first fold.
3. Implement with matchMedia + reduced-motion escapes.
4. Verify desktop + mobile: pin distance, overflow, CTA still reachable.

## Anti-patterns

- Multiple pinned sections back-to-back with no breathing room
- Scrubbing a huge 4K video
- Decorative Lottie everywhere instead of one strong media plane
- Cards floating over a half-visible video background
