import { STARLIGHT } from "@/components/hero/starlight-data";

export function HeroStarlight() {
  return (
    <div className="starlight pointer-events-none absolute inset-0 z-[4]" aria-hidden>
      {STARLIGHT.map((star, i) => (
        <span
          key={i}
          className={`starlight-star ${star.bright ? "starlight-star--bright" : ""}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
