import { ArrowUpRight } from 'lucide-react'
import { asset, site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function Proof() {
  return (
    <section className="border-y border-line bg-fog-soft/80 py-16 sm:py-20" aria-label="Indicadores">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {site.proof.map((item, i) => (
            <Reveal key={item.label} delay={0.06 * i}>
              <div className="relative pl-5 before:absolute before:left-0 before:top-1 before:h-10 before:w-0.5 before:bg-wine">
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-mute">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Protocol() {
  return (
    <section id="protocolo" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src={asset('protocolo.jpg')}
              alt="Protocolo Harmonie — modulação hormonal"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 font-display text-2xl font-bold text-snow">
              {site.protocolo.title}
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionEyebrow>{site.protocolo.eyebrow}</SectionEyebrow>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.3rem)] font-extrabold leading-[1.05] tracking-tight text-ink text-balance">
              Protocolo Harmonie: modulação com método.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
              {site.protocolo.description}
            </p>
          </Reveal>
          <ul className="mt-8 space-y-4">
            {site.protocolo.points.map((p, i) => (
              <Reveal key={p} delay={0.08 * i}>
                <li className="flex items-start gap-3 border-b border-line pb-4">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-wine" />
                  <span className="font-semibold text-ink">{p}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <Reveal>
        <div className="mx-auto mt-16 max-w-7xl overflow-hidden rounded-[2rem] bg-ink px-5 sm:px-8">
          <div className="grid items-center gap-8 py-10 lg:grid-cols-[1fr_280px] lg:gap-12 lg:py-0">
            <div className="lg:py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-volt">
                Parceria
              </p>
              <h3 className="mt-3 font-display text-3xl font-extrabold text-snow">
                {site.korpen.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-snow/55 sm:text-base">
                {site.korpen.description}
              </p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-volt transition hover:text-volt-soft"
              >
                Ver no Instagram
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="relative -mx-5 aspect-[4/3] overflow-hidden lg:mx-0 lg:aspect-auto lg:h-full lg:min-h-[280px]">
              <img
                src={asset('korpen.jpg')}
                alt="Dr. Marcelo Prado no Projeto 120 Dias Korpen"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function Doctor() {
  return (
    <section id="sobre" className="border-t border-line bg-fog-soft/50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <img
                src={asset('hero-event.jpg')}
                alt={`${site.name} em evento clínico`}
                className="aspect-[4/5] w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-ink p-5 text-snow shadow-lift sm:left-auto sm:right-[-1rem] sm:w-64">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-volt">
                Presença real
              </p>
              <p className="mt-2 font-display text-xl font-bold leading-tight">
                Capão Bonito · Itapeva
              </p>
              <p className="mt-1 text-sm text-snow/50">e cuidado on-line</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionEyebrow>Sobre</SectionEyebrow>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.3rem)] font-extrabold leading-[1.05] tracking-tight text-ink text-balance">
              Médico, parceiro e presença em cada etapa.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5">
            {site.about.map((para, i) => (
              <Reveal key={para} delay={0.08 * i}>
                <p className="text-base leading-relaxed text-mute sm:text-lg">{para}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-wine pl-4">
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-mute">
                  Registro
                </dt>
                <dd className="mt-2 font-display text-xl font-bold text-ink">{site.crm}</dd>
              </div>
              <div className="border-l-2 border-leaf pl-4">
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-mute">
                  Foco
                </dt>
                <dd className="mt-2 font-display text-xl font-bold text-ink">{site.tagline}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
