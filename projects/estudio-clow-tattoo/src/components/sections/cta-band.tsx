"use client";

import { Reveal } from "@/components/motion/reveal";
import { scrollToHash } from "@/lib/whatsapp";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] tracking-tight text-ink">
            Pronto para transformar
            <span className="block italic font-light">sua ideia em arte?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-mute">
            Entre em contato e vamos criar algo único para você.
          </p>
          <button
            type="button"
            onClick={() => scrollToHash("#orcamento")}
            className="mt-10 bg-ink px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-paper transition-transform hover:scale-[1.02]"
          >
            Fazer orçamento agora
          </button>
        </Reveal>
      </div>
    </section>
  );
}
