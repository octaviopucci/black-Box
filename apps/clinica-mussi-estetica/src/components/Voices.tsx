import { site } from '@/data/site'
import { Reveal } from './Reveal'

export function Voices() {
  const featured = site.testimonials[0]
  const others = site.testimonials.slice(1)

  return (
    <section className="border-t border-ink/8 bg-ink px-6 py-24 text-paper-lift md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-paper-deep">
                Depoimentos
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.03em]">
                O que clientes relatam publicamente.
              </h2>
            </div>
            <p className="text-sm text-paper-deep">
              {site.proof.rating.toFixed(1)} · {site.proof.count} avaliações · {site.proof.source}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <figure className="border-l border-clay-soft pl-8 md:pl-12">
            <blockquote className="font-display text-[clamp(1.5rem,3.2vw,2.35rem)] leading-[1.2] tracking-[-0.02em] text-paper-lift">
              “{featured.quote}”
            </blockquote>
            <figcaption className="mt-8 text-sm text-paper-deep">
              {featured.author} · {featured.date}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-10 md:grid-cols-2">
          {others.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <figure>
                <blockquote className="text-lg leading-relaxed text-paper-lift/92">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-[0.16em] text-paper-deep">
                  {item.author} · {item.date}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
