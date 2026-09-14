import { Link } from 'react-router-dom'
import { v2Path } from '../base'
import { extras, plans, services, whatsappUrl } from '../../data/site'
import { PriceBlock } from './PriceBlock'
import { Reveal } from './Reveal'
import { SectionIntro } from './SectionIntro'

export function PriceTables() {
  const procedureRows = services.map((item) => ({ name: item.name, price: item.price }))

  return (
    <section id="valores" className="section-pad border-t border-ink/10">
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            eyebrow="Valores"
            title="Procedimentos e planos"
            titleClassName="text-3xl sm:text-4xl"
            description="Tabela completa de atendimentos. Pagamento na sessão: Pix, cartão ou dinheiro."
            className="mb-0 max-w-2xl"
          />
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
        <Link to={v2Path('/servicos')} className="text-sm uppercase tracking-[0.18em] text-gold-deep">
          Ver procedimentos com fotos
        </Link>
      </Reveal>
    </section>
  )
}
