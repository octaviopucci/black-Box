"use client";

import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { scrollToHash } from "@/lib/whatsapp";

export function CtaBand() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px hairline-x" />
      <div className="absolute inset-x-0 bottom-0 h-px hairline-x" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink">
            {t.ctaBand.titleLine1}
            <br />
            {t.ctaBand.titleLine2}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-mute md:text-lg">
            {t.ctaBand.subtitle}
          </p>
          <button
            type="button"
            onClick={() => scrollToHash("#orcamento")}
            className="btn-pill-primary mt-10"
          >
            {t.ctaBand.button}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
