import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Clinic() {
  return (
    <section id="clinica" className="bg-mauve text-paper">
      <div className="grid lg:grid-cols-2">
        <Reveal className="relative overflow-hidden">
          <div className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[88vh]">
            <img
              src={site.atmosphere.image}
              alt="Ambiente acolhedor da recepção OdontoMed"
              className="h-full w-full object-cover object-[50%_16%] lg:absolute lg:inset-0"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-mauve-deep/25 lg:block" />
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
              alt="Registro fotográfico durante avaliação na OdontoMed"
              className="aspect-[3/4] w-full object-cover object-top"
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
