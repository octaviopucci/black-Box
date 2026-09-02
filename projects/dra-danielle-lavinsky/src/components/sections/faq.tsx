"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line/60 bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Dúvidas"
            title="Perguntas frequentes"
            align="center"
          />
        </Reveal>

        <div className="mt-14 divide-y divide-line/60">
          {site.faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06}>
              <div className="py-5">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-display text-xl font-medium text-ink md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "mt-1 shrink-0 text-2xl text-accent transition-transform duration-500",
                      open === i && "rotate-45",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open === i
                      ? "mt-4 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-base leading-relaxed text-mute">
                      {item.a}
                    </p>
                    <p className="mt-2 text-xs text-mute/70">{item.source}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
