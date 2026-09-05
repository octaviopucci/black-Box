const SPARKS = [
  { left: "8%", top: "14%", size: 2, delay: 0 },
  { left: "22%", top: "32%", size: 3, delay: 0.4 },
  { left: "38%", top: "18%", size: 2, delay: 1.1 },
  { left: "52%", top: "42%", size: 4, delay: 0.7 },
  { left: "66%", top: "22%", size: 2, delay: 1.8 },
  { left: "78%", top: "36%", size: 3, delay: 0.2 },
  { left: "90%", top: "16%", size: 2, delay: 1.4 },
  { left: "14%", top: "58%", size: 3, delay: 2.1 },
  { left: "31%", top: "72%", size: 2, delay: 0.9 },
  { left: "48%", top: "64%", size: 2, delay: 1.6 },
  { left: "61%", top: "78%", size: 4, delay: 0.5 },
  { left: "74%", top: "58%", size: 2, delay: 2.4 },
  { left: "86%", top: "70%", size: 3, delay: 1.2 },
  { left: "96%", top: "48%", size: 2, delay: 0.3 },
] as const;

export function HeroSparkles() {
  return (
    <div className="hero-sparkles pointer-events-none absolute inset-0 z-[3]" aria-hidden>
      {SPARKS.map((spark, i) => (
        <span
          key={i}
          className="hero-sparkle absolute rounded-full bg-white"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.size,
            height: spark.size,
            animationDelay: `${spark.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
