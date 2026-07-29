import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { bookingUrl, careAreas, site } from '../data/site'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { BookingButton } from '../components/BookingButton'
import { Reveal, SectionEyebrow } from '../components/Reveal'
import { NotFoundPage } from './NotFoundPage'

export function CarePage() {
  const { id } = useParams()
  const area = careAreas.find((c) => c.id === id)

  if (!area) return <NotFoundPage />

  const others = careAreas.filter((c) => c.id !== area.id)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-ink pt-28 text-snow sm:pt-32">
          <div className="absolute inset-0 opacity-50">
            <img src={area.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
            <Link
              to={{ pathname: '/', hash: 'cuidados' }}
              className="inline-flex items-center gap-2 text-sm text-snow/55 transition hover:text-volt"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos os cuidados
            </Link>
            <Reveal>
              <SectionEyebrow light>{area.short}</SectionEyebrow>
              <h1 className="mt-2 max-w-3xl font-display text-[clamp(2.6rem,7vw,4.5rem)] font-extrabold leading-[1] tracking-tight">
                {area.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-snow/60 sm:text-lg">
                {area.description}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-2">
                {area.signals.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-snow/15 bg-snow/5 px-3 py-1.5 text-xs text-snow/65"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Como a modulação se aplica aqui
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
                No cuidado de {area.title.toLowerCase()}, o Dr. Marcelo Prado correlaciona
                sintomas, exames e contexto de vida — para chegar a um plano que você entende e
                consegue seguir. Em Capão Bonito, Itapeva ou on-line.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={bookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-snow transition hover:bg-ink-soft"
                >
                  Agendar sobre {area.title.toLowerCase()}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                {area.ig ? (
                  <a
                    href={area.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-wine transition hover:text-wine-soft"
                  >
                    Ver no Instagram
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border border-line bg-fog-soft/70 p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-wine">
                  Sinais frequentes
                </p>
                <ul className="mt-6 space-y-4">
                  {area.signals.map((s) => (
                    <li key={s} className="flex items-center gap-3 border-b border-line pb-4 last:border-0">
                      <span className="h-2 w-2 rounded-full bg-wine" />
                      <span className="font-semibold text-ink">{s}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-mute">
                  {site.crm} · {site.specialty}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-line bg-fog-soft/40 py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-display text-2xl font-bold text-ink">Outros eixos</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to={`/cuidado/${o.id}`}
                  className="group border border-line bg-snow p-5 transition hover:border-wine/40"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-mute">{o.short}</p>
                  <p className="mt-2 font-display text-xl font-bold text-ink group-hover:text-wine">
                    {o.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BookingButton />
    </div>
  )
}
