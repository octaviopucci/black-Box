import { site, whatsappUrl } from '@/data/site'
import { Eyebrow, Reveal } from '@/components/Reveal'

export function Contact() {
  return (
    <section id="contato" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <Eyebrow>Contato</Eyebrow>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] text-ink">
              Fale com quem explica a lei de forma clara
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mute md:text-lg">
              {site.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-sm bg-ink px-7 py-3.5 text-[13px] font-bold uppercase tracking-[0.2em] text-paper transition hover:bg-navy"
              >
                WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-sm border border-ink/15 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-gold-deep hover:text-gold-deep"
              >
                Instagram
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="space-y-8 border-l border-line pl-8">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                  Escritório
                </dt>
                <dd className="mt-2 text-lg leading-relaxed text-ink">{site.address.full}</dd>
                <dd className="mt-2">
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-navy underline-offset-4 hover:underline"
                  >
                    Ver no mapa
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                  Razão social
                </dt>
                <dd className="mt-2 text-lg text-ink">{site.legalName}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                  Instagram
                </dt>
                <dd className="mt-2">
                  <a
                    href={site.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-ink underline-offset-4 hover:text-gold-deep hover:underline"
                  >
                    @{site.instagram.handle}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
