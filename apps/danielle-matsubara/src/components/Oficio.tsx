import { Reveal } from './Reveal'
import { asset, site } from '../data/site'

export function Oficio() {
  return (
    <section id="oficio" className="relative bg-wine-deep px-5 py-20 text-cream sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <Reveal>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">
              {site.craft.title}
            </p>
            <h2 className="display-title text-4xl text-cream sm:text-5xl lg:text-6xl">
              {site.craft.line}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-cream/65 sm:text-base">
              {site.craft.detail}
            </p>
          </Reveal>

          <Reveal delay={0.12} className="relative overflow-hidden rounded-[2rem]">
            <img
              src={asset('care/odontologia.jpg')}
              alt="Cuidado odontológico na Clínica Matsubara"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 font-script text-2xl text-rose-soft sm:text-3xl">
              Canal · reabilitação · confiança
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {site.craft.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={0.06 * i}>
              <article className="border-t border-cream/15 pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-signal-soft">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl text-cream">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/55">{pillar.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 grid gap-8 border-t border-cream/15 pt-10 sm:grid-cols-3 sm:gap-10">
          {site.journey.map((step) => (
            <div key={step.step}>
              <p className="font-display text-4xl text-rose-soft">{step.step}</p>
              <h3 className="mt-3 text-lg font-semibold text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/55">{step.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
