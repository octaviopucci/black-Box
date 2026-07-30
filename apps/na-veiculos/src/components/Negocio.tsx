import { Reveal } from './Reveal'
import { site, whatsappHref } from '../data/site'

export function Negocio() {
  return (
    <section
      id="negocio"
      className="relative border-b border-line px-5 py-24 sm:px-8 sm:py-28 lg:px-10"
      aria-labelledby="negocio-title"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Como fechamos
          </p>
          <h2
            id="negocio-title"
            className="display-title max-w-3xl text-[clamp(2.4rem,6vw,4rem)] text-chrome-soft"
          >
            Negócio sem atrito, do crédito à troca
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-0 border border-line md:grid-cols-2">
          {site.services.map((service, index) => (
            <Reveal
              key={service.id}
              delay={index * 0.06}
              className="group border-line p-7 transition duration-500 hover:bg-asphalt-soft/50 sm:p-9 md:odd:border-r md:[&:nth-child(-n+2)]:border-b"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">
                0{index + 1}
              </p>
              <h3 className="mt-5 font-display text-3xl uppercase tracking-[0.04em] text-chrome-soft">
                {service.title}
              </h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-chrome-mute">
                {service.line}
              </p>
              <p className="mt-5 max-w-md leading-relaxed text-chrome/70">
                {service.detail}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-4">
          <a href={whatsappHref('Olá, NA Veículos! Quero simular um financiamento.')} target="_blank" rel="noreferrer" className="cta-signal">
            Simular financiamento
          </a>
          <p className="max-w-md text-sm text-chrome-mute">
            Também no Mercado Livre / Mercado Pago — mais uma via para aprovar
            crédito e finalizar com praticidade.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
