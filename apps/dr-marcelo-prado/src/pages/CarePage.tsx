import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { bookingUrl, careAreas, site } from '../data/site'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { BookingButton } from '../components/BookingButton'
import { PageProgress } from '../components/PageProgress'
import { Reveal, SectionEyebrow } from '../components/Reveal'
import { NotFoundPage } from './NotFoundPage'

export function CarePage() {
  const { id } = useParams()
  const area = careAreas.find((c) => c.id === id)

  if (!area) return <NotFoundPage />

  const index = careAreas.findIndex((c) => c.id === area.id) + 1
  const others = careAreas.filter((c) => c.id !== area.id)

  return (
    <div className="min-h-screen">
      <PageProgress />
      <Navbar />
      <main>
        <section className="relative min-h-[72svh] overflow-hidden bg-ink pt-28 text-snow sm:pt-32">
          <div className="absolute inset-0">
            <img src={area.image} alt="" className="h-full w-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/45" />
          </div>
          <div className="relative mx-auto flex min-h-[calc(72svh-7rem)] max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-24">
            <Link
              to={{ pathname: '/', hash: 'cuidados' }}
              className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-snow/55 transition hover:text-aqua-light"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos os cuidados
            </Link>
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-aqua-light/90">
                {String(index).padStart(2, '0')} · {area.short}
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.8rem,7.5vw,5rem)] font-semibold leading-[0.95] tracking-tight">
                {area.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-snow/60 sm:text-lg">
                {area.description}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-snow/10 pt-6">
                {area.signals.map((s) => (
                  <span key={s} className="text-[11px] uppercase tracking-[0.24em] text-snow/55">
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <SectionEyebrow>Condução</SectionEyebrow>
              <h2 className="display-title text-3xl text-ink sm:text-4xl">
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
                  className="cta-aqua !bg-ink hover:!bg-ink-soft"
                >
                  Agendar sobre {area.title.toLowerCase()}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                {area.ig ? (
                  <a
                    href={area.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-aqua transition hover:text-aqua-soft"
                  >
                    Ver no Instagram
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border-t border-line pt-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-aqua">
                  Sinais frequentes
                </p>
                <ul className="mt-6 space-y-0">
                  {area.signals.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-4 border-b border-line py-4 last:border-0"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
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
            <div className="mt-8 grid gap-0 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to={`/cuidado/${o.id}`}
                  className="group border-b border-line p-6 transition hover:bg-snow sm:border-r last:border-b-0 lg:border-b-0"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-mute">{o.short}</p>
                  <p className="mt-2 font-display text-xl font-bold text-ink group-hover:text-aqua">
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
