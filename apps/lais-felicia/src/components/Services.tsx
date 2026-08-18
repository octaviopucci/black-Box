import { asset, extras, plans, serviceHighlights, services, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Services() {
  return (
    <section id="servicos" className="bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow text-rose-soft">Atendimento</p>
          <h2 className="display-title mt-4 max-w-3xl text-4xl sm:text-6xl">
            Serviços especializados para o seu olhar.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceHighlights.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <a
                href={whatsappUrl()}
                className="group relative block min-h-[340px] overflow-hidden"
              >
                <img
                  src={asset(item.image)}
                  alt={item.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/15" />
                <div className="relative flex h-full min-h-[340px] flex-col justify-end p-6">
                  <p className="font-display text-3xl">{item.name}</p>
                  <p className="mt-2 text-sm text-paper/65">{item.line}</p>
                  <p className="mt-4 font-display text-2xl text-rose-soft">{item.price}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 divide-y divide-paper/10 border-y border-paper/10">
          {services.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.03}>
              <article className="grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                <div>
                  <h3 className="font-display text-2xl">{item.name}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/55">{item.text}</p>
                </div>
                <p className="font-display text-2xl text-rose-soft">{item.price}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-paper/40">Epilação</p>
            <ul className="mt-5 space-y-3">
              {extras.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 text-sm text-paper/75">
                  <span>{item.name}</span>
                  <span className="text-rose-soft">{item.price}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[11px] uppercase tracking-[0.28em] text-paper/40">Planos</p>
            <ul className="mt-5 space-y-3">
              {plans.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 text-sm text-paper/75">
                  <span>{item.name}</span>
                  <span className="text-rose-soft">{item.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-paper/40">
              Combos válidos por 30 dias, sem acumular e sem transferir. Pagamento na primeira sessão.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <a href={whatsappUrl()} className="cta-rose">
            Quero agendar meu horário
          </a>
        </Reveal>
      </div>
    </section>
  )
}
