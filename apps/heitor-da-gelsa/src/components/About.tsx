import { aboutExtended, aboutFacts, aboutIntro, siteConfig } from '@/data/site'
import { AboutCarousel } from './AboutCarousel'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Sobre</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-black leading-[1.02] text-green-deep">
                Quem é Heitor da Gelsa
              </h2>
            </Reveal>

            <AboutCarousel />

            <Reveal delay={0.12}>
              <p className="mt-8 text-lg leading-relaxed text-graphite/90">{aboutIntro}</p>
            </Reveal>

            <div className="mt-6 space-y-4">
              {aboutExtended.map((paragraph, i) => (
                <Reveal key={i} delay={0.16 + i * 0.04}>
                  <p className="text-base leading-relaxed text-graphite/80">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <div className="divide-y divide-green/10 border-y border-green/10">
              {aboutFacts.map((fact, i) => (
                <Reveal key={fact.id} delay={0.14 + i * 0.03}>
                  <div className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">{fact.label}</p>
                    <p className="font-medium text-graphite">{fact.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <p className="mt-8 text-xs text-graphite/50">Fontes: {siteConfig.sources.join(' · ')}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
