"use client";

import Image from "next/image";
import { site, oldschoolGalleryImages } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { ImageCarousel } from "@/components/ui/image-carousel";

export function About() {
  const { t } = useLocale();
  const siteData = useSite();
  const tattooImages = oldschoolGalleryImages();

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader index="001" label={t.about.label} title={t.about.title} />
        </Reveal>

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
          <Reveal className="order-2 space-y-6 lg:order-1">
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

          <Reveal delay={0.08} className="order-1 space-y-8 lg:order-2">
            <div className="relative aspect-[3/4] overflow-hidden ring-1 ring-white/10">
              <Image
                src={site.assets.artist}
                alt={t.about.imageAlt}
                fill
                loading="lazy"
                sizes="320px"
                className="object-cover object-top grayscale-[0.2]"
              />
            </div>

            <ImageCarousel
              images={tattooImages}
              altPrefix={t.portfolio.oldschool.workAlt}
              labels={{
                prev: t.gallery.prev,
                next: t.gallery.next,
                close: t.gallery.close,
                of: t.gallery.of,
                swipeHint: t.gallery.swipeHint,
              }}
            />

            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
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
