import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Editorial() {
  return (
    <section className="border-t border-line/60 bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Por que faço isso"
            title="Cada conquista também é minha"
            align="center"
          />
        </Reveal>

        <Reveal delay={0.12}>
          <figure className="mt-14 text-center">
            <blockquote className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-medium leading-[1.15] tracking-tight text-ink">
              &ldquo;{site.editorial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-mute">
              — {site.editorial.attribution} · {site.editorial.source}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
