import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { site } from '@/data/site'
import { Reveal } from './Reveal'

export function Contact() {
  return (
    <section id="contato" className="bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <Reveal>
            <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-bronze">
              Contato
            </p>
            <h2 className="mt-4 font-brand text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.02] text-paper">
              Orientação jurídica quando você precisar
            </h2>
            <p className="mt-4 max-w-md font-sans text-base font-light leading-relaxed text-paper-mute">
              Entre em contato pelos canais oficiais do escritório. Em situações urgentes, utilize
              o plantão jurídico disponível 24 horas.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
                <div>
                  <p className="font-sans text-sm font-medium text-paper">{site.plantao}</p>
                  <p className="mt-1 font-sans text-sm font-light text-paper-mute">
                    Atendimento contínuo para demandas criminais urgentes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
                <address className="not-italic">
                  <p className="font-sans text-sm text-paper">{site.address.street}</p>
                  <p className="font-sans text-sm text-paper-mute">{site.address.detail}</p>
                  <p className="font-sans text-sm text-paper-mute">
                    {site.address.neighborhood} · {site.address.city}/{site.address.state}
                  </p>
                  <p className="font-sans text-sm text-paper-mute">CEP {site.address.cep}</p>
                  <a
                    href={site.address.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block font-sans text-xs uppercase tracking-[0.14em] text-bronze hover:text-bronze-soft"
                  >
                    Ver no mapa →
                  </a>
                </address>
              </div>

              <div className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
                <div className="space-y-1">
                  {site.phones.map((phone) => (
                    <a
                      key={phone.href}
                      href={phone.href}
                      className="block font-sans text-sm text-paper transition hover:text-bronze-soft"
                    >
                      {phone.number}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
                <a
                  href={`mailto:${site.email}`}
                  className="font-sans text-sm text-paper transition hover:text-bronze-soft"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-line bg-ink-lift p-8 md:p-10">
              <p className="font-brand text-2xl font-medium text-paper">Precisa de orientação?</p>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-paper-mute">
                Para esclarecimentos sobre situações jurídicas na área criminal, fale diretamente
                com o escritório. Conteúdo informativo não substitui análise do caso concreto.
              </p>

              <a
                href={`${site.whatsapp.href}?text=${encodeURIComponent(site.whatsapp.message)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-bronze px-6 py-4 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-bronze-soft"
              >
                WhatsApp · {site.phones[0].number}
              </a>

              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-sm border border-line px-6 py-4 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper-mute transition hover:border-paper/30 hover:text-paper"
              >
                @{site.handle}
              </a>

              <p className="mt-8 font-sans text-[0.65rem] leading-relaxed text-paper-mute/80">
                {site.legalName} · CNPJ {site.cnpj}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
