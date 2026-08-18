import { whatsappUrl, why } from '../data/site'
import { Reveal } from './Reveal'

export function Why() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Por que a Laís</p>
          <h2 className="display-title mt-4 max-w-xl text-4xl sm:text-5xl">
            Confiança que se vê de perto.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {why.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <p className="font-display text-3xl text-rose">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/62">{item.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <a href={whatsappUrl()} className="cta-ink">
            Quero agendar meu horário
          </a>
        </Reveal>
      </div>
    </section>
  )
}
