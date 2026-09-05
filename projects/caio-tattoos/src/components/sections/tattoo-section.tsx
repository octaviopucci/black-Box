"use client";

import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { InstagramEmbed } from "@/components/ui/instagram-embed";

export function TattooSection() {
  const { t } = useLocale();
  const block = t.portfolio.oldschool;

  return (
    <section id="tatuagem" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader align="center" index="002" label={block.label} title={block.title} />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-mute md:text-base">
            {block.intro}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 space-y-8">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-mute">
            {t.portfolio.oldschool.embedsLabel}
          </p>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {site.tattooEmbeds.map((embed, index) => (
              <InstagramEmbed
                key={embed.shortcode}
                shortcode={embed.shortcode}
                kind={embed.kind}
                title={`${block.workAlt} ${index + 1}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
