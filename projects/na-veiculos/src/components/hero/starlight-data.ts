/** Posições fixas (SSR-safe) — campo denso estilo teto Rolls-Royce. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x6e61_7665);

export type Star = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  bright: boolean;
};

export const STARLIGHT: Star[] = Array.from({ length: 220 }, () => {
  const roll = rand();
  const bright = roll > 0.93;
  const medium = roll > 0.68;
  return {
    left: rand() * 100,
    top: rand() * 100,
    size: bright ? 3.2 : medium ? 1.6 : 0.9 + rand() * 0.6,
    opacity: bright ? 1 : medium ? 0.55 + rand() * 0.25 : 0.18 + rand() * 0.32,
    delay: rand() * 8,
    duration: 2.2 + rand() * 6.8,
    bright,
  };
});
