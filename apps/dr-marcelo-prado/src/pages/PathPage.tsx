import { Link, useParams } from 'react-router-dom'
import { bookingUrl, carePaths } from '../data/site'
import { Atmosphere } from '../components/Atmosphere'
import { OrbitNav } from '../components/OrbitNav'
import { Closing } from '../components/Closing'
import { PulseBooking } from '../components/PulseBooking'
import { NotFoundPage } from './NotFoundPage'

export function PathPage() {
  const { id } = useParams()
  const path = carePaths.find((p) => p.id === id)
  if (!path) return <NotFoundPage />

  const index = carePaths.findIndex((p) => p.id === id) + 1
  const next = carePaths[index % carePaths.length]

  return (
    <div className="relative min-h-screen bg-void text-paper">
      <Atmosphere />
      <OrbitNav />
      <main className="relative z-10">
        <section className="relative min-h-[70svh] overflow-hidden">
          <img
            src={path.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/40" />
          <div className="relative mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 md:pl-28">
            <Link
              to="/#corredor"
              className="mb-8 w-fit text-[11px] font-semibold uppercase tracking-[0.28em] text-signal/70 transition hover:text-signal"
            >
              ← Corredor
            </Link>
            <p className="text-[11px] uppercase tracking-[0.34em] text-champagne/80">
              {String(index).padStart(2, '0')} · {path.line}
            </p>
            <h1 className="mt-3 font-display text-[clamp(3rem,8vw,5.5rem)] font-semibold leading-[0.92] tracking-tight">
              {path.title}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:pl-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-paper/65 sm:text-xl">{path.detail}</p>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-paper/10 pt-8">
                {path.signals.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] uppercase tracking-[0.26em] text-signal/75"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <a
                href={bookingUrl()}
                target="_blank"
                rel="noreferrer"
                className="cta-primary"
              >
                Agendar {path.title}
              </a>
              {next ? (
                <Link
                  to={`/cuidado/${next.id}`}
                  className="mt-8 block border-t border-paper/10 pt-8 transition hover:text-signal"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-mute">Próximo eixo</p>
                  <p className="mt-2 font-display text-3xl">{next.title}</p>
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Closing />
      <PulseBooking />
    </div>
  )
}
