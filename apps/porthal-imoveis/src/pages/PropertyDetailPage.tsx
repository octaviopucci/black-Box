import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { getPropertyBySlug, relatedProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { PropertyCard } from '../components/PropertyCard'
import { NotFoundPage } from './NotFoundPage'

export function PropertyDetailPage() {
  const { slug = '' } = useParams()
  const property = getPropertyBySlug(decodeURIComponent(slug))
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const isRent = property?.transaction === 'rent'
  const waMessage = useMemo(() => {
    if (!property) return site.whatsapp.message
    const kind = property.transaction === 'rent' ? 'aluguel' : 'compra'
    return `Olá! Tenho interesse no imóvel Ref. ${property.reference} (${property.title}) para ${kind}. Valor à vista: ${property.cashPrice}.`
  }, [property])

  if (!property) return <NotFoundPage />

  const related = relatedProperties(property, 3)
  const gallery = property.images.length ? property.images : [property.image]

  return (
    <div className="min-h-screen bg-paper">
      <Navbar solid />
      <main>
        <section className="relative min-h-[70svh] overflow-hidden bg-ink text-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={gallery[active]}
              src={gallery[active]}
              alt={property.title}
              initial={{ opacity: 0.2, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />

          <div className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-7xl flex-col justify-between px-5 pb-10 pt-28 sm:px-8">
            <Link
              to={isRent ? '/#alugar' : '/#comprar'}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar
            </Link>

            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-soft">
                {isRent ? 'Aluguel' : 'À vista'} · Ref. {property.reference}
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[0.95] sm:text-6xl md:text-7xl">
                {property.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-white/75">
                <MapPin className="h-4 w-4 text-brand-soft" />
                {property.address}
              </p>
            </div>
          </div>

          {gallery.length > 1 ? (
            <>
              <Nav side="left" onClick={() => setActive((i) => (i - 1 + gallery.length) % gallery.length)}>
                <ChevronLeft className="h-5 w-5" />
              </Nav>
              <Nav side="right" onClick={() => setActive((i) => (i + 1) % gallery.length)}>
                <ChevronRight className="h-5 w-5" />
              </Nav>
            </>
          ) : null}
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.2fr_0.8fr] sm:px-8">
          <div>
            {gallery.length > 1 ? (
              <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl ${i === active ? 'ring-2 ring-brand' : 'opacity-70'}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {property.bedrooms ? <Chip icon={<BedDouble className="h-4 w-4" />} label={property.bedrooms} /> : null}
              {property.bathrooms ? <Chip icon={<Bath className="h-4 w-4" />} label={property.bathrooms} /> : null}
              {property.garages ? <Chip icon={<Car className="h-4 w-4" />} label={property.garages} /> : null}
              {property.area ? <Chip label={property.area} /> : null}
            </div>

            {property.description ? (
              <div className="mt-10">
                <h2 className="font-display text-3xl">Sobre o imóvel</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-mute">
                  {property.description}
                </p>
              </div>
            ) : null}

            {property.characteristics.length > 0 ? (
              <div className="mt-10">
                <h2 className="font-display text-3xl">Características</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.characteristics.map((c) => (
                    <span key={c.title} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold">
                      {c.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="mt-8 text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              Abrir galeria completa
            </button>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] bg-ink p-6 text-white shadow-lift sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                {isRent ? 'Aluguel mensal' : 'Valor à vista'}
              </p>
              <p className="mt-2 font-sans text-4xl font-extrabold tracking-tight">
                {property.cashPrice}
                {isRent && property.cashPrice !== 'Consulte' ? (
                  <span className="ml-1 text-base font-medium text-white/50">/mês</span>
                ) : null}
              </p>
              <div className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm text-white/65">
                {property.condominiumPrice ? <p>Condomínio: {property.condominiumPrice}</p> : null}
                {property.iptu ? <p>IPTU: {property.iptu}</p> : null}
                {property.isFinanceable ? <p className="text-brand-soft">Aceita financiamento</p> : null}
              </div>
              <a
                href={whatsappUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] hover:bg-brand-deep"
              >
                WhatsApp <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={site.phones[0].href}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em]"
              >
                Ligar
              </a>
            </div>
          </aside>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-line py-16">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <h2 className="font-display text-4xl">Continue explorando</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {related.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <WhatsAppButton />

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4"
            onClick={() => setLightbox(false)}
          >
            <img
              src={gallery[active]}
              alt={property.title}
              className="max-h-[88vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Chip({ icon, label }: { icon?: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm">
      {icon ? <span className="text-brand">{icon}</span> : null}
      {label}
    </span>
  )
}

function Nav({
  side,
  onClick,
  children,
}: {
  side: 'left' | 'right'
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur ${
        side === 'left' ? 'left-4' : 'right-4'
      }`}
    >
      {children}
    </button>
  )
}
