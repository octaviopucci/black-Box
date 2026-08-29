import { aboutFacts, aboutIntro, media, siteConfig } from '@/data/site'
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Sobre</p>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4vw,3.25rem)] font-black leading-[1.02] text-green-deep">
            Quem é Heitor da Gelsa
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal delay={0.05}>
            <div className="relative">
              <img
                src={media.about}
                alt="Heitor da Gelsa em Capão Bonito"
                className="aspect-[4/5] w-full rounded-sm object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-3 -right-3 h-full w-full border-2 border-yellow -z-10" aria-hidden />
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-graphite/85">{aboutIntro}</p>
              <p className="mt-4 text-base text-graphite/70">{siteConfig.family}.</p>
            </Reveal>

            <div className="mt-10 space-y-0 divide-y divide-green/10 border-y border-green/10">
              {aboutFacts.map((fact, i) => (
                <Reveal key={fact.id} delay={0.12 + i * 0.04}>
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-5 sm:grid-cols-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-green">{fact.label}</p>
                    <p className="font-semibold text-graphite">{fact.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
