"use client";

import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Process() {
  const { t } = useLocale();
  const siteData = useSite();

  return (
    <section id="processo" className="relative bg-surface py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline-x" />

      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader
            index="004"
            label={t.processSection.label}
            title={t.processSection.title}
            align="center"
          />
        </Reveal>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute bottom-0 left-6 top-0 hidden w-px bg-gradient-to-b from-white/10 via-white/5 to-white/10 sm:left-1/2 sm:block"
          />

          <div className="space-y-12 sm:space-y-16">
            {siteData.process.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <Reveal key={step.step} delay={index * 0.08}>
                  <div
                    className={`relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12 ${
                      isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${isLeft ? "sm:text-right" : "sm:text-left"}`}>
                      <span className="font-mono text-xs tracking-[0.25em] text-white/30">
                        {step.step}
                      </span>
                      <h3 className="mt-2 text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 inline-block max-w-sm text-sm leading-relaxed text-mute">
                        {step.desc}
                      </p>
                    </div>

                    <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center border border-white/15 bg-black sm:flex">
                      <span className="font-mono text-[10px] text-white/50">{step.step}</span>
                    </div>

                    <div className="hidden flex-1 sm:block" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
