import { extras, plans, services, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Services() {
  return (
    <section id="servicos" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">Atendimento</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl sm:text-5xl">
            O serviço que o seu olhar pede agora.
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-ash-line border-y border-ash-line">
          {services.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.03}>
              <article className="grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                <div>
                  <h3 className="font-display text-2xl text-ink">{item.name}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">{item.text}</p>
                </div>
                <p className="font-display text-2xl text-rose-deep">{item.price}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-ash">Epilação</p>
            <ul className="mt-4 space-y-3">
              {extras.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 text-sm text-ink/75">
                  <span>{item.name}</span>
                  <span className="text-rose-deep">{item.price}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[11px] uppercase tracking-[0.28em] text-ash">Planos</p>
            <ul className="mt-4 space-y-3">
              {plans.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 text-sm text-ink/75">
                  <span>{item.name}</span>
                  <span className="text-rose-deep">{item.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ink/45">
              Combos válidos por 30 dias, sem acumular e sem transferir. Pagamento na primeira sessão.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <a href={whatsappUrl()} className="cta-ink">
            Quero agendar meu horário
          </a>
        </Reveal>
      </div>
    </section>
  )
}
