import { aboutExtended, aboutFacts, aboutIntro, siteConfig } from '@/data/site'
import { AboutCarousel } from './AboutCarousel'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

export function About() {
  return (
    <section id="sobre" className="section-shell overflow-x-hidden bg-paper">
      <div className="section-container">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:items-start">
          <div className="min-w-0">
            <SectionHeader eyebrow="Sobre" title="Quem é Heitor da Gelsa" />

            <AboutCarousel />

            <Reveal delay={0.12}>
              <p className="mt-8 text-lg leading-relaxed text-graphite">{aboutIntro}</p>
            </Reveal>

            <div className="mt-6 space-y-4">
              {aboutExtended.map((paragraph, i) => (
                <Reveal key={i} delay={0.16 + i * 0.04}>
                  <p className="text-base leading-relaxed text-mute">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <Reveal delay={0.1}>
              <div className="rounded-sm border border-green/10 bg-white p-6 shadow-card sm:p-8">
                <p className="eyebrow text-green">Dados verificados</p>
                <div className="mt-6 divide-y divide-green/10">
                  {aboutFacts.map((fact) => (
                    <div key={fact.id} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] sm:gap-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green">{fact.label}</p>
                      <p className="font-medium leading-snug text-graphite">{fact.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-6 text-xs leading-relaxed text-mute/80">Fontes: {siteConfig.sources.join(' · ')}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
