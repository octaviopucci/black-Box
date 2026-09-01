"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AmbientOrbs() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  if (reduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-32 top-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_70%)] blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-24 top-[45%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_72%)] blur-3xl"
      />
      <div className="absolute bottom-[8%] left-1/2 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_68%)] blur-3xl" />
    </div>
  );
}
