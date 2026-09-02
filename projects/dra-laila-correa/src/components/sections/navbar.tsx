"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/contact";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
        <nav className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full bg-elevated/75 px-4 py-2.5 shadow-[0_8px_32px_rgba(20,33,43,0.08)] ring-1 ring-ink/[0.06] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => scrollToHash("#inicio")}
            className="px-3 py-1.5 text-left"
          >
            <span className="block font-display text-lg leading-none text-ink">
              Laila Correa
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-mute">
              Estética facial
            </span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => scrollToHash(item.href)}
                  className="rounded-full px-4 py-2 text-sm text-mute transition-colors duration-500 hover:bg-ink/[0.04] hover:text-ink"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.04] md:hidden"
          >
            <span
              className={cn(
                "absolute h-px w-4 bg-ink transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                open ? "rotate-45" : "-translate-y-1",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-4 bg-ink transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                open ? "-rotate-45" : "translate-y-1",
              )}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-paper/95 backdrop-blur-3xl md:hidden"
          >
            <div className="flex min-h-[100dvh] flex-col justify-center px-8">
              {site.nav.map((item, i) => (
                <motion.button
                  key={item.href}
                  type="button"
                  initial={reduceMotion ? false : { opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.7,
                    ease: easePremium,
                  }}
                  onClick={() => {
                    setOpen(false);
                    scrollToHash(item.href);
                  }}
                  className="border-b border-line/60 py-5 text-left font-display text-4xl text-ink"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
