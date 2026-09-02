"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLButtonElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(finePointer && !reduceMotion);
  }, []);

  const onMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const base =
    variant === "solid"
      ? "bg-accent text-paper hover:bg-accent/90"
      : "border border-ink/30 text-ink hover:border-ink hover:bg-ink/5";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`relative px-10 py-4 text-sm uppercase tracking-widest transition-colors duration-200 ${base} ${className}`}
    >
      {children}
    </button>
  );
}
