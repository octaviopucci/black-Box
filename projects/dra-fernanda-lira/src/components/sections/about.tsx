import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <SectionHeader
            eyebrow="Sobre"
            title="Cuidado facial com precisão e acolhimento"
          />
        </Reveal>

        <div className="space-y-6">
          {site.about.paragraphs.map((paragraph, i) => (
            <Reveal key={paragraph} delay={i * 0.1}>
              <p className="text-base leading-relaxed text-mute md:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.25}>
            <ul className="mt-8 space-y-3">
              {site.about.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-ink md:text-base"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
