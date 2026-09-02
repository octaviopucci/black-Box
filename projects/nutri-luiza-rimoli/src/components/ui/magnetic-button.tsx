"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { easePremium } from "@/lib/motion";

type MagneticButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "ghost" | "accent";
  className?: string;
  href?: string;
  onClick?: () => void;
};

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MagneticButton({
  children,
  className,
  icon,
  variant = "primary",
  href,
  onClick,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const Tag = href ? "a" : "button";

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.5, ease: easePremium }}
      className="inline-flex"
    >
      <Tag
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={cn(
          "group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          variant === "primary" && "bg-ink text-paper hover:bg-deep",
          variant === "ghost" &&
            "bg-ink/[0.04] text-ink ring-1 ring-ink/10 hover:bg-ink/[0.07]",
          variant === "accent" &&
            "bg-accent text-white shadow-[0_8px_24px_rgba(90,115,72,0.35)] hover:bg-accent-soft",
          className,
        )}
      >
        {variant === "accent" ? <InstagramIcon /> : null}
        <span>{children}</span>
        {icon ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/15 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
            {icon}
          </span>
        ) : null}
      </Tag>
    </motion.div>
  );
}
