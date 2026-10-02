import { site } from '@/data/site'
import { Eyebrow, Reveal } from '@/components/Reveal'

export function Approach() {
  return (
    <section id="orientacoes" className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-[0.9fr_1.1fr] md:items-end md:px-8">
        <Reveal>
          <Eyebrow light>Orientação</Eyebrow>
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-tight">
            Direito trabalhista sem distância
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="space-y-8 border-l border-gold/30 pl-8">
            {site.approach.map((line, index) => (
              <li key={line} className="relative">
                <span
                  className="absolute -left-[calc(2rem+3px)] top-2 h-1.5 w-1.5 rounded-full bg-gold"
                  aria-hidden
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-soft/80">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 text-lg leading-relaxed text-paper/88 md:text-xl">{line}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm leading-relaxed text-paper/55">
            Conteúdo baseado nas publicações oficiais de @{site.instagram.handle}. Cada
            situação demanda avaliação jurídica individualizada.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
