"use client";

import { useMemo } from "react";

function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type Particle = {
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

export function ParticleField({ className = "" }: { className?: string }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 36 }, (_, i) => {
      const r1 = seeded(i + 1);
      const r2 = seeded(i + 11);
      const r3 = seeded(i + 21);
      const r4 = seeded(i + 31);
      const r5 = seeded(i + 41);
      const r6 = seeded(i + 51);
      const r7 = seeded(i + 61);

      return {
        id: i,
        x: r1 * 100,
        y: r2 * 100,
        size: r3 * 1.4 + 0.6,
        opacityMin: r4 * 0.15 + 0.08,
        opacityMax: r5 * 0.35 + 0.25,
        dx: (r6 - 0.5) * 140,
        dy: (r7 - 0.5) * 90,
        duration: r3 * 18 + 14,
        delay: r4 * 8,
      };
    });
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[3] overflow-hidden ${className}`}
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-drift absolute rounded-full bg-white will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            ["--p-dx" as string]: `${p.dx}px`,
            ["--p-dy" as string]: `${p.dy}px`,
            ["--p-o-min" as string]: p.opacityMin,
            ["--p-o-max" as string]: p.opacityMax,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
