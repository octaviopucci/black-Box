# AURA ONE — Interactive Product Film

Cinematic scroll-driven WebGL experience for a fictional ultra-premium over-ear headphone. Procedural geometry, custom shaders, 146-part exploded view.

## Run

```bash
npm run dev:aura-one
# or
npm --prefix projects/aura-one run dev
```

Open [http://localhost:5180](http://localhost:5180).

## Controls

- **Scroll** — advance / rewind the film timeline (fixed viewport, virtual scroll)
- **Final act** — mouse parallax + drag to inspect; material selector (Titanium / Ceramic / Transparent)
- **Debug** — press `D` or add `?debug=1` to jump between acts

## Stack

Vite · React · Three.js · Lenis · procedural GLSL materials
