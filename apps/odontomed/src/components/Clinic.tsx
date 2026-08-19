import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Clinic() {
  return (
    <section id="clinica" className="bg-mauve text-paper">
      <div className="grid lg:grid-cols-2">
        <Reveal className="relative min-h-[52vh] lg:min-h-[88vh]">
          <img
            src={site.atmosphere.image}
            alt="Ambiente acolhedor da recepção OdontoMed"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-mauve-deep/25" />
        </Reveal>

        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
          <Reveal>
            <p className="section-eyebrow text-copper-light">Ambiente</p>
            <h2 className="mt-4 max-w-md font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[0.98]">
              {site.atmosphere.title}
            </h2>
            <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-paper/82 sm:text-lg">
              {site.atmosphere.body}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-12 overflow-hidden">
            <img
              src={site.atmosphere.secondary}
              alt="Equipe e consultório da OdontoMed"
              className="aspect-[4/3] w-full object-cover"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 font-sans text-xs uppercase tracking-[0.18em] text-paper/55">
              Fonte: {site.atmosphere.source}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
