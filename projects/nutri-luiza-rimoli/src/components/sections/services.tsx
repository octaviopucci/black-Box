import { site } from "@/data/site";
import { serviceContactUrl } from "@/lib/contact";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Services() {
  return (
    <section id="servicos" className="border-t border-line/60 bg-deep py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
              Atendimentos
            </p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] tracking-tight md:text-5xl lg:text-[3.25rem]">
              O que faço no consultório
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">
              Toque no serviço e já abre o WhatsApp com a mensagem certa.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 divide-y divide-white/10">
          {site.services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.06}>
              <article className="grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-display text-2xl font-medium text-white md:text-3xl">
                      {service.title}
                    </h3>
                    <span className="text-sm text-accent-soft">
                      {service.priceNote}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/65">
                    {service.description}
                  </p>
                </div>
                <a
                  href={serviceContactUrl(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent-soft transition hover:text-white"
                >
                  Chamar sobre este atendimento
                  <span aria-hidden>→</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
