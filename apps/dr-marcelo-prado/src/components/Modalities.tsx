import { site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

export function Modalities() {
  return (
    <section className="overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow>Modalidades</SectionEyebrow>
          <h2 className="display-title max-w-2xl text-[clamp(2.3rem,5vw,3.5rem)] text-ink">
            Onde o cuidado encontra você.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-0 border-y border-line lg:grid-cols-2">
          {site.modalities.map((mod, i) => (
            <Reveal key={mod.id} delay={0.1 * i}>
              <article
                className={`bg-ink p-9 text-snow sm:p-12 ${
                  i === 0 ? 'lg:border-r lg:border-snow/10' : ''
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-aqua-light">
                  {mod.detail}
                </p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight">
                  {mod.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-snow/55 sm:text-base">
                  {mod.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
          {site.locations.map((loc, i) => (
            <Reveal key={loc.id} delay={0.08 * i}>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block transition"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">
                  {loc.city}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mute group-hover:text-ink">
                  {loc.address}
                </p>
                <p className="mt-4 text-sm font-bold text-ink transition group-hover:text-aqua">
                  Ver no mapa →
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
