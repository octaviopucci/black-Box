import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function FirstConsult() {
  return (
    <section className="border-t border-line/60 bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Primeira consulta"
            title={site.firstConsult.title}
            description={site.firstConsult.note}
          />
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-2">
          {site.firstConsult.items.map((item, i) => (
            <Reveal key={item} delay={i * 0.08}>
              <li className="flex gap-4 border-t border-line/60 pt-6">
                <span className="font-display text-3xl font-light text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-ink md:text-lg">
                  {item}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.15}>
          <p className="mt-10 text-xs text-mute">{site.firstConsult.source}</p>
        </Reveal>
      </div>
    </section>
  );
}
