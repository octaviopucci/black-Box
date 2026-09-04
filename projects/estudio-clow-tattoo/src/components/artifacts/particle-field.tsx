"use client";

import { useMemo } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
};

export function ParticleField({ className = "" }: { className?: string }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.15,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 3,
    }));
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-dot absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
