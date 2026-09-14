import { transformationQuote, media, whatsappUrl } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Transformation() {
  return (
    <section id="transformacao" className="bg-mar-ink text-white">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
        <Reveal className="relative min-h-[50vh] lg:min-h-[90vh]">
          <img
            src={media.transformation}
            alt="Detalhe de reabilitação ortodôntica e estética"
            className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-mar-ink/20 lg:bg-gradient-to-r lg:from-transparent lg:to-mar-ink/40" />
        </Reveal>

        <div className="flex flex-col justify-center px-5 py-16 md:px-10 lg:py-24">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mar-peach">
              Resultados
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-white">
              {transformationQuote.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              {transformationQuote.body}
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
              {transformationQuote.cta}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-mar-wave">
              {transformationQuote.source}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <a
              href={whatsappUrl(
                'Olá! Gostaria de agendar uma avaliação para transformação do meu sorriso.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex w-fit items-center gap-3 border-b border-mar-peach pb-1 text-sm uppercase tracking-[0.2em] text-mar-peach transition-colors hover:border-white hover:text-white"
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
