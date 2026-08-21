import { aboutPoints, media, site } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function About() {
  return (
    <section id="sobre" className="border-b border-mar-line bg-mar-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:grid-cols-2 md:px-10">
        <Reveal className="relative min-h-[360px] md:min-h-[520px]">
          <img
            src={media.about}
            alt="Profissional da Clínica Mar Odontologia"
            className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mar-ink/30 via-transparent to-transparent md:bg-none" />
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-rose-deep">
              Sobre a clínica
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-tight text-mar-ink">
              Cuidado de verdade começa com escuta.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mar-ink-soft">
              {site.intro}
            </p>
          </Reveal>

          <div className="mt-10 divide-y divide-mar-line border-t border-mar-line">
            {aboutPoints.map((point, index) => (
              <Reveal key={point.title} delay={index * 0.08}>
                <article className="py-7">
                  <h3 className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] text-mar-rose-deep">
                    {point.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-base leading-relaxed text-mar-ink-soft">
                    {point.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
