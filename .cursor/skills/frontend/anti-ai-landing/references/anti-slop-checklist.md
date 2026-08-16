# Anti-slop checklist

Before shipping a landing, fail the page if **2+** items are true:

## Visual slop

- [ ] Inter/Roboto/Arial/system as the main display font
- [ ] Purple / indigo gradient theme as the primary look
- [ ] Cream + terracotta + generic serif combo with no brand specificity
- [ ] Flat single-color background with no atmosphere
- [ ] Glow effects, neon edges, or multi-layer shadow stacks everywhere
- [ ] Rounded-full pill clusters / badge soup in the hero
- [ ] Emoji as design ornaments

## Layout slop

- [ ] First viewport reads as a dashboard (stats + cards + promos)
- [ ] Brand name only appears in the nav
- [ ] Hero image is inset, side-panel, or inside a card
- [ ] Floating labels / stickers / chips over hero media
- [ ] Card grid as the default section pattern
- [ ] Multiple competing headlines in one section

## Motion slop

- [ ] More than ~3 unrelated animations fighting for attention
- [ ] Scroll effects without `prefers-reduced-motion` fallback
- [ ] Autoplaying loud video with sound
- [ ] Scroll-scrubbed video without poster / loading strategy

## Content slop

- [ ] Generic phrases: "soluções inovadoras", "sua jornada começa aqui", "experience the future"
- [ ] Stat strip with invented metrics
- [ ] Icon row that could belong to any industry

## Pass criteria

- Someone who knows the brand recognizes it in 1 second without reading the nav.
- First viewport has one dominant image/video plane.
- Mobile: brand still readable, CTA reachable, no horizontal overflow from pin tracks.
