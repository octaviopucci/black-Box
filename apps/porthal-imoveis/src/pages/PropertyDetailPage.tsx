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
  Maximize2,
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
      <main className="pt-20">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
          <Link
            to={isRent ? '/#alugar' : '/#comprar'}
            className="inline-flex items-center gap-2 text-sm font-medium text-mute transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para imóveis
          </Link>
        </div>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 pb-16 lg:grid-cols-[1.35fr_0.65fr] sm:px-8">
          <div>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-ink">
              <div className="relative aspect-[16/11]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[active]}
                    src={gallery[active]}
                    alt={property.title}
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-ink"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Ampliar
                </button>
                {gallery.length > 1 ? (
                  <>
                    <NavBtn
                      side="left"
                      onClick={() => setActive((i) => (i - 1 + gallery.length) % gallery.length)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </NavBtn>
                    <NavBtn
                      side="right"
                      onClick={() => setActive((i) => (i + 1) % gallery.length)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </NavBtn>
                  </>
                ) : null}
              </div>
              {gallery.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ${
                        i === active ? 'ring-2 ring-brand' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
                {isRent ? 'Locação' : 'Venda'} · Ref. {property.reference}
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                {property.title}
              </h1>
              <p className="mt-3 flex items-start gap-2 text-mute">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {property.address}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-mute">
                {property.bedrooms ? (
                  <Spec icon={<BedDouble className="h-4 w-4" />} label={property.bedrooms} />
                ) : null}
                {property.bathrooms ? (
                  <Spec icon={<Bath className="h-4 w-4" />} label={property.bathrooms} />
                ) : null}
                {property.garages ? (
                  <Spec icon={<Car className="h-4 w-4" />} label={property.garages} />
                ) : null}
                {property.area ? <Spec label={property.area} /> : null}
              </div>

              {property.description ? (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-semibold text-ink">Sobre o imóvel</h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-mute">
                    {property.description}
                  </p>
                </div>
              ) : null}

              {property.areas.length > 0 ? (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-semibold text-ink">Áreas</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {property.areas.map((a) => (
                      <div key={`${a.title}-${a.value}`} className="border-t border-line pt-3">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-mute">{a.title}</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{a.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {property.characteristics.length > 0 ? (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-semibold text-ink">Características</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.characteristics.map((c) => (
                      <span
                        key={c.title}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink"
                      >
                        {c.title}
                        {c.quantity ? ` · ${c.quantity}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mute">
                {isRent ? 'Valor do aluguel' : 'Valor à vista'}
              </p>
              <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
                {property.cashPrice}
                {isRent && property.cashPrice !== 'Consulte' ? (
                  <span className="ml-1 text-base font-sans font-medium text-mute">/mês</span>
                ) : null}
              </p>
              {!isRent &&
              property.totalPrice !== property.cashPrice &&
              property.totalPrice !== 'Consulte' ? (
                <p className="mt-2 text-sm text-mute">Total: {property.totalPrice}</p>
              ) : null}

              <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-mute">
                {property.condominiumPrice ? (
                  <p>
                    Condomínio:{' '}
                    <span className="font-semibold text-ink">{property.condominiumPrice}</span>
                  </p>
                ) : null}
                {property.iptu ? (
                  <p>
                    IPTU: <span className="font-semibold text-ink">{property.iptu}</span>
                  </p>
                ) : null}
                {property.isFinanceable ? (
                  <p className="font-medium text-sale">Aceita financiamento</p>
                ) : null}
                {property.profile ? <p>Perfil: {property.profile}</p> : null}
                {property.situation ? <p>Situação: {property.situation}</p> : null}
              </div>

              <a
                href={whatsappUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
              >
                Falar no WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={site.phones[0].href}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                Ligar {site.phones[0].label}
              </a>
            </div>
          </aside>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-line bg-white/50 py-16">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <h2 className="font-display text-3xl font-semibold text-ink">Você também pode gostar</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} variant={p.transaction} />
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 text-sm font-semibold text-white"
              onClick={() => setLightbox(false)}
            >
              Fechar
            </button>
            <img
              src={gallery[active]}
              alt={property.title}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Spec({ icon, label }: { icon?: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5">
      {icon ? <span className="text-brand">{icon}</span> : null}
      {label}
    </span>
  )
}

function NavBtn({
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
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55 ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      {children}
    </button>
  )
}
