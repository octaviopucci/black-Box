import { site } from '../data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="container-page scroll-mt-28 py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">A imobiliária</p>
          <h2 className="display-title mt-3 text-ink">
            {site.headline.split(' ').slice(0, 2).join(' ')}
            <span className="mt-1 block italic text-brand">
              {site.headline.split(' ').slice(2).join(' ')}
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mute">{site.description}</p>
        </Reveal>

        <div className="space-y-6">
          {site.about.map((paragraph, i) => (
            <Reveal key={paragraph.slice(0, 24)} delay={i * 0.08}>
              <p className="border-l border-brand/40 pl-5 text-base leading-relaxed text-ink/80">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {site.pillars.map((pillar, i) => (
          <Reveal key={pillar.title} delay={i * 0.06}>
            <div className="h-full bg-paper p-7 sm:p-8">
              <p className="font-display text-2xl tracking-tight text-ink">{pillar.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-mute">{pillar.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
