"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-show-paper py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-show-green-dark">
          Dúvidas
        </p>
        <h2 className="display mt-2 text-center text-4xl text-show-dark">
          Perguntas frequentes
        </h2>

        <ul className="mt-10 space-y-3">
          {site.faq.map((item, i) => (
            <li key={item.q} className="overflow-hidden rounded-xl bg-white ring-1 ring-border">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-show-dark"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.q}
                <span className={cn("text-show-green-dark transition-transform", open === i && "rotate-45")}>
                  +
                </span>
              </button>
              {open === i && (
                <p className="border-t border-border px-5 py-4 text-show-muted">{item.a}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
