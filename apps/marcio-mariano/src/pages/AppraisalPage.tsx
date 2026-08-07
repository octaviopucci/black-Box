import { SiteShell } from '../components/SiteShell'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { whatsappUrl } from '../data/site'

const reasons = [
  {
    title: 'Análise técnica, não opinião de corredor',
    text: 'Encontrar o valor de um imóvel exige profundidade, dedicação e critérios. Assim como um médico não dá parecer sem exame, o corretor precisa analisar o bem com método.',
  },
  {
    title: 'Normas ABNT e credenciamento CAAVI',
    text: 'Realizamos avaliações urbanas e rurais para diversas finalidades, com base em normas técnicas da ABNT e formação específica em avaliações imobiliárias.',
  },
  {
    title: 'Centenas de laudos entregues',
    text: 'Anos de atuação com responsabilidade e segurança nos valores apresentados — para pessoas físicas e empresas.',
  },
]

const uses = [
  'Comprovação de patrimônio para instituições financeiras',
  'Auxílio em decisões judiciais com parecer paralelo',
  'Apoio à compra, venda ou inventário com base técnica',
  'Avaliação rural e urbana conforme a finalidade do pedido',
]

export function AppraisalPage() {
  return (
    <SiteShell solidNav>
      <PageHero
        eyebrow="Avaliação"
        title="Por que solicitar a avaliação do seu imóvel na Márcio Mariano?"
        description="Laudos e pareceres com método, responsabilidade e linguagem clara para quem precisa de um valor seguro."
      />

      <section className="mx-auto grid w-full max-w-shell gap-6 px-5 py-16 sm:px-8 lg:grid-cols-3">
        {reasons.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05} className="border border-line bg-snow p-6">
            <p className="font-display text-xl font-semibold text-ink">{item.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-mute">{item.text}</p>
          </Reveal>
        ))}
      </section>

      <section className="bg-blue-wash py-16">
        <div className="mx-auto grid w-full max-w-shell gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <p className="section-label">Finalidades</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
              Pareceres para o que a sua decisão exige
            </h2>
            <ul className="mt-6 space-y-3">
              {uses.map((use) => (
                <li key={use} className="flex gap-3 text-sm leading-relaxed text-mute">
                  <span className="mt-1.5 h-2 w-2 shrink-0 bg-gold" />
                  {use}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="border border-line bg-snow p-8">
            <p className="font-display text-2xl font-semibold text-ink">
              Precisa de uma avaliação por escrito?
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Empresa ou pessoa física: fale com a equipe e descreva a finalidade. Retornamos com
              orientação sobre o parecer adequado.
            </p>
            <a
              href={whatsappUrl('Olá! Gostaria de solicitar uma avaliação de imóvel.')}
              target="_blank"
              rel="noreferrer"
              className="btn-blue mt-8 w-full sm:w-auto"
            >
              Solicitar avaliação
            </a>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
