import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'
import { InstagramIcon } from './InstagramIcon'
import { BrandMark } from './BrandMark'

export function Threshold() {
  return (
    <section id="agendar" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 text-porcelain sm:px-12 sm:py-16 lg:px-16">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-fern/40 blur-3xl"
          />

          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <Reveal>
              <BrandMark tone="gold" className="mb-6 h-10 w-10" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-soft">
                Limiar
              </p>
              <h2 className="display-title mt-3 text-[clamp(2.4rem,5.5vw,4.2rem)]">
                Agende seu horário e viva essa experiência.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-porcelain/60">
                Fale conosco pelo WhatsApp ou acompanhe a Harmonie no Instagram. Seu cuidado merece
                atenção, estratégia e resultado.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={whatsappUrl()} className="cta-gold" data-cursor>
                  WhatsApp {site.phone.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-porcelain/25 px-5 py-3.5 text-sm font-medium text-porcelain/85 transition hover:border-gold hover:text-gold-soft"
                  data-cursor
                >
                  <InstagramIcon className="h-4 w-4" />
                  Instagram
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="space-y-5 text-sm text-porcelain/70">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a href={site.phone.href} className="hover:text-gold-soft">
                    {site.phone.label}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-soft"
                  >
                    {site.address}
                  </a>
                </li>
                <li className="flex gap-3">
                  <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-soft"
                  >
                    {site.instagramHandle}
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
