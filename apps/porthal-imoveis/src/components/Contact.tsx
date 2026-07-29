import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

export function Contact() {
  return (
    <section id="contato" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative min-h-[360px] overflow-hidden bg-ink p-8 text-white sm:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,52,42,0.45),transparent_50%),linear-gradient(160deg,#171311,#2a1816)]" />
            <div className="relative max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                Contato
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Vamos encontrar o imóvel certo
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Atendimento em Capão Bonito/SP. Fale com a equipe Porthal e receba orientação
                personalizada para compra, venda ou locação.
              </p>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
              >
                Conversar no WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="space-y-6 p-8 sm:p-12">
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold text-ink">Escritório</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-sm leading-relaxed text-mute hover:text-brand"
                >
                  {site.address}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold text-ink">Telefones</p>
                <div className="mt-1 flex flex-col gap-1">
                  {site.phones.map((phone) => (
                    <a
                      key={phone.label}
                      href={phone.href}
                      className="text-sm text-mute hover:text-brand"
                    >
                      {phone.label}
                      {phone.whatsapp ? ' · WhatsApp' : ''}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold text-ink">E-mail</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block text-sm text-mute hover:text-brand"
                >
                  {site.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Social href={site.social.instagram} label="Instagram">
                <SocialGlyph path="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zM17.2 6.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
              </Social>
              <Social href={site.social.facebook} label="Facebook">
                <SocialGlyph path="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
              </Social>
              <Social href={site.social.youtube} label="YouTube">
                <SocialGlyph path="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8zM10 15.2V8.8L15.5 12z" />
              </Social>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Social({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand"
    >
      {children}
    </a>
  )
}

function SocialGlyph({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}
