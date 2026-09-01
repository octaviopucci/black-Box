"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { useRef, useState } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
};

export function MagneticButton({
  children,
  onClick,
  variant = "solid",
  className = "",
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    setOffset({ x, y });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const base =
    variant === "solid"
      ? "bg-accent text-paper hover:bg-accent/90"
      : "border border-ink/30 text-ink hover:border-ink hover:bg-ink/5";

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`relative overflow-hidden px-10 py-4 text-sm uppercase tracking-widest ${base} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {variant === "solid" ? (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      ) : null}
    </motion.button>
  );
}
