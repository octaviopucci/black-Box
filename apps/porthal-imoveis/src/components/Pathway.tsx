import { motion } from 'framer-motion'
import { saleProperties, rentProperties } from '../data/properties'

const cities = Array.from(
  new Set(
    [...saleProperties, ...rentProperties].map((p) => {
      const part = p.address.split('-').pop()?.trim() || ''
      return part.replace(/,.*/, '').trim()
    }),
  ),
).filter(Boolean)

export function MarqueeStrip() {
  const items = [
    'Imóvel moeda forte',
    `${saleProperties.length} à venda`,
    `${rentProperties.length} para alugar`,
    ...cities.slice(0, 6),
    'Valores à vista',
    'Capão Bonito e região',
  ]
  const loop = [...items, ...items]

  return (
    <section className="overflow-hidden border-y border-ink/10 bg-ink py-4 text-white">
      <div className="marquee gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.28em]">
            {item}
            <span className="text-brand">✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}

export function Pathway() {
  return (
    <section id="colecao" className="mx-auto grid w-full max-w-7xl gap-4 px-5 py-16 sm:px-8 lg:grid-cols-2">
      <PathwayPanel
        href="#comprar"
        eyebrow="Comprar"
        title="Patrimônio à vista"
        text="Casas, sobrados, sítios e áreas com valores claros e curadoria de alto padrão."
        tone="brand"
      />
      <PathwayPanel
        href="#alugar"
        eyebrow="Alugar"
        title="Morar ou empreender"
        text="Residencial e comercial para locação — detalhes completos sem sair do site."
        tone="ink"
      />
    </section>
  )
}

function PathwayPanel({
  href,
  eyebrow,
  title,
  text,
  tone,
}: {
  href: string
  eyebrow: string
  title: string
  text: string
  tone: 'brand' | 'ink'
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative min-h-[320px] overflow-hidden rounded-[2rem] p-8 text-white sm:min-h-[380px] sm:p-10 ${
        tone === 'brand' ? 'bg-brand' : 'bg-ink'
      }`}
    >
      <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl transition duration-700 group-hover:scale-125" />
      <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/70">{eyebrow}</p>
      <h2 className="mt-6 max-w-sm font-display text-5xl leading-[0.95] sm:text-6xl">{title}</h2>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-white/75">{text}</p>
      <span className="mt-10 inline-flex text-xs font-bold uppercase tracking-[0.22em]">
        Entrar na seleção →
      </span>
    </motion.a>
  )
}
