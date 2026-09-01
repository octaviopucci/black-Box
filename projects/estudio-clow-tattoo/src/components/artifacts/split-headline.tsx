"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";

type SplitHeadlineProps = {
  lines: string[];
  italicFrom?: number;
  className?: string;
};

export function SplitHeadline({
  lines,
  italicFrom = 1,
  className = "",
}: SplitHeadlineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <h1
      className={`font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.92] tracking-tight text-ink ${className}`}
    >
      {lines.map((line, lineIndex) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={`inline-block ${lineIndex >= italicFrom ? "italic" : ""}`}
            initial={reduceMotion ? false : { y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              ease: easeOut,
              delay: 0.25 + lineIndex * 0.18,
            }}
          >
            {line.split(" ").map((word, wordIndex) => (
              <motion.span
                key={`${line}-${word}`}
                className="mr-[0.22em] inline-block"
                initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.85,
                  ease: easeOut,
                  delay: 0.35 + lineIndex * 0.18 + wordIndex * 0.06,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
