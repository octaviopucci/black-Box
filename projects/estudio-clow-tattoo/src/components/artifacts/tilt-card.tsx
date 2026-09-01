"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  glare?: boolean;
};

export function TiltCard({ children, className = "", glare = true }: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setTransform({
      rotateX: (y - 0.5) * -8,
      rotateY: (x - 0.5) * 10,
      glareX: x * 100,
      glareY: y * 100,
    });
  };

  const reset = () =>
    setTransform({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={
        reduceMotion
          ? undefined
          : {
              rotateX: transform.rotateX,
              rotateY: transform.rotateY,
              transformPerspective: 900,
            }
      }
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`group relative [transform-style:preserve-3d] ${className}`}
    >
      {children}
      {glare && !reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(255,255,255,0.14) 0%, transparent 55%)`,
          }}
        />
      ) : null}
    </motion.div>
  );
}
