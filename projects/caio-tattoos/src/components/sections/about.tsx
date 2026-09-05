"use client";

import Image from "next/image";
import { site, lifestyleGalleryImages } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import {
  CarouselSlide,
  HorizontalScrollCarousel,
} from "@/components/ui/horizontal-scroll-carousel";

export function About() {
  const { t } = useLocale();
  const siteData = useSite();
  const lifestyleImages = lifestyleGalleryImages();

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader index="001" label={t.about.label} title={t.about.title} />
        </Reveal>

        <Reveal delay={0.06} className="order-1 mt-10 lg:mt-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-mute">
            {t.about.lifestyleLabel}
          </p>
          <HorizontalScrollCarousel
            ariaLabel={t.about.lifestyleLabel}
            prevLabel={t.gallery.prev}
            nextLabel={t.gallery.next}
            className="-mx-2 md:-mx-1"
          >
            {lifestyleImages.map((src, index) => (
              <CarouselSlide
                key={src}
                className="w-[min(82vw,340px)] sm:w-[300px] md:w-[320px]"
              >
                <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-white/10">
                  <Image
                    src={src}
                    alt={`${t.about.lifestyleAlt} ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 82vw, 320px"
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                </div>
              </CarouselSlide>
            ))}
          </HorizontalScrollCarousel>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-mute md:text-left">
            {t.gallery.swipeHint}
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_280px] lg:gap-16">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                {site.name}
              </span>
              <span className="h-px flex-1 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                {t.about.artistLabel}
              </span>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-mute md:text-base">
              {t.about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8 lg:border-t-0 lg:pt-0">
              {siteData.stats.map((stat) => (
                <Counter
                  key={stat.label}
                  value={stat.value}
                  suffix={"suffix" in stat ? stat.suffix : undefined}
                  label={stat.label}
                  align="left"
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
