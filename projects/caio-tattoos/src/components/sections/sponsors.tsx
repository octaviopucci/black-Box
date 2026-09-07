"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function SponsorsSection() {
  const { t } = useLocale();

  return (
    <section id="parceiros" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="004"
            label={t.sponsors.label}
            title={t.sponsors.title}
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-10 max-w-3xl">
          <p className="text-base leading-relaxed text-mute md:text-lg">
            {t.sponsors.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.sponsors.map((sponsor, index) => (
            <Reveal key={sponsor.name} delay={0.06 * index}>
              <div className="flex h-full flex-col border border-ink/10 bg-black">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-8"
                  />
                </div>
                <div className="border-t border-white/10 px-5 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    {sponsor.name}
                  </p>
                  <p className="mt-1 text-xs text-white/50">{sponsor.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {t.sponsors.workshopNote ? (
          <Reveal delay={0.2} className="mt-10 border border-ink/10 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-mute">
              {t.sponsors.workshopLabel}
            </p>
            <p className="mt-3 text-base leading-relaxed text-mute">
              {t.sponsors.workshopNote}
            </p>
            <a
              href={site.workshop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-ink underline-offset-4 hover:underline"
            >
              {site.workshop.name} →
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
