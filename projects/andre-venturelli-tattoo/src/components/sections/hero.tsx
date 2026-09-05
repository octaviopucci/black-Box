"use client";

import { scrollToHash } from "@/lib/whatsapp";
import { useHeroScrub } from "@/lib/use-hero-scrub";
import { smootherstep } from "@/lib/hero-easing";
import { useLocale } from "@/i18n/locale-provider";
import { DiagonalLines, ScrollIndicator } from "@/components/artifacts/kintaro-decor";

export function Hero() {
  const { t } = useLocale();
  const { sectionRef, progress } = useHeroScrub();

  const fade = smootherstep(progress);
  const contentY = fade * 72;
  const contentOpacity = 1 - smootherstep(Math.min(progress / 0.82, 1));
  const handoffOpacity = smootherstep(Math.min(Math.max((progress - 0.35) / 0.65, 0), 1));

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative h-[240svh] min-h-[1080px]"
      style={{ ["--hero-p" as string]: progress }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[720px] items-end overflow-hidden bg-transparent">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/88 to-transparent" />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-48 bg-gradient-to-t from-paper via-paper/85 to-transparent md:max-w-[58%]"
          style={{ opacity: handoffOpacity }}
          aria-hidden
        />

        <DiagonalLines
          className="z-[4]"
          style={{ opacity: 1 - smootherstep(Math.min(progress / 0.75, 1)) }}
        />
        <ScrollIndicator
          label={t.scroll}
          className="z-[5]"
          style={{ opacity: 1 - smootherstep(Math.min(progress / 0.55, 1)) }}
        />

        <div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 will-change-transform md:pb-20 md:pt-36"
          style={{
            transform: `translate3d(0, ${contentY}px, 0)`,
            opacity: contentOpacity,
          }}
        >
          <div className="max-w-2xl">
            <p className="hero-enter-item font-mono text-[10px] uppercase tracking-[0.42em] text-white/35">
              ////
            </p>

            <h1 className="hero-enter-item mt-5 text-[clamp(2.4rem,7.5vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-tighter text-white [animation-delay:0.08s]">
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
        </div>
      </div>
    </section>
  );
}
