import { procedures } from '../data/site'
import { Reveal } from './Reveal'

export function Procedures() {
  return (
    <section id="procedimentos" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-crystal-deep">
            Procedimentos
          </p>
          <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-ink">
            Cada tratamento com propósito — nunca padronizado.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-24 sm:space-y-32">
          {procedures.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <article
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  {item.resultImage ? (
                    <div className="grid grid-cols-2 gap-1">
                      <figure className="relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={`Antes — ${item.title}`}
                          className="aspect-[3/4] w-full object-cover object-top"
                          loading="lazy"
                        />
                        <figcaption className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/80">
                          Antes
                        </figcaption>
                      </figure>
                      <figure className="relative overflow-hidden">
                        <img
                          src={item.resultImage}
                          alt={`Resultado — ${item.title}`}
                          className="aspect-[3/4] w-full object-cover object-top"
                          loading="lazy"
                        />
                        <figcaption className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/80">
                          Resultado
                        </figcaption>
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
                      </figure>
                    </div>
                  ) : (
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="aspect-[4/5] w-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
                    </>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-mute">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-lg font-medium text-ink-soft">{item.lead}</p>
                  <p className="mt-4 max-w-prose leading-relaxed text-ink-mute">{item.body}</p>
                  <p className="mt-6 text-xs text-ink-mute/70">Fonte: {item.source}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
