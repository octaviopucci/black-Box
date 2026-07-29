import { ArrowUpRight } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

const items = [
  {
    title: 'Tradição desde 1955',
    text: 'Negócios com ética e clareza — de geração em geração.',
  },
  {
    title: 'Atendimento humano',
    text: 'Plantão de vendas e equipe de locação no WhatsApp.',
  },
  {
    title: 'Assessoria completa',
    text: 'Da busca à documentação, com segurança para as duas partes.',
  },
]

export function Proof() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid items-end gap-10 border-y border-line py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
              Por que Márcio Mariano
            </p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-tight text-navy">
              Confiança que se mede em décadas — e em cada fechamento.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <p className="font-display text-lg font-semibold text-navy">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="bg-navy p-7 text-white sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft">
            Pronto para decidir?
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight">
            Conte o que você busca — nós encontramos o caminho.
          </h3>
          <p className="mt-3 text-sm text-white/65">
            {site.hours.weekdays}. Sábados e feriados com plantão de vendas.
          </p>
          <a
            href={whatsappUrl('Olá! Quero ajuda para encontrar um imóvel.')}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Falar com um corretor
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
