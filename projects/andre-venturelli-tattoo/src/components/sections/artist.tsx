"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Reveal } from "@/components/motion/reveal";

export function Artist() {
  const { t } = useLocale();
  const siteData = useSite();
  const studioPhotos =
    "studioPhotos" in site && site.studioPhotos.length > 0 ? site.studioPhotos : null;

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="relative">
            <div className="relative overflow-hidden ring-1 ring-white/10">
              <Image
                src={site.assets.hero}
                alt={t.artist.imageAlt}
                width={900}
                height={1100}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 480px"
                className="h-auto w-full object-cover contrast-[1.05] brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/60 to-transparent" />
            </div>
            <div className="absolute -left-4 -top-4 h-24 w-24 border-l border-t border-white/15" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-white/15" />
          </Reveal>

          <Reveal delay={0.08} className="space-y-5">
            <p className="editorial-label">{t.artist.label}</p>
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              {t.artist.title}
            </h2>
            <div className="h-px w-14 bg-white/20" />
            {t.artist.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-mute md:text-lg">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              {siteData.artistTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-widest text-mute"
                >
                  {tag}
                </span>
              ))}
            </div>

            {studioPhotos && (
              <div className="grid grid-cols-2 gap-2.5 pt-4 sm:gap-3">
                {studioPhotos.map((src, index) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden ring-1 ring-white/10"
                  >
                    <Image
                      src={src}
                      alt={`${t.location.studioPhotoAlt} ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 240px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
