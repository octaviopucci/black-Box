import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { saleProperties, rentProperties } from '../data/properties'

const cities = Array.from(
  new Set(
    [...saleProperties, ...rentProperties].map((p) => {
      const part = p.address.split('-').pop()?.trim() || ''
      return part.replace(/,.*/, '').trim()
    }),
  ),
).filter(Boolean)

function pickImage(list: typeof saleProperties, prefer: RegExp[], fallbackIndex = 0) {
  for (const re of prefer) {
    const hit = list.find((p) => re.test(p.title) && p.image)
    if (hit?.image) return hit.image
  }
  return list[fallbackIndex]?.image ?? list[0]?.image ?? ''
}

const buyImage = pickImage(
  saleProperties,
  [/s[ií]tio/i, /ch[aá]cara/i, /casa/i, /sobrado/i],
  1,
)
const rentImage = pickImage(
  rentProperties,
  [/comercial/i, /sala/i, /apartamento/i, /casa/i],
  0,
)

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
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.28em]"
          >
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
    <section id="colecao" className="relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(196,52,42,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-brand">Dois caminhos</p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.92] text-ink">
            Escolha como entrar no portfólio
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <PathwayPortal
            href="#comprar"
            eyebrow="Comprar"
            title="Patrimônio à vista"
            text="Casas, sobrados, sítios e áreas com valores claros e curadoria de alto padrão."
            countLabel={`${saleProperties.length} imóveis`}
            image={buyImage}
            accent="brand"
          />
          <PathwayPortal
            href="#alugar"
            eyebrow="Alugar"
            title="Morar ou empreender"
            text="Residencial e comercial para locação — detalhes completos sem sair do site."
            countLabel={`${rentProperties.length} imóveis`}
            image={rentImage}
            accent="ink"
          />
        </div>
      </div>
    </section>
  )
}

function PathwayPortal({
  href,
  eyebrow,
  title,
  text,
  countLabel,
  image,
  accent,
}: {
  href: string
  eyebrow: string
  title: string
  text: string
  countLabel: string
  image: string
  accent: 'brand' | 'ink'
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block overflow-hidden rounded-[1.75rem] bg-ink shadow-lift sm:rounded-[2rem]"
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:aspect-[4/5]">
        <motion.img
          src={image}
          alt=""
          loading="lazy"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover transition duration-[1100ms] ease-luxury group-hover:scale-105"
        />
        {/* Atmospheric depth — keeps photo readable without putting copy on it */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.15)_0%,transparent_35%,rgba(10,9,8,0.55)_100%)]" />
        <div
          className={`absolute inset-0 opacity-70 mix-blend-multiply transition duration-700 group-hover:opacity-90 ${
            accent === 'brand'
              ? 'bg-[radial-gradient(ellipse_at_top_left,rgba(196,52,42,0.55),transparent_55%)]'
              : 'bg-[radial-gradient(ellipse_at_top_right,rgba(10,9,8,0.35),transparent_50%)]'
          }`}
        />

        <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:border-brand group-hover:bg-brand sm:bottom-7 sm:right-7">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>

      <div
        className={`relative border-t border-white/10 px-6 py-7 text-white sm:px-8 sm:py-8 ${
          accent === 'brand' ? 'bg-brand' : 'bg-ink'
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl"
        />
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">
          {eyebrow} · {countLabel}
        </p>
        <h3 className="mt-3 max-w-md font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95]">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{text}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]">
          Entrar na seleção
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.a>
  )
}
