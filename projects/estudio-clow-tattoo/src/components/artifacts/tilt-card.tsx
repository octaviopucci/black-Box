"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`group relative transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
