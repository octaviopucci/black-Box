import { MapPin, Phone, ShieldAlert } from 'lucide-react'
import { Reveal } from './Reveal'
import { site } from '../data/site'

export function Loja() {
  return (
    <section
      id="loja"
      className="relative overflow-hidden border-b border-line px-6 py-24 sm:px-10 sm:py-28"
      aria-labelledby="loja-title"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-lamp" aria-hidden />
            Loja física
          </p>
          <h2
            id="loja-title"
            className="display text-[clamp(2.2rem,5vw,3.4rem)] text-paper-soft"
          >
            Venha ver o carro antes de fechar
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">
            Estamos no Centro de Capão Bonito. Se preferir, manda mensagem —
            mandamos a localização e tiramos dúvidas do jeito que for melhor
            pra você.
          </p>

          <dl className="mt-10 space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-lamp" aria-hidden />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-mute">
                  Endereço
                </dt>
                <dd className="mt-1 text-paper-soft">
                  {site.address.street} — {site.address.district}
                  <br />
                  {site.address.city}/{site.address.state} · CEP {site.address.cep}
                  <br />
                  <span className="text-paper-mute">{site.address.landmark}</span>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-lamp" aria-hidden />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-mute">
                  Telefone / WhatsApp
                </dt>
                <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-paper-soft">
                  <a href={site.phone.href} className="hover:text-lamp">
                    {site.phone.label}
                  </a>
                  <a
                    href={`tel:+${site.whatsapp.number}`}
                    className="hover:text-lamp"
                  >
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
            data-cursor="Mapa"
          >
            Abrir no Google Maps
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="relative overflow-hidden border border-lamp/35 bg-lamp/5 p-7 sm:p-9">
            <div
              className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-lamp/15 blur-3xl"
              aria-hidden
            />
            <div className="relative flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-lamp" aria-hidden />
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-paper-soft">
                  Cuidado com golpe
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-paper/75">
                  {site.warnings.map((w) => (
                    <li key={w} className="flex gap-3">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-lamp"
                        aria-hidden
                      />
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
