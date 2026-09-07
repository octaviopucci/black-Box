import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { whatsappUrl } from '../../data/site'

export function FinalCta() {
  return (
    <section id="contato" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <div className="relative overflow-hidden border border-white/10 bg-[#09090b] px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
            <div className="bb-noise" />
            <div className="pointer-events-none absolute inset-0 bb-grid-bg opacity-30" />
            <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative max-w-3xl">
              <h2 className="bb-display text-[clamp(2.4rem,7vw,5.5rem)]">
                Você imagina.
                <br />
                Nós construímos.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                Tem uma ideia, processo ou problema que pode virar um sistema?
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href={whatsappUrl()} arrow target="_blank" rel="noreferrer">
                  Começar um projeto
                </Button>
                <Button
                  href={whatsappUrl('Olá, Black Box. Quero falar pelo WhatsApp.')}
                  variant="secondary"
                  arrow
                  target="_blank"
                  rel="noreferrer"
                >
                  Falar pelo WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
