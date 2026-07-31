import { ArrowUpRight, Check, MapPin, MessageCircle } from 'lucide-react'
import { Shell } from '../components/Shell'
import { Reveal } from '../components/Reveal'
import { asset, site, whatsappUrl } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

export function AgendarPage() {
  usePageMeta(site.seo.agendar.title, site.seo.agendar.description)

  const steps = [
    'Toque em Agendar no WhatsApp',
    'Conte o que você está sentindo',
    'Receba orientação e horário marcado',
  ]

  return (
    <Shell>
      <section className="relative overflow-hidden bg-wine-deep px-5 pb-16 pt-28 text-cream sm:px-8 sm:pb-24 sm:pt-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal immediate>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">
              Agendar
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Um toque. Uma conversa. Um horário.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-cream/70">
              Sem formulário longo. Sem espera em fila digital. Você fala comigo pelo WhatsApp e
              marcamos a avaliação na Clínica Matsubara.
            </p>
            <a
              href={whatsappUrl()}
              className="cta-signal mt-8 text-base"
              data-cursor
            >
              <MessageCircle className="h-5 w-5" />
              Abrir WhatsApp agora
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-sm text-cream/45">{site.phone.label}</p>
          </Reveal>

          <Reveal immediate delay={0.1} className="overflow-hidden rounded-[2rem]">
            <img
              src={asset('space/presenca.jpg')}
              alt="Dra. Danielle Matsubara"
              className="aspect-[5/4] w-full object-cover object-top"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="display-title text-3xl text-ink sm:text-4xl">Como funciona</h2>
          </Reveal>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step} delay={0.06 * i}>
                <li className="border-t border-line pt-5">
                  <p className="font-display text-3xl text-wine">0{i + 1}</p>
                  <p className="mt-3 text-base font-medium text-ink">{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream-soft px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="display-title text-3xl text-ink">Perguntas frequentes</h2>
            <div className="mt-8 space-y-6">
              {site.faqs.map((faq) => (
                <div key={faq.q} className="border-t border-line pt-5">
                  <h3 className="font-semibold text-ink">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-wine-deep px-6 py-8 text-cream sm:px-8 sm:py-10">
              <p className="font-display text-3xl">Você será recebida com presença.</p>
              <ul className="mt-6 space-y-3 text-sm text-cream/70">
                {[
                  'Horário marcado',
                  'Ambiente climatizado',
                  'Escuta antes da conduta',
                  site.addressShort,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-soft" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={whatsappUrl()} className="cta-signal mt-8 w-full justify-center" data-cursor>
                Quero agendar
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-cream/50 transition hover:text-rose-soft"
              >
                <MapPin className="h-4 w-4" />
                Ver localização
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  )
}
