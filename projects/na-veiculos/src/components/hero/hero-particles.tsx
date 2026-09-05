import { HERO_PARTICLES } from "@/components/hero/hero-particles-data";

type HeroParticlesProps = {
  scrollProgress?: number;
  className?: string;
};

export function HeroParticles({ scrollProgress = 0, className = "" }: HeroParticlesProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[3] overflow-hidden ${className}`}
      style={{ opacity: 1 - 0.9 * scrollProgress }}
      aria-hidden
    >
      {HERO_PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="particle-drift absolute rounded-full bg-white will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            ["--p-dx" as string]: `${particle.dx}px`,
            ["--p-dy" as string]: `${particle.dy}px`,
            ["--p-o-min" as string]: particle.opacityMin,
            ["--p-o-max" as string]: particle.opacityMax,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            transform: `translateY(${-30 * scrollProgress}px)`,
          }}
        />
      ))}
    </div>
  );
}
