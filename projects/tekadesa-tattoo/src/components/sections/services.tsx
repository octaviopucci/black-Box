"use client";

import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Services() {
  const { t } = useLocale();
  const siteData = useSite();

  return (
    <section id="servicos" className="relative bg-paper py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline-x" />

      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader
            index="003"
            label={t.servicesSection.label}
            title={t.servicesSection.title}
            description={t.servicesSection.description}
            align="center"
          />
        </Reveal>

        <div className="mt-14 divide-y divide-line/60">
          {siteData.services.map((service, index) => (
            <Reveal key={service.name} delay={index * 0.05}>
              <article className="grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-start md:gap-10">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-ink md:text-2xl">
                    {service.name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute md:text-base">
                    {service.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToHash("#orcamento")}
                  className="shrink-0 self-start font-mono text-[10px] uppercase tracking-[0.22em] text-accent transition-colors hover:text-ink"
                >
                  {t.servicesSection.cta}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
