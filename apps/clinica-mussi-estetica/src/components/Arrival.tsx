import { site, mapsUrl, whatsappUrl } from '@/data/site'
import { Reveal } from './Reveal'

export function Arrival() {
  return (
    <section id="visita" className="px-6 py-24 md:px-10 md:py-32 lg:px-14 xl:px-20">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Visita</p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.03em] text-ink">
            Jardim Nova Ipanema, Sorocaba.
          </h2>
          <address className="mt-10 not-italic text-lg leading-relaxed text-ink-soft">
            {site.address.street}
            <br />
            {site.address.neighborhood} · {site.address.city} — {site.address.state}
            <br />
            CEP {site.address.cep}
          </address>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-mute">
                Horário
              </dt>
              <dd className="mt-2 text-base text-ink-soft">
                {site.hours.label}, {site.hours.open} às {site.hours.close}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-mute">
                WhatsApp
              </dt>
              <dd className="mt-2">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-link text-base font-medium text-ink"
                >
                  {site.contact.whatsappDisplay}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between border border-ink/10 bg-paper-lift p-8 md:p-10">
            <div>
              <p className="font-display text-3xl leading-tight tracking-[-0.02em] text-ink">
                Próximo passo: uma conversa rápida.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-mute">
                Agende sua avaliação pelo WhatsApp. Sem formulários — você fala direto com a equipe.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary inline-flex flex-1 items-center justify-center bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-paper-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
              >
                WhatsApp
              </a>
              <a
                href={mapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center border border-ink/15 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
              >
                Google Maps
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
