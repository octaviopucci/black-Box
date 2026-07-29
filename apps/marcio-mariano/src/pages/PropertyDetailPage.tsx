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
    return `Olá! Tenho interesse no imóvel Ref. ${property.reference} (${property.title}) para ${kind}. Valor: ${property.price}.`
  }, [property])

  if (!property) return <NotFoundPage />

  const related = relatedProperties(property, 3)
  const gallery = property.images.length ? property.images : [property.image].filter(Boolean)

  return (
    <div className="min-h-screen bg-chalk">
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
            <div className="relative overflow-hidden bg-navy">
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
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/90 px-3 py-2 text-xs font-semibold text-navy"
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
                      key={src + i}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 ${
                        i === active ? 'border-gold' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
                {isRent ? 'Locação' : 'Venda'} · Ref. {property.reference}
              </p>
              <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-navy">
                {property.fullTitle}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-mute">
                <MapPin className="h-4 w-4 text-brand" />
                {property.address}
              </p>

              <div className="mt-6 flex flex-wrap gap-6 border-y border-line py-5 text-sm text-navy">
                {property.bedroomCount ? (
                  <Spec icon={<BedDouble className="h-4 w-4" />} label={`${property.bedrooms} dormitórios`} />
                ) : null}
                {property.bathroomCount ? (
                  <Spec icon={<Bath className="h-4 w-4" />} label={`${property.bathrooms} banheiros`} />
                ) : null}
                {property.garageCount ? (
                  <Spec
                    icon={<Car className="h-4 w-4" />}
                    label={`${property.garages} vaga${property.garageCount > 1 ? 's' : ''}`}
                  />
                ) : null}
                <Spec icon={<span className="text-xs font-bold">T</span>} label={property.profile} />
              </div>

              <div className="mt-8 prose-none">
                <h2 className="font-display text-2xl font-semibold text-navy">Sobre o imóvel</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-mute">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-white p-6 shadow-soft sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mute">
                {isRent ? 'Valor do aluguel' : 'Valor à vista'}
              </p>
              <p className="mt-2 font-display text-4xl font-semibold text-navy">{property.price}</p>
              <p className="mt-2 text-sm text-mute">{property.city} · {property.situation}</p>

              <a
                href={whatsappUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand"
              >
                Tenho interesse
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:+5515997325626`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-navy transition hover:border-brand hover:text-brand"
              >
                Ligar agora
              </a>

              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-mute">
                <li>Atendimento humanizado desde 1955</li>
                <li>Orientação completa na documentação</li>
                <li>Resposta rápida no WhatsApp</li>
              </ul>
            </div>
          </aside>
        </section>

        {related.length ? (
          <section className="border-t border-line bg-white/40 py-16">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <h2 className="font-display text-3xl font-semibold text-navy">Você também pode gostar</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <img
              src={gallery[active]}
              alt={property.title}
              className="max-h-[90vh] max-w-[95vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Spec({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-medium">
      <span className="text-brand">{icon}</span>
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
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-navy ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
      aria-label={side === 'left' ? 'Anterior' : 'Próxima'}
    >
      {children}
    </button>
  )
}
