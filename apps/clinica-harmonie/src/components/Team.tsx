import { asset, team } from '../data/site'
import { Reveal } from './Reveal'

export function Team() {
  return (
    <section id="equipe" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={asset('team-portrait.jpg')}
                alt="Equipe Harmonie"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="h-px w-8 bg-gold" aria-hidden />
                Quem conduz
              </p>
              <h2 className="display-title mt-2 text-[clamp(2.2rem,4.5vw,3.6rem)] text-ink">
                Medicina com presença. Estética com critério.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-mute">
                Fundada pelos sócios-administradores Dra. Rayssa Alexandre e Dr. Marcelo Prado, a
                Harmonie reúne especialidades sob um mesmo propósito: cuidar com excelência em
                Itapeva.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {team.map((person, i) => (
                <Reveal key={person.id} delay={0.1 * i}>
                  <article className="border-t border-ink/10 pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-2xl font-semibold text-ink">{person.name}</h3>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                        {person.crm}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-fern">{person.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{person.note}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
