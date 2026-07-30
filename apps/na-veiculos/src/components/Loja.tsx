import { MapPin, Phone, ShieldAlert } from 'lucide-react'
import { Reveal } from './Reveal'
import { site } from '../data/site'

export function Loja() {
  return (
    <section
      id="loja"
      className="relative overflow-hidden border-b border-line px-5 py-24 sm:px-8 sm:py-28 lg:px-10"
      aria-labelledby="loja-title"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Presença física
          </p>
          <h2
            id="loja-title"
            className="display-title text-[clamp(2.4rem,6vw,4rem)] text-chrome-soft"
          >
            A loja que você encontra no mapa — e no asfalto
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-chrome/70">
            Venha ver o veículo de perto. Em Capão Bonito, negociação acontece
            com transparência: fotos reais, preço publicado e WhatsApp oficial
            único.
          </p>

          <dl className="mt-10 space-y-5">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-chrome-mute">
                  Endereço
                </dt>
                <dd className="mt-1 text-chrome-soft">
                  {site.address.street} — {site.address.district}
                  <br />
                  {site.address.city}/{site.address.state} · CEP {site.address.cep}
                  <br />
                  <span className="text-chrome-mute">{site.address.landmark}</span>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-chrome-mute">
                  Telefones
                </dt>
                <dd className="mt-1 space-x-4 text-chrome-soft">
                  <a href={site.phone.href} className="hover:text-signal">
                    {site.phone.label}
                  </a>
                  <a href={`tel:+${site.whatsapp.number}`} className="hover:text-signal">
                    {site.whatsapp.label}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <a
            href={site.address.maps}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost mt-10 inline-flex"
          >
            Abrir no Maps
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <aside className="border border-signal/30 bg-signal/5 p-7 sm:p-9">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden />
              <div>
                <h3 className="font-display text-2xl uppercase tracking-[0.06em] text-chrome-soft">
                  Anti-golpe
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-chrome/75">
                  {site.warnings.map((w) => (
                    <li key={w} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
