"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type CounterProps = {
  value: number;
  suffix?: string;
  label: string;
  align?: "center" | "left";
};

export function Counter({ value, suffix = "", label, align = "center" }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const totalFrames = 48;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (frame >= totalFrames) window.clearInterval(timer);
    }, 1000 / 60);

    return () => window.clearInterval(timer);
  }, [inView, value]);

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
