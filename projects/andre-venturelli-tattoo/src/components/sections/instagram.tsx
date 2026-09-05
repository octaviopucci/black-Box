"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";

export function InstagramSection() {
  const { t } = useLocale();
  const gridImages = site.instagramGrid;

  return (
    <section className="bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-ink">
            {t.instagram.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {gridImages.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => scrollToHash("#trabalhos")}
                className={`group relative overflow-hidden bg-elevated ${
                  index === 0
                    ? "row-span-2 min-h-[280px]"
                    : "aspect-square min-h-[130px]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${t.instagram.imageAlt} ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-10 text-center">
          <button
            type="button"
            onClick={() => scrollToHash("#trabalhos")}
            className="btn-pill-primary"
          >
            {t.instagram.cta}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
