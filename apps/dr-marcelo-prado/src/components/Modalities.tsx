import { MapPin, Video } from 'lucide-react'
import { asset, site } from '../data/site'
import { Reveal, SectionEyebrow } from './Reveal'

const icons = {
  presencial: MapPin,
  online: Video,
} as const

export function Modalities() {
  return (
    <section className="overflow-hidden bg-celadon-mist/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow>Modalidades</SectionEyebrow>
          <h2 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,3.3rem)] font-semibold leading-[1.05] tracking-tight text-void text-balance">
            Onde o cuidado encontra você.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {site.modalities.map((mod, i) => {
            const Icon = icons[mod.id as keyof typeof icons] ?? MapPin
            return (
              <Reveal key={mod.id} delay={0.1 * i}>
                <article className="group relative overflow-hidden rounded-[2rem] bg-void text-snow shadow-lift">
                  <div className="absolute inset-0 opacity-40 transition duration-700 group-hover:opacity-55">
                    <img
                      src={asset(mod.id === 'online' ? 'online.jpg' : 'consult.jpg')}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/40" />
                  </div>
                  <div className="relative flex min-h-[320px] flex-col justify-end p-8 sm:p-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-signal/15 text-signal ring-1 ring-signal/30">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-signal">
                      {mod.detail}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                      {mod.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-snow/65 sm:text-base">
                      {mod.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
