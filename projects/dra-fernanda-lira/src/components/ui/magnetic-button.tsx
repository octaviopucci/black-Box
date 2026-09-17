"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { easePremium } from "@/lib/motion";

type MagneticButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
};

export function MagneticButton({
  children,
  className,
  icon,
  variant = "primary",
  onClick,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.5, ease: easePremium }}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        variant === "primary" &&
          "bg-ink text-paper hover:bg-ink/90",
        variant === "ghost" &&
          "bg-ink/[0.04] text-ink ring-1 ring-ink/10 hover:bg-ink/[0.07]",
        className,
      )}
      onClick={onClick}
    >
      <span>{children}</span>
      {icon ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/15 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
          {icon}
        </span>
      ) : null}
    </motion.button>
  );
}
