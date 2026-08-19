import { site } from '@/data/site'
import { Reveal } from './Reveal'

const featured = site.professionals.filter((person) => 'featured' in person && person.featured)
const associates = site.professionals.filter((person) => !('featured' in person && person.featured))

export function Team() {
  return (
    <section id="equipe" className="border-t border-ink/8 bg-paper px-6 py-24 md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Equipe</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.03em] text-ink">
            Quem cuida de você na Mussi.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{site.teamIntro.lead}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-mute">{site.teamIntro.body}</p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-10">
          {featured.map((person, index) => (
            <Reveal key={person.id} delay={index * 0.08}>
              <article className="group">
                <figure className="overflow-hidden">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="aspect-[4/5] w-full object-cover transition duration-700 ease-tactile group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </figure>
                <div className="mt-6 border-t border-ink/10 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage-deep">
                    {person.role}
                  </p>
                  <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.02em] text-ink md:text-4xl">
                    {person.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ink-soft">{person.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-mute">{person.source}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-20 border-t border-ink/8 pt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">
              Profissionais associados
            </p>
            <ul className="mt-10 divide-y divide-ink/8">
              {associates.map((person, index) => (
                <Reveal key={person.id} delay={index * 0.04}>
                  <li className="flex gap-5 py-8 first:pt-0 last:pb-0 md:gap-8">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="h-20 w-20 shrink-0 rounded-full border border-ink/10 object-cover md:h-24 md:w-24"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="font-display text-2xl leading-tight text-ink">{person.name}</h3>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-deep">
                          {person.role}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{person.description}</p>
                      {'instagram' in person && person.instagram ? (
                        <a
                          href={person.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="touch-link mt-3 inline-block text-xs font-medium uppercase tracking-[0.16em] text-ink-mute transition-colors hover:text-sage-deep"
                        >
                          Ver no Instagram
                        </a>
                      ) : null}
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
