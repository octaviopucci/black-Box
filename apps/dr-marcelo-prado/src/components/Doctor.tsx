import { ArrowUpRight } from 'lucide-react'
import { asset, site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function Proof() {
  return (
    <section className="border-y border-line bg-fog-soft/70 py-16 sm:py-20" aria-label="Indicadores">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {site.proof.map((item, i) => (
            <Reveal key={item.label} delay={0.06 * i}>
              <div className="border-l-2 border-aqua pl-5">
                <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
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
    <section id="protocolo" className="py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative overflow-hidden">
            <img
              src={asset('protocolo.jpg')}
              alt="Protocolo Harmonie — modulação hormonal"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-aqua-light">
                {site.protocolo.eyebrow}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-snow">{site.protocolo.title}</p>
            </div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionEyebrow>{site.protocolo.eyebrow}</SectionEyebrow>
            <h2 className="display-title text-[clamp(2.3rem,5vw,3.5rem)] text-ink">
              Protocolo Harmonie: modulação com método.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
              {site.protocolo.description}
            </p>
          </Reveal>
          <ol className="mt-10 border-t border-line">
            {site.protocolo.points.map((p, i) => (
              <Reveal key={p} delay={0.08 * i}>
                <li className="flex items-baseline gap-5 border-b border-line py-4">
                  <span className="font-display text-lg text-aqua/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-semibold text-ink">{p}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <Reveal>
        <div className="mx-auto mt-20 max-w-7xl overflow-hidden bg-ink px-5 sm:px-8">
          <div className="grid items-center gap-8 py-12 lg:grid-cols-[1fr_300px] lg:gap-14 lg:py-0">
            <div className="lg:py-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-champagne">
                Parceria
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-snow">
                {site.korpen.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-snow/55 sm:text-base">
                {site.korpen.description}
              </p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-aqua-light transition hover:text-champagne"
              >
                Ver no Instagram
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="relative -mx-5 aspect-[4/3] overflow-hidden lg:mx-0 lg:aspect-auto lg:h-full lg:min-h-[300px]">
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
    <section id="sobre" className="border-t border-line bg-fog-soft/40 py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative overflow-hidden">
            <img
              src={asset('hero-event.jpg')}
              alt={`${site.name} em evento clínico`}
              className="aspect-[4/5] w-full object-cover object-top"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-mute">
            Capão Bonito · Itapeva · On-line
          </p>
        </Reveal>

        <div>
          <Reveal>
            <SectionEyebrow>Sobre</SectionEyebrow>
            <h2 className="display-title text-[clamp(2.3rem,5vw,3.5rem)] text-ink">
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
            <dl className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-mute">
                  Registro
                </dt>
                <dd className="mt-2 font-display text-xl font-bold text-ink">{site.crm}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.22em] text-mute">Foco</dt>
                <dd className="mt-2 font-display text-xl font-bold text-ink">{site.tagline}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
