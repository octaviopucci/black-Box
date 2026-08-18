import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Scale, Home, KeyRound } from 'lucide-react'
import { featuredProperties, properties, rentProperties, saleProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'
import { PropertyCard } from './PropertyCard'
import { Reveal } from './Reveal'

export function FeaturedStrip() {
  const list = featuredProperties.slice(0, 6)
  return (
    <section className="mx-auto w-full max-w-shell px-5 py-20 sm:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Destaques</p>
          <h2 className="mt-2 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-tight text-ink">
            Imóveis que pedem atenção
          </h2>
        </div>
        <Link to="/imoveis" className="inline-flex items-center gap-2 text-sm font-semibold text-blue">
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
    </section>
  )
}

export function TrustBand() {
  const items = [
    { icon: ShieldCheck, label: `Desde ${site.since}`, text: 'Tradição familiar Santos Mariano' },
    { icon: Scale, label: 'ABNT + CAAVI', text: 'Avaliações técnicas com responsabilidade' },
    { icon: KeyRound, label: 'Locação segura', text: 'Cadastro, vistoria e administração' },
    { icon: Home, label: `${properties.length}+ imóveis`, text: 'Portfólio ativo na região' },
  ]
  return (
    <section className="border-y border-line bg-snow">
      <div className="mx-auto grid w-full max-w-shell gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.05} className="bg-snow px-6 py-8">
            <item.icon className="h-6 w-6 text-blue" />
            <p className="mt-4 font-display text-lg font-semibold text-ink">{item.label}</p>
            <p className="mt-1 text-sm text-mute">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function RegionsMarquee() {
  const cities = [...site.cities, ...site.cities]
  return (
    <section className="overflow-hidden py-10">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-5 text-sm font-semibold uppercase tracking-[0.22em] text-blue/70">
        {cities.map((c, i) => (
          <span key={`${c}-${i}`} className="inline-flex items-center gap-10">
            {c}
            <span className="text-gold">●</span>
          </span>
        ))}
      </div>
    </section>
  )
}

export function SplitInventory() {
  return (
    <section className="mx-auto grid w-full max-w-shell gap-6 px-5 py-16 sm:px-8 lg:grid-cols-2">
      <Reveal className="relative overflow-hidden bg-blue-deep p-8 text-white sm:p-10">
        <img
          src={`${import.meta.env.BASE_URL}hero-2.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative">
          <p className="section-label !text-gold">Comprar</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            {saleProperties.length} imóveis à venda
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Casas, comerciais e oportunidades para quem busca patrimônio com orientação local.
          </p>
          <Link to="/imoveis?tipo=venda" className="btn-primary mt-8">
            Ver vendas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.08} className="border border-line bg-snow p-8 sm:p-10">
        <p className="section-label">Alugar</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          {rentProperties.length} imóveis para locação
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
          Residenciais e pontos comerciais com processo claro e atendimento dedicado a locação.
        </p>
        <Link to="/imoveis?tipo=aluguel" className="btn-blue mt-8">
          Ver aluguéis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  )
}

export function ServicesPreview() {
  return (
    <section className="bg-blue-wash py-20">
      <div className="mx-auto w-full max-w-shell px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="section-label">Serviços</p>
          <h2 className="mt-2 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-tight text-ink">
            Muito além de anunciar um imóvel
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mute">
            Da avaliação técnica à administração do patrimônio, cada serviço existe para reduzir
            risco e aumentar a confiança na decisão.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.04} className="border border-line bg-snow p-6">
              <p className="font-display text-xl font-semibold text-ink">{service.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-mute">{service.description}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-blue">
            Conhecer serviços
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export function LegacyTeaser() {
  return (
    <section className="mx-auto grid w-full max-w-shell items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
      <Reveal>
        <img
          src={`${import.meta.env.BASE_URL}brand/cta-bg.jpg`}
          alt="Escritório e atuação Márcio Mariano"
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
      </Reveal>
      <Reveal delay={0.08}>
        <p className="section-label">Legado</p>
        <h2 className="mt-2 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-tight text-ink">
          Uma família portuguesa que fez de Capão Bonito o seu território
        </h2>
        <p className="mt-5 text-base leading-relaxed text-mute">{site.about[0]}</p>
        <p className="mt-4 text-base leading-relaxed text-mute">{site.about[2]}</p>
        <Link to="/empresa" className="btn-blue mt-8">
          Nossa história
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  )
}

export function OwnerCta() {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <Reveal className="relative mx-auto max-w-shell overflow-hidden bg-blue px-8 py-12 text-white sm:px-12 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(249,195,34,0.25),transparent_45%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <p className="section-label !text-gold">Proprietários</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold tracking-tight">
              Quer vender ou alugar com quem já conhece a região?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
              Anuncie conosco e conte com avaliação, divulgação e acompanhamento até o fechamento.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/anunciar" className="btn-primary">
              Anunciar imóvel
            </Link>
            <a
              href={whatsappUrl('Olá! Quero anunciar meu imóvel com a Márcio Mariano.')}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
