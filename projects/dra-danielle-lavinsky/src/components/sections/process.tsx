import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Process() {
  return (
    <section id="como" className="border-t border-line/60 bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Processo"
            title="Como funciona"
            description="Do jeito que explico no Instagram — sem mistério."
          />
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {site.process.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div>
                <span className="font-display text-6xl font-light leading-none text-accent/30">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-2xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-mute">
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
