/** Posições fixas (SSR-safe) — bolinhas estilo teto Rolls-Royce. */
function hash(seed: number) {
  const value = 43758.5453 * Math.sin(12.9898 * seed + 78.233 * seed);
  return value - Math.floor(value);
}

export type HeroParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacityMin: number;
  opacityMax: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
};

export const HERO_PARTICLES: HeroParticle[] = Array.from({ length: 48 }, (_, index) => {
  const a = hash(index + 1);
  const b = hash(index + 11);
  const c = hash(index + 21);
  const d = hash(index + 31);
  const e = hash(index + 41);
  const f = hash(index + 51);
  const g = hash(index + 61);

  return {
    id: index,
    x: a * 100,
    y: b * 100,
    size: 1.2 * c + 0.55,
    opacityMin: 0.15 * d + 0.08,
    opacityMax: 0.4 * e + 0.28,
    dx: (f - 0.5) * 120,
    dy: (g - 0.5) * 80,
    duration: 16 * c + 12,
    delay: 8 * d,
  };
});
