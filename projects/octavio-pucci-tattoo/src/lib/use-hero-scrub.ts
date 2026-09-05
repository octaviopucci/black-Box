"use client";

import { useEffect, useRef, useState } from "react";
import { easeInOutCubic, smootherstep } from "./hero-easing";

/** Lower = scroll progress follows more smoothly (more inertia) */
const SCRUB_LERP = 0.062;

export function useHeroScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(0);
      return;
    }

    const measureTarget = () => {
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        targetRef.current = 0;
        return;
      }

      const scrolled = -section.getBoundingClientRect().top;
      const raw = Math.min(Math.max(scrolled / scrollable, 0), 1);
      targetRef.current = easeInOutCubic(raw);
    };

    const tick = () => {
      const delta = targetRef.current - currentRef.current;

      if (Math.abs(delta) > 0.0004) {
        currentRef.current += delta * SCRUB_LERP;
        setProgress(smootherstep(currentRef.current));
      } else if (currentRef.current !== targetRef.current) {
        currentRef.current = targetRef.current;
        setProgress(smootherstep(currentRef.current));
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    measureTarget();
    frameRef.current = requestAnimationFrame(tick);
    window.addEventListener("scroll", measureTarget, { passive: true });
    window.addEventListener("resize", measureTarget, { passive: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", measureTarget);
      window.removeEventListener("resize", measureTarget);
    };
  }, []);

  return { sectionRef, progress };
}
