import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Philosophy() {
  return (
    <section className="border-t border-line/60 bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Abordagem"
            title={site.philosophy.title}
            description={site.philosophy.intro}
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {site.philosophy.points.map((point, i) => (
            <Reveal key={point} delay={i * 0.1}>
              <p className="border-l-2 border-accent pl-5 text-base leading-relaxed text-ink md:text-lg">
                {point}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-xs text-mute">{site.philosophy.source}</p>
        </Reveal>
      </div>
    </section>
  );
}
