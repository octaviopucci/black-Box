import { ArrowUpRight } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function Services() {
  return (
    <section id="servicos" className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            light
            eyebrow="Serviços"
            title="Tudo o que um negócio imobiliário exige"
            subtitle="Do primeiro contato ao pós-fechamento — com a mesma disciplina que sustenta a marca há décadas."
          />
          <a
            href={whatsappUrl('Olá! Quero saber mais sobre os serviços da Márcio Mariano.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Solicitar assessoria
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service, i) => (
            <Reveal
              key={service.title}
              delay={i * 0.05}
              className="group bg-navy-deep/80 p-7 transition hover:bg-navy-mid/60 sm:p-8"
            >
              <span className="font-display text-3xl font-semibold text-gold/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{service.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
