import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Process() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeader
            eyebrow="Método"
            title="Quatro etapas. Uma pele renovada."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {site.process.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div className="group relative">
                <p className="font-display text-6xl font-light text-ink/[0.06] transition-colors duration-700 group-hover:text-accent-soft/30">
                  {step.step}
                </p>
                <h3 className="-mt-4 font-display text-2xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
