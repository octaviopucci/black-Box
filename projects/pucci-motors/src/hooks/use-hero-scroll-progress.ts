"use client";

import { useEffect, useRef, useState } from "react";

/** Progresso 0→1 enquanto a seção hero atravessa o viewport (sticky scrub nativo). */
export function useHeroScrollProgress() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(0);
      return;
    }

    let frame = 0;

    const update = () => {
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const next = Math.min(Math.max(-section.getBoundingClientRect().top / scrollable, 0), 1);
      setProgress(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { sectionRef, progress };
}

/** Smoothstep para transições mais limpas no scrub. */
export function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
