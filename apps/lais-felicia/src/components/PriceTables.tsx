import { Link } from 'react-router-dom'
import { extras, plans, services, whatsappUrl } from '../data/site'
import { PriceBlock } from './PriceBlock'
import { Reveal } from './Reveal'

export function PriceTables() {
  const procedureRows = services.map((item) => ({ name: item.name, price: item.price }))

  return (
    <section id="valores" className="section-pad border-t border-ink/10">
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Valores</p>
          <h2 className="display-title mt-2 text-3xl sm:text-4xl">Procedimentos e planos</h2>
          <p className="mt-3 max-w-xl text-sm text-ink-mute">
            Tabela completa de atendimentos. Pagamento na sessão: Pix, cartão ou dinheiro.
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-2">
        <PriceBlock
          eyebrow="Sobrancelhas"
          title="Procedimentos"
          rows={procedureRows}
          footer={
            <a href={whatsappUrl()} className="cta-gold">
              Agendar procedimento
            </a>
          }
        />
        <div className="space-y-8">
          <PriceBlock eyebrow="Complementos" title="Epilação" rows={extras} delay={0.06} />
          <PriceBlock
            eyebrow="Economia"
            title="Planos"
            rows={plans}
            note="Combos válidos por 30 dias, sem acumular e sem transferir. Pagamento na primeira sessão."
            delay={0.1}
            footer={
              <a href={whatsappUrl()} className="cta-gold">
                Quero um plano
              </a>
            }
          />
        </div>
      </div>

      <Reveal delay={0.12} className="mx-auto mt-10 max-w-6xl text-center sm:text-left">
        <Link to="/servicos" className="text-sm uppercase tracking-[0.18em] text-gold-deep">
          Ver procedimentos com fotos
        </Link>
      </Reveal>
    </section>
  )
}
