import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { whatsappUrl } from '../data/site'
import { journey } from '../data/site'

export function Protocol() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-fern/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-8 bg-gold" aria-hidden />
              Assinatura
            </p>
            <h2 className="display-title mt-2 text-[clamp(2.4rem,5.5vw,4.2rem)] text-ink">
              Protocolo <span className="italic text-fern">Harmonie</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
              Acompanhamento integral de modulação hormonal e bem-estar — com avaliação precisa,
              plano personalizado e suporte contínuo para energia, composição, libido e qualidade de
              vida.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink/80">
              {[
                'Avaliação hormonal completa',
                'Plano personalizado e contínuo',
                'Foco em equilíbrio e autoestima',
                'Condução médica especializada',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={whatsappUrl(
                'Olá! Vim pelo site da Clínica Harmonie e quero saber mais sobre o Protocolo Harmonie.',
              )}
              className="cta-ink mt-10"
              data-cursor
            >
              Quero o Protocolo Harmonie
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-fern/40 to-transparent sm:left-8" />
            <ol className="space-y-8">
              {journey.map((step, i) => (
                <Reveal key={step.step} delay={0.1 * i}>
                  <li className="relative pl-14 sm:pl-16">
                    <span className="absolute left-3 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-gold/50 bg-porcelain font-display text-sm text-gold-deep sm:left-4">
                      {step.step}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{step.description}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
