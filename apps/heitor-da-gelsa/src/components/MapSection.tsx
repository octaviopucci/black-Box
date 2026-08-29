import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mapMarkers } from '@/data/site'
import { Reveal } from './Reveal'

export function MapSection() {
  const [active, setActive] = useState(mapMarkers[0]?.id ?? '')

  const selected = mapMarkers.find((m) => m.id === active)

  return (
    <section id="presenca" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Presença</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Presença em Capão Bonito
          </h2>
          <p className="mt-4 max-w-2xl text-graphite/75">
            Mapa estilizado com marcadores editáveis — preparado para integração futura com Google Maps ou OpenStreetMap.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal delay={0.05}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-green-deep">
              <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                <defs>
                  <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="#004D2A" />
                <rect width="100" height="100" fill="url(#grid)" />
                <path
                  d="M15 70 Q35 55 50 48 T85 30"
                  fill="none"
                  stroke="#00A859"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <path
                  d="M20 40 Q45 35 60 55 T80 75"
                  fill="none"
                  stroke="#FFD500"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>

              {mapMarkers.map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                    active === marker.id ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  aria-label={`Marcador: ${marker.name}`}
                  onClick={() => setActive(marker.id)}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      active === marker.id
                        ? 'border-yellow bg-yellow'
                        : 'border-white bg-green'
                    }`}
                  />
                </button>
              ))}
            </div>
          </Reveal>

          {selected && (
            <Reveal delay={0.1}>
              <article className="flex h-full flex-col border border-green/10 bg-[#f6faf8] p-6">
                {selected.isPlaceholder && (
                  <span className="mb-3 inline-block w-fit rounded-sm bg-graphite px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    Placeholder
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">{selected.category}</p>
                <h3 className="mt-2 font-display text-2xl font-black text-green-deep">{selected.name}</h3>
                <p className="mt-1 text-sm text-graphite/60">{selected.date}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite/80">{selected.description}</p>
                {selected.image && (
                  <img
                    src={selected.image}
                    alt=""
                    className="mt-4 aspect-video w-full rounded-sm object-cover"
                    loading="lazy"
                  />
                )}
                {selected.link && (
                  <Link
                    to={selected.link}
                    className="mt-5 inline-flex text-sm font-bold uppercase tracking-wide text-green hover:text-green-dark"
                  >
                    Ver detalhes →
                  </Link>
                )}
              </article>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
