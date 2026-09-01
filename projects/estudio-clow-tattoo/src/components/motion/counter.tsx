"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type CounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export function Counter({ value, suffix = "", label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
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
    <div ref={ref} className="border-t border-ink/10 pt-6">
      <p className="font-display text-4xl leading-none tracking-tight text-ink md:text-5xl">
        {display.toLocaleString("pt-BR")}
        {suffix}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.28em] text-mute">{label}</p>
    </div>
  );
}
