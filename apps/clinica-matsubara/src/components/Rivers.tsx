import { ArrowUpRight } from 'lucide-react'
import { asset, careRivers, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Rivers() {
  return (
    <section id="cuidados" className="relative overflow-hidden bg-wine-deep py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-rose-soft">
            <span className="h-px w-8 bg-rose/50" />
            Três rios de cuidado
          </p>
          <h2 className="display-title max-w-3xl text-[clamp(2.4rem,6vw,4.4rem)]">
            Odontologia, estética e especialidades — no mesmo fluxo.
          </h2>
          <p className="mt-5 max-w-xl text-cream/65">
            Uma clínica multidisciplinar onde sorriso, corpo e bem-estar se encontram sem fratura de jornada.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careRivers.map((river, i) => (
            <Reveal key={river.id} delay={0.06 * i}>
              <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-wine">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={asset(river.image)}
                    alt={river.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/25 to-transparent" />
                  <span className="absolute left-5 top-5 font-script text-5xl text-rose-soft/90">
                    {river.roman}
                  </span>
                </div>
                <div className="flex flex-1 flex-col space-y-3 p-6 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-soft">
                    {river.line}
                  </p>
                  <h3 className="font-display text-3xl font-semibold">{river.title}</h3>
                  <p className="text-sm leading-relaxed text-cream/70">{river.detail}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {river.accents.map((a) => (
                      <li
                        key={a}
                        className="rounded-full border border-cream/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-cream/70"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a href={whatsappUrl()} className="cta-wine bg-rose text-ink hover:bg-rose-soft" data-cursor>
            Quero minha avaliação
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
