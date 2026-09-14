import { professionals, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Team() {
  return (
    <section id="equipe" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-crystal-deep">
            Equipe
          </p>
          <h2 className="mt-3 max-w-md font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05] text-ink">
            Quem conduz cada projeto de sorriso.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {professionals.map((person, index) => (
            <Reveal key={person.id} delay={index * 0.08}>
              <article className="grid gap-8 sm:grid-cols-[140px_1fr] sm:items-start">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="aspect-[4/5] w-full max-w-[140px] object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex aspect-[4/5] w-full max-w-[140px] items-center justify-center bg-paper-dim font-display text-3xl text-ink/20"
                    aria-hidden
                  >
                    {person.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h3 className="font-display text-2xl text-ink">{person.name}</h3>
                  <p className="mt-1 text-sm font-medium text-crystal-deep">{person.role}</p>
                  {person.credential ? (
                    <p className="mt-1 text-xs uppercase tracking-wider text-ink-mute">
                      {person.credential}
                    </p>
                  ) : null}
                  <p className="mt-4 leading-relaxed text-ink-mute">{person.description}</p>
                  <p className="mt-3 text-xs text-ink-mute/70">Fonte: {person.source}</p>
                  {person.instagram ? (
                    <a
                      href={person.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-medium text-ink underline-offset-4 hover:underline"
                    >
                      Instagram
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <a href={whatsappUrl()} className="cta-primary">
            Falar com a clínica
          </a>
        </Reveal>
      </div>
    </section>
  )
}
