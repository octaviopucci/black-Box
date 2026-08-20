import { transformationQuote, media, whatsappUrl } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Transformation() {
  return (
    <section id="transformacao" className="bg-mar-ink text-mar-paper">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
        <Reveal className="relative min-h-[50vh] lg:min-h-[85vh]">
          <img
            src={media.transformation}
            alt="Detalhe de reabilitação ortodôntica e estética"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-mar-ink/15 lg:bg-transparent" />
        </Reveal>

        <div className="flex flex-col justify-center px-5 py-16 md:px-10 lg:py-24">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-peach">
              Transformação
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
              {transformationQuote.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mar-paper/78">
              {transformationQuote.body}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-mar-wave">
              {transformationQuote.source}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <a
              href={whatsappUrl('Olá! Gostaria de agendar uma avaliação para transformação do meu sorriso.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit items-center gap-3 border-b border-mar-peach pb-1 text-sm uppercase tracking-[0.2em] text-mar-peach transition-colors hover:border-mar-paper hover:text-mar-paper"
            >
              Quero minha avaliação
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
