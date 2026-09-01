"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";

type SectionHeaderProps = {
  index?: string;
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  index,
  label,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const reduceMotion = useReducedMotion();
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: easeOut }}
        className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
      >
        {index ? (
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink/40">{index}</span>
        ) : null}
        <span className="h-px w-8 bg-line" aria-hidden />
        <span className="text-xs uppercase tracking-[0.4em] text-mute">{label}</span>
        <span className="h-px w-8 bg-line" aria-hidden />
      </motion.div>

      <motion.h2
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: easeOut, delay: 0.08 }}
        className="mt-5 font-display text-4xl font-light italic leading-tight text-ink sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>

      {description ? (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: easeOut, delay: 0.14 }}
          className={`mt-4 max-w-xl font-light leading-relaxed text-mute ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
