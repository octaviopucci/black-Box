import { ArrowUpRight } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'
import { BrandMark } from './BrandMark'

export function Threshold() {
  return (
    <section
      id="orcar"
      className="relative overflow-hidden border-t border-line px-5 py-28 sm:px-8 sm:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,149,106,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <BrandMark className="mx-auto h-14 w-14" />
          <p className="eyebrow mt-8 justify-center">
            <span className="h-px w-8 bg-gold" />
            Limiar
            <span className="h-px w-8 bg-gold" />
          </p>
          <h2 className="mt-6 font-brand text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.9] tracking-[0.06em]">
            Sua próxima marca
            <br />
            <span className="text-gold">já te espera.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash sm:text-lg">
            Envie a ideia, a região do corpo e referências. Retorno com leitura
            honesta do projeto e orçamento pelo WhatsApp.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href={whatsappUrl()} className="cta-gold" data-cursor>
            Orçar pelo WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href={site.phone.href} className="cta-ghost" data-cursor>
            {site.phone.label}
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-10 text-[11px] uppercase tracking-[0.28em] text-ash">
            {site.studio} · Prioridade para coberturas, reformas e preto & cinza
          </p>
        </Reveal>
      </div>
    </section>
  )
}
