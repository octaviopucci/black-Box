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
        <section className="relative overflow-hidden bg-void pt-28 text-snow sm:pt-32">
          <div className="absolute inset-0 opacity-45">
            <img src={area.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
            <Link
              to="/#cuidados"
              className="inline-flex items-center gap-2 text-sm text-snow/60 transition hover:text-signal"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos os cuidados
            </Link>
            <Reveal>
              <SectionEyebrow light>{area.short}</SectionEyebrow>
              <h1 className="mt-2 max-w-3xl font-display text-[clamp(2.6rem,7vw,4.5rem)] font-semibold leading-[1] tracking-tight">
                {area.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-snow/65 sm:text-lg">
                {area.description}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-2">
                {area.signals.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-snow/15 bg-snow/5 px-3 py-1.5 text-xs text-snow/70"
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
              <h2 className="font-display text-3xl font-semibold tracking-tight text-void sm:text-4xl">
                Como a cascata se aplica aqui
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
                No cuidado de {area.title.toLowerCase()}, o Dr. Marcelo Prado correlaciona
                sintomas, exames e contexto de vida — para chegar a um plano que você entende e
                consegue seguir. Presencial em Itapeva ou on-line, o foco é o mesmo: precisão com
                presença humana.
              </p>
              <a
                href={bookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-void px-6 py-3.5 text-sm font-semibold text-signal transition hover:bg-void-soft"
              >
                Agendar sobre {area.title.toLowerCase()}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[1.75rem] border border-line bg-bone/60 p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-celadon-deep">
                  Sinais frequentes
                </p>
                <ul className="mt-6 space-y-4">
                  {area.signals.map((s) => (
                    <li key={s} className="flex items-center gap-3 border-b border-line pb-4 last:border-0">
                      <span className="h-2 w-2 rounded-full bg-signal" />
                      <span className="font-medium text-void">{s}</span>
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

        <section className="border-t border-line bg-bone/40 py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-void">Outros eixos</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to={`/cuidado/${o.id}`}
                  className="group rounded-2xl border border-line bg-snow p-5 transition hover:border-celadon"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-mute">{o.short}</p>
                  <p className="mt-2 font-display text-xl font-semibold text-void group-hover:text-celadon-deep">
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
