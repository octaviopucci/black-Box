import { Reveal } from './Reveal'
import { asset, whatsappUrl } from '../data/site'

export function Combos() {
  return (
    <section id="combos" className="relative overflow-hidden border-y border-line px-5 py-24 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 flex animate-marquee gap-10 whitespace-nowrap opacity-[0.06]"
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <p key={i} className="font-display text-6xl font-semibold tracking-tight sm:text-7xl">
            COMBO DA ALEGRIA · PULA-PULA · PISCINA DE BOLINHAS · DIVERSÃO GARANTIDA ·&nbsp;
          </p>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <img
            src={asset('moments/ig-01.jpg')}
            alt="Combo pula-pula e piscina de bolinhas G&L Locações"
            className="aspect-[5/4] w-full object-cover"
            loading="lazy"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Combos</p>
          <h2 className="display-title mt-4 text-3xl sm:text-5xl">
            Combo da Alegria.
            <span className="block text-sun">Duas atrações. Uma festa completa.</span>
          </h2>
          <p className="mt-5 max-w-md text-paper/70">
            Pula-pula + piscina de bolinhas para a criançada brincar do começo ao fim. Ideal para
            aniversários em Capão Bonito e região quando você quer variedade sem complicar a montagem.
          </p>
          <a
            href={whatsappUrl(
              'Olá, G&L Locações! Quero orçar o Combo da Alegria (pula-pula + piscina de bolinhas).',
            )}
            className="cta-sun mt-8"
          >
            Quero o Combo da Alegria
          </a>
        </Reveal>
      </div>
    </section>
  )
}
