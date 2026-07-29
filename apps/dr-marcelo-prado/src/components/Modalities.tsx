import { MapPin, Video } from 'lucide-react'
import { site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

const icons = {
  presencial: MapPin,
  online: Video,
} as const

export function Modalities() {
  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow>Modalidades</SectionEyebrow>
          <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,3.3rem)] font-semibold leading-[1.05] tracking-tight text-ink text-balance">
            Onde o cuidado encontra você.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {site.modalities.map((mod, i) => {
            const Icon = icons[mod.id as keyof typeof icons] ?? MapPin
            return (
              <Reveal key={mod.id} delay={0.1 * i}>
                <article className="group relative min-h-[260px] overflow-hidden rounded-[2rem] bg-ink p-8 text-snow sm:p-10">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-aqua/30 blur-3xl transition group-hover:bg-aqua/45" />
                  <div className="relative">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-snow/5 text-volt ring-1 ring-snow/15">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-aqua-light">
                      {mod.detail}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                      {mod.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-snow/55 sm:text-base">
                      {mod.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {site.locations.map((loc, i) => (
            <Reveal key={loc.id} delay={0.08 * i}>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-line bg-fog-soft/60 p-6 transition hover:border-aqua/40"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">
                  {loc.city}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mute">{loc.address}</p>
                <p className="mt-4 text-sm font-bold text-ink">Ver no mapa →</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
