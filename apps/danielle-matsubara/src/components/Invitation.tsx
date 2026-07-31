import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { asset, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Invitation() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-wine-deep text-cream lg:grid-cols-2">
        <div className="relative min-h-[260px] lg:min-h-full">
          <img
            src={asset('hero.jpg')}
            alt="Recepção da Clínica Matsubara"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wine-deep/30 to-wine-deep/80 lg:bg-gradient-to-l" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">
              Próximo passo
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Vamos marcar o momento da sua escuta.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/60">
              Avaliação pelo WhatsApp, sem fricção. Conte o que sente e eu oriento o melhor caminho.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={whatsappUrl()} className="cta-signal justify-center sm:justify-start" data-cursor>
                Agendar no WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-5 py-3.5 text-sm font-medium text-cream/85 transition hover:border-rose hover:text-rose-soft"
                data-cursor
              >
                Ver como funciona
              </Link>
            </div>

            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-start gap-2 text-sm text-cream/50 transition hover:text-rose-soft"
              data-cursor
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{site.address}</span>
            </a>

            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-cream/50 transition hover:text-rose-soft"
              data-cursor
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
