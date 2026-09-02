"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  suffix?: string;
  label: string;
  align?: "center" | "left";
};

export function Counter({ value, suffix = "", label, align = "center" }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => setDisplay(value);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const start = performance.now();
        const duration = 600;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { rootMargin: "-80px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={align === "left" ? "text-left" : "text-center"}>
      <div className="font-display text-5xl font-light text-ink sm:text-6xl">
        +{display.toLocaleString("pt-BR")}
        {suffix}
      </div>
      <div className="mt-2 text-sm uppercase tracking-widest text-mute">{label}</div>
    </div>
  );
}
