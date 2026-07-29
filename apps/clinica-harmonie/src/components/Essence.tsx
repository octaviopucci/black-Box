import { Reveal } from './Reveal'
import { site } from '../data/site'

export function Essence() {
  return (
    <section id="essencia" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 w-[140%] -translate-x-1/2 opacity-40"
        viewBox="0 0 1200 120"
        fill="none"
      >
        <path
          className="wave-path"
          d="M0 60 C150 10, 300 110, 450 60 S750 10, 900 60 1050 110, 1200 60"
          stroke="#C4A574"
          strokeWidth="1.2"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-gold" aria-hidden />
            Essência
          </p>
        </Reveal>

        <div className="mt-4 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            {site.manifesto.map((line, i) => (
              <Reveal key={line} delay={0.08 * i}>
                <p
                  className={`display-title text-[clamp(2rem,5vw,3.6rem)] ${
                    i === 1 ? 'text-fern italic' : 'text-ink'
                  }`}
                >
                  {line}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="space-y-5 border-l border-gold/40 pl-6 text-base leading-relaxed text-mute sm:text-lg">
              {site.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 border-t border-ink/8 pt-12 sm:grid-cols-3">
          {site.principles.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * i}>
              <article>
                <p className="font-display text-4xl text-gold/70">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
