import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

const featured = site.professionals.filter((person) => person.featured)
const associates = site.professionals.filter((person) => !person.featured)

export function Professionals() {
  return (
    <section id="equipe" className="border-t border-paper-deep/80 bg-paper px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-eyebrow">Profissionais</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] text-ink">
            Quem cuida do seu sorriso na OdontoMed.
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-ink-soft sm:text-lg">
            {site.teamIntro.lead}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-12">
          {featured.map((person, index) => (
            <Reveal key={person.id} delay={index * 0.06}>
              <article className="group">
                <figure className="overflow-hidden bg-paper-deep/40">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="aspect-[4/5] w-full object-cover object-top transition duration-700 ease-tactile group-hover:scale-[1.015]"
                    loading="lazy"
                  />
                </figure>
                <div className="mt-6 border-t border-paper-deep pt-6">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-copper">
                    {person.role}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none text-ink">
                    {person.name}
                  </h3>
                  <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">{person.description}</p>
                  <p className="mt-4 font-sans text-xs uppercase tracking-[0.18em] text-ink-mute">{person.source}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 border-t border-paper-deep/80 pt-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">
              Corpo clínico
            </p>
            <ul className="mt-10 divide-y divide-paper-deep/80">
              {associates.map((person, index) => (
                <Reveal key={person.id} delay={index * 0.05}>
                  <li className="grid gap-6 py-9 md:grid-cols-[140px_minmax(0,1fr)] md:items-start md:gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="aspect-[3/4] w-full max-w-[180px] object-cover object-top"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-copper">
                        {person.role}
                      </p>
                      <h3 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
                        {person.name}
                      </h3>
                      <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft sm:text-base">
                        {person.description}
                      </p>
                      <p className="mt-4 font-sans text-xs uppercase tracking-[0.18em] text-ink-mute">
                        {person.source}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
