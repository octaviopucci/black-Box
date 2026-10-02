"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { easePremium } from "@/lib/motion";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-surface/60 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeader
            eyebrow="Dúvidas"
            title="Perguntas frequentes"
            align="center"
          />
        </Reveal>

        <div className="mt-12 space-y-3">
          {site.faq.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="bezel-outer">
                  <div className="bezel-inner overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-medium text-ink">{item.q}</span>
                      <span
                        className="text-xl text-accent transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: easePremium }}
                        >
                          <p className="border-t border-line/50 px-6 pb-5 pt-4 text-sm leading-relaxed text-mute">
                            {item.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
