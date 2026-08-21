import { media, professionals, site } from '@/data/site'
import { Reveal } from './Reveal'

export function Team() {
  const featured = professionals.filter((p) => p.featured)
  const support = professionals.filter((p) => !p.featured)

  return (
    <section id="equipe" className="relative overflow-hidden bg-ink-lift py-24 md:py-32">
      <div className="absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-bronze">
              Equipe
            </p>
            <h2 className="mt-4 font-brand text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.02] text-paper">
              Quem defende, prepara e acompanha cada caso
            </h2>
            <p className="mt-4 max-w-lg font-sans text-base font-light leading-relaxed text-paper-mute">
              Sócios-administradores da {site.legalName}, com atuação concentrada em direito
              criminal e processual penal na região de Sorocaba.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="relative aspect-[5/4] overflow-hidden">
              <img
                src={media.team}
                alt="Profissionais da Advocacia Del Cistia em ambiente judiciário"
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-sectionVeil px-5 py-4 font-sans text-xs uppercase tracking-[0.18em] text-paper/70">
                Equipe · publicação oficial @advocacia.delcistia
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px bg-line md:grid-cols-2">
          {featured.map((person, index) => (
            <Reveal key={person.id} delay={index * 0.08}>
              <article className="flex h-full flex-col bg-ink-lift p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-brand text-2xl font-medium text-paper">{person.name}</h3>
                    <p className="mt-1 font-sans text-sm font-medium uppercase tracking-[0.14em] text-bronze-soft">
                      {person.role}
                    </p>
                  </div>
                  {'oab' in person && person.oab ? (
                    <span className="shrink-0 font-sans text-[0.65rem] uppercase tracking-[0.12em] text-paper-mute">
                      {person.oab}
                    </span>
                  ) : null}
                </div>
                <p className="mt-5 flex-1 font-sans text-base font-light leading-relaxed text-paper-mute">
                  {person.description}
                </p>
                {'instagram' in person && person.instagram ? (
                  <a
                    href={person.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex font-sans text-xs uppercase tracking-[0.16em] text-bronze transition hover:text-bronze-soft"
                  >
                    Instagram profissional →
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>

        {support.length > 0 ? (
          <Reveal delay={0.12} className="mt-px">
            <article className="border border-line bg-ink p-8 md:p-10">
              <h3 className="font-brand text-xl font-medium text-paper">{support[0].name}</h3>
              <p className="mt-1 font-sans text-sm font-medium uppercase tracking-[0.14em] text-bronze-soft">
                {support[0].role}
              </p>
              <p className="mt-4 max-w-2xl font-sans text-base font-light leading-relaxed text-paper-mute">
                {support[0].description}
              </p>
            </article>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
