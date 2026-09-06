"use client";

import { scrollToHash } from "@/lib/whatsapp";
import { useHeroScrub } from "@/lib/use-hero-scrub";
import { useLocale } from "@/i18n/locale-provider";
import { PhotoRoll } from "@/components/artifacts/photo-roll";
import { VictorianCorner, VictorianDivider } from "@/components/victorian/ornament";
import { VictorianScrollIndicator } from "@/components/victorian/scroll-indicator";

export function VictorianHero() {
  const { t } = useLocale();
  const { sectionRef, progress } = useHeroScrub();

  const contentY = progress * 88;
  const contentOpacity = 1 - progress * 0.92;
  const sideOverlay = 1 - progress * 0.75;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative h-[185svh] min-h-[920px]"
      style={{ ["--hero-p" as string]: progress }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[720px] items-end overflow-hidden bg-paper">
        <VictorianCorner className="left-4 top-24 z-20 md:left-8" />
        <VictorianCorner className="right-4 top-24 z-20 rotate-90 md:right-8" />

        <PhotoRoll scrollProgress={progress} />

        <div
          className="absolute inset-0 z-[2] bg-gradient-to-t from-paper via-paper/55 to-paper/25"
          style={{ opacity: sideOverlay * 0.95 }}
        />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-r from-paper via-paper/50 to-transparent"
          style={{ opacity: sideOverlay }}
        />

        <VictorianScrollIndicator
          label={t.scroll}
          className="transition-opacity duration-300"
          style={{ opacity: 1 - progress * 1.2 }}
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
              <p className="hero-enter-item font-display text-sm italic tracking-[0.2em] text-accent">
                {t.hero.eyebrow}
              </p>

              <VictorianDivider className="hero-enter-item mt-4 max-w-xs [animation-delay:0.05s]" />

              <h1 className="hero-enter-item mt-6 font-display text-[clamp(2.6rem,7vw,4.5rem)] font-semibold leading-[1.05] text-ink [animation-delay:0.08s]">
                <span className="headline-line block overflow-hidden">
                  <span className="headline-line-inner inline-block">{t.hero.titleLine1}</span>
                </span>
                <span className="headline-line block overflow-hidden">
                  <span
                    className="headline-line-inner inline-block italic text-accent"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {t.hero.titleLine2}
                  </span>
                </span>
              </h1>

              <p className="hero-enter-item mt-6 max-w-md text-base leading-relaxed text-mute md:text-lg [animation-delay:0.28s]">
                {t.hero.subtitle}
              </p>

              <div className="hero-enter-item mt-10 flex flex-wrap gap-4 [animation-delay:0.38s]">
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
