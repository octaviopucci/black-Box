import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'
import { InstagramIcon } from './InstagramIcon'

export function Threshold() {
  return (
    <section
      id="agendar"
      className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(196,138,148,0.25), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(120,36,60,0.45), transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-rose-soft">
            O limiar
          </p>
          <h2 className="display-title max-w-3xl text-[clamp(2.6rem,7vw,5rem)]">
            Pronto para começar a sua{' '}
            <span className="font-script text-rose-soft">melhor versão</span>?
          </h2>
          <p className="mt-5 max-w-xl text-cream/65">
            Avaliação pelo WhatsApp. Sem fricção. Com a mesma presença que você encontra na clínica.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={whatsappUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose px-7 py-4 text-sm font-semibold text-ink transition hover:bg-rose-soft"
              data-cursor
            >
              Agendar pelo WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/20 px-6 py-4 text-sm font-medium text-cream/85 transition hover:border-rose hover:text-rose-soft"
              data-cursor
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 border-t border-cream/10 pt-10 sm:grid-cols-3">
          <Reveal delay={0.05}>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-rose-soft" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-cream/45">WhatsApp</p>
                <a href={site.phone.href} className="mt-1 block text-lg text-cream hover:text-rose-soft">
                  {site.phone.label}
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-soft" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-cream/45">Endereço</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-lg leading-snug text-cream hover:text-rose-soft"
                >
                  {site.address}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
