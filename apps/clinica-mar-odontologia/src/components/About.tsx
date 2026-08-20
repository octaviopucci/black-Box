import { aboutPoints, media, site } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function About() {
  return (
    <section id="sobre" className="border-b border-mar-line bg-mar-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:grid-cols-[0.9fr_1.1fr] md:px-10">
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
          <div className="mt-8 flex items-center gap-4">
            <img
              src={media.profile}
              alt="Logo Clínica Mar Odontologia"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-mar-line"
            />
            <div>
              <p className="font-display text-2xl text-mar-ink">{site.name}</p>
              <p className="text-sm text-mar-rose-deep">{site.tagline}</p>
            </div>
          </div>
        </Reveal>

        <div className="space-y-0 divide-y divide-mar-line border-t border-mar-line">
          {aboutPoints.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.08}>
              <article className="py-8 md:py-10">
                <h3 className="font-display text-[clamp(1.5rem,2.5vw,1.875rem)] text-mar-rose-deep">
                  {point.title}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-mar-ink-soft">
                  {point.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
