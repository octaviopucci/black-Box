import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Services() {
  return (
    <section id="protocolos" className="bg-surface/60 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeader
            eyebrow="Protocolos"
            title="Temas do feed, aplicados no atendimento"
            description="Conteúdos extraídos das publicações oficiais no Instagram — sem inventar procedimentos ou resultados."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {site.services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <article className="bezel-outer h-full">
                <div className="bezel-inner flex h-full flex-col p-8 md:p-10">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl text-ink md:text-3xl">
                      {service.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-ink/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-mute">
                      {service.tag}
                    </span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-mute md:text-base">
                    {service.description}
                  </p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.14em] text-mute/80">
                    {service.source}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
