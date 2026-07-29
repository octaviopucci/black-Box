import { Link, useParams } from 'react-router-dom'
import { carePaths, whatsappUrl } from '../data/site'
import { OrbitNav } from '../components/OrbitNav'
import { Closing } from '../components/Closing'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { NotFoundPage } from './NotFoundPage'

export function PathPage() {
  const { id } = useParams()
  const path = carePaths.find((p) => p.id === id)
  if (!path) return <NotFoundPage />

  return (
    <div className="min-h-screen bg-void text-paper">
      <OrbitNav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 md:pl-28">
        <Link
          to="/#corredor"
          className="text-[11px] font-semibold uppercase tracking-[0.28em] text-signal/70 transition hover:text-signal"
        >
          ← Corredor
        </Link>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
          <div className="overflow-hidden rounded-[2rem] lg:col-span-6">
            <img src={path.image} alt={path.title} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="lg:col-span-6">
            <p className="text-[11px] uppercase tracking-[0.34em] text-signal/70">{path.line}</p>
            <h1 className="mt-3 font-display text-[clamp(2.8rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tight">
              {path.title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-paper/65 sm:text-lg">{path.detail}</p>
            <a
              href={whatsappUrl(
                `Olá! Vim pelo site da Clínica DNA e gostaria de agendar ${path.title}.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-void transition hover:bg-mist"
            >
              Agendar {path.title}
            </a>
          </div>
        </div>
      </main>
      <Closing />
      <PulseWhatsApp />
    </div>
  )
}
