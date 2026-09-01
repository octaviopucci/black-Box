"use client";

import { Reveal } from "@/components/motion/reveal";
import { scrollToHash } from "@/lib/whatsapp";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-paper py-20">
      <div className="absolute inset-x-0 top-0 h-px hairline-x" />
      <div className="absolute inset-x-0 bottom-0 h-px hairline-x" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-light italic leading-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            Pronto para transformar
            <br />
            sua ideia em arte?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-mute">
            Entre em contato e vamos criar algo único para você.
          </p>
          <button
            type="button"
            onClick={() => scrollToHash("#orcamento")}
            className="mt-10 bg-accent px-12 py-4 text-sm font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-accent/90"
          >
            Fazer orçamento agora
          </button>
        </Reveal>
      </div>
    </section>
  );
}
