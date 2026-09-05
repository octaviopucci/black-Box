"use client";

import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { InstagramEmbed } from "@/components/ui/instagram-embed";
import {
  CarouselSlide,
  HorizontalScrollCarousel,
} from "@/components/ui/horizontal-scroll-carousel";

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

        <Reveal delay={0.08} className="mt-12">
          <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-mute">
            {block.embedsLabel}
          </p>
          <HorizontalScrollCarousel
            ariaLabel={block.embedsLabel}
            prevLabel={t.gallery.prev}
            nextLabel={t.gallery.next}
            className="-mx-2 md:-mx-1"
          >
            {site.tattooEmbeds.map((embed, index) => (
              <CarouselSlide
                key={embed.shortcode}
                className="w-[min(92vw,540px)]"
              >
                <InstagramEmbed
                  shortcode={embed.shortcode}
                  kind={embed.kind}
                  title={`${block.workAlt} ${index + 1}`}
                />
              </CarouselSlide>
            ))}
          </HorizontalScrollCarousel>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-mute">
            {t.gallery.swipeHint}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
