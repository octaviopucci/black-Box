import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { asset, media, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Booking() {
  return (
    <section id="orcar" className="relative overflow-hidden border-t border-parchment/5">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian-veil to-obsidian" />
      <div className="absolute inset-0 bg-grain opacity-[0.05]" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <p className="section-label mb-3">Orçamento</p>
          <h2 className="font-brand text-[clamp(2.8rem,8vw,5rem)] leading-[0.92] tracking-[0.06em]">
            PRONTO
            <br />
            PARA MARCAR?
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-parchment/55">
            Projetos únicos e exclusivos — homenagens, coberturas, fine line e grandes
            composições. Fale pelo WhatsApp para avaliar seu caso e garantir horário.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={whatsappUrl()} className="cta-primary justify-center sm:justify-start">
              Chamar no WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="cta-ghost justify-center sm:justify-start"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-parchment/50">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-copper" aria-hidden />
              {site.studio}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-copper" aria-hidden />
              <a href={site.phone.href} className="transition-colors hover:text-parchment">
                {site.phone.label}
              </a>
            </li>
          </ul>
        </div>

        <div className="relative aspect-[4/5] max-h-[520px] w-full overflow-hidden lg:max-h-none">
          <img
            src={asset(media.profile)}
            alt="Octávio Pucci — tatuador"
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 font-brand text-3xl tracking-[0.1em] text-parchment">
            {site.mantra}
          </p>
        </div>
      </div>
    </section>
  )
}
