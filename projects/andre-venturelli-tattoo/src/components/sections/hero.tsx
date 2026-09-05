"use client";

import { scrollToHash } from "@/lib/whatsapp";
import { useHeroScrub } from "@/lib/use-hero-scrub";
import { smootherstep } from "@/lib/hero-easing";
import { useLocale } from "@/i18n/locale-provider";
import { PhotoRoll } from "@/components/artifacts/photo-roll";
import { ParticleField } from "@/components/artifacts/particle-field";
import { DiagonalLines, ScrollIndicator } from "@/components/artifacts/kintaro-decor";

export function Hero() {
  const { t } = useLocale();
  const { sectionRef, progress } = useHeroScrub();

  const fade = smootherstep(progress);
  const contentY = fade * 56;
  const contentOpacity = 1 - smootherstep(Math.min(progress / 0.78, 1));
  const readOverlay = 1 - smootherstep(Math.min(progress / 0.85, 1)) * 0.65;
  const handoffOpacity = smootherstep(Math.min(Math.max((progress - 0.28) / 0.72, 0), 1));

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative h-[200svh] min-h-[960px]"
      style={{ ["--hero-p" as string]: progress }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[720px] items-end overflow-hidden bg-black">
        <PhotoRoll fixed />

        <div
          className="absolute inset-0 z-[2] bg-gradient-to-r from-black/55 via-black/20 to-transparent"
          style={{ opacity: readOverlay }}
        />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-t from-black/45 via-transparent to-black/5"
          style={{ opacity: readOverlay }}
        />

        <ParticleField scrollProgress={progress} />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[14] h-44 bg-gradient-to-t from-paper via-paper/80 to-transparent"
          style={{ opacity: handoffOpacity }}
          aria-hidden
        />

        <DiagonalLines
          className="z-[4]"
          style={{ opacity: 1 - smootherstep(Math.min(progress / 0.7, 1)) }}
        />
        <ScrollIndicator
          label={t.scroll}
          className="z-[5]"
          style={{ opacity: 1 - smootherstep(Math.min(progress / 0.5, 1)) }}
        />

        <div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 will-change-transform md:pb-20 md:pt-36"
          style={{
            transform: `translate3d(0, ${contentY}px, 0)`,
            opacity: contentOpacity,
          }}
        >
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_min(42%,480px)]">
            <div className="max-w-2xl">
              <p className="hero-enter-item font-mono text-[11px] uppercase tracking-[0.34em] text-white/50">
                {t.hero.name}
              </p>

              <h1 className="hero-enter-item mt-4 text-[clamp(2.4rem,7.5vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-tighter text-white [animation-delay:0.08s]">
                <span className="headline-line block overflow-hidden">
                  <span className="headline-line-inner inline-block">{t.hero.titleLine1}</span>
                </span>
                <span className="headline-line block overflow-hidden">
                  <span
                    className="headline-line-inner inline-block"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {t.hero.titleLine2}
                  </span>
                </span>
              </h1>

              <p className="hero-enter-item mt-5 max-w-md text-sm leading-relaxed text-white/55 md:text-base [animation-delay:0.28s]">
                {t.hero.subtitle}
              </p>

              <div className="hero-enter-item mt-9 flex flex-wrap gap-3 [animation-delay:0.38s]">
                <button
                  type="button"
                  className="btn-pill-primary"
                  onClick={() => scrollToHash("#orcamento")}
                >
                  {t.hero.ctaQuote}
                </button>
                <button
                  type="button"
                  className="btn-pill-ghost"
                  onClick={() => scrollToHash("#trabalhos")}
                >
                  {t.hero.ctaWorks}
                </button>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
