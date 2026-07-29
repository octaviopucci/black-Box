import { useMemo, useState, type ReactNode } from 'react'
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
  X,
} from 'lucide-react'
import { getPropertyBySlug, relatedProperties } from '../data/properties'
import { site, whatsappUrl } from '../data/site'
import { cleanTitle } from '../lib/filters'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { PropertyCard } from '../components/PropertyCard'
import { Reveal } from '../components/Reveal'
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
    return `Olá! Tenho interesse no imóvel Ref. ${property.reference} (${cleanTitle(property.title)}) para ${kind}. Valor à vista: ${property.cashPrice}.`
  }, [property])

  if (!property) return <NotFoundPage />

  const related = relatedProperties(property, 3)
  const gallery = property.images.length ? property.images : [property.image]
  const price = property.cashPrice || property.price
  const mapSrc =
    property.lat != null && property.lng != null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.02}%2C${property.lat - 0.015}%2C${property.lng + 0.02}%2C${property.lat + 0.015}&layer=mapnik&marker=${property.lat}%2C${property.lng}`
      : null

  return (
    <div className="min-h-screen bg-paper">
      <Navbar solid />
      <main className="pt-20">
        <div className="container-page py-6">
          <Link
            to={isRent ? '/imoveis?tx=rent' : '/imoveis?tx=sale'}
            className="inline-flex items-center gap-2 text-sm font-medium text-mute transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
        </div>

        <section className="container-page grid gap-10 pb-16 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <div className="relative overflow-hidden bg-ink">
              <div className="relative aspect-[16/11]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[active]}
                    src={gallery[active]}
                    alt={cleanTitle(property.title)}
                    initial={{ opacity: 0.3, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/92 px-3 py-2 text-xs font-semibold text-ink"
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
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden ${
                        i === active ? 'ring-2 ring-brand' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <Reveal className="mt-10">
              <div className="flex flex-wrap gap-2">
                <span className="bg-brand px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  {isRent ? 'Aluguel' : 'Venda'}
                </span>
                <span className="border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
                  Ref. {property.reference}
                </span>
                {property.profile ? (
                  <span className="border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
                    {property.profile}
                  </span>
                ) : null}
                {property.isFinanceable ? (
                  <span className="border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
                    Financiável
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] tracking-tight text-ink">
                {cleanTitle(property.title)}
              </h1>
              <p className="mt-3 flex items-start gap-2 text-mute">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {property.address}
                {property.street ? ` · ${property.street}` : ''}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {property.bedrooms ? (
                <Spec icon={<BedDouble className="h-4 w-4" />} label="Dormitórios" value={property.bedrooms} />
              ) : null}
              {property.bathrooms ? (
                <Spec icon={<Bath className="h-4 w-4" />} label="Banheiros" value={property.bathrooms} />
              ) : null}
              {property.garages ? (
                <Spec icon={<Car className="h-4 w-4" />} label="Vagas" value={property.garages} />
              ) : null}
            </div>

            {property.description ? (
              <Reveal className="mt-10">
                <h2 className="font-display text-2xl tracking-tight">Sobre o imóvel</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink/80">
                  {property.description}
                </p>
              </Reveal>
            ) : null}

            {property.areas.length ? (
              <Reveal className="mt-10">
                <h2 className="font-display text-2xl tracking-tight">Áreas</h2>
                <dl className="mt-4 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                  {property.areas.map((area) => (
                    <div key={area.title} className="bg-paper p-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                        {area.title}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-ink">{area.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            {property.characteristics.length ? (
              <Reveal className="mt-10">
                <h2 className="font-display text-2xl tracking-tight">Características</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.characteristics.map((c) => (
                    <li
                      key={`${c.title}-${c.quantity}`}
                      className="border border-line bg-white/60 px-4 py-3 text-sm text-ink/80"
                    >
                      {c.title}
                      {c.quantity != null ? (
                        <span className="ml-2 text-mute">× {c.quantity}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {mapSrc ? (
              <Reveal className="mt-10">
                <h2 className="font-display text-2xl tracking-tight">Localização</h2>
                <div className="mt-4 overflow-hidden border border-line">
                  <iframe
                    title={`Mapa — ${cleanTitle(property.title)}`}
                    src={mapSrc}
                    className="h-64 w-full sm:h-80"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-white p-6 shadow-soft sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mute">
                {isRent ? 'Valor mensal' : 'Valor à vista'}
              </p>
              <p className="mt-2 font-display text-4xl tracking-tight text-ink">
                {price}
                {isRent && price !== 'Consulte' ? (
                  <span className="ml-1 font-sans text-sm text-mute">/mês</span>
                ) : null}
              </p>
              {property.previousPrice ? (
                <p className="mt-2 text-sm text-mute line-through">{property.previousPrice}</p>
              ) : null}
              {property.condominiumPrice ? (
                <p className="mt-3 text-sm text-mute">Condomínio: {property.condominiumPrice}</p>
              ) : null}
              {property.iptu ? (
                <p className="mt-1 text-sm text-mute">IPTU: {property.iptu}</p>
              ) : null}
              {property.area ? (
                <p className="mt-4 border-t border-line pt-4 text-sm text-ink/75">{property.area}</p>
              ) : null}

              <a
                href={whatsappUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-6 w-full"
              >
                Quero este imóvel
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl(
                  `Olá! Gostaria de agendar visita ao imóvel Ref. ${property.reference}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center border border-ink/15 px-6 py-3.5 text-sm font-semibold transition hover:border-brand hover:text-brand"
              >
                Agendar visita
              </a>
              <p className="mt-4 text-xs leading-relaxed text-mute">
                Atendimento Porthal via WhatsApp. Respondemos com fotos adicionais, condições e
                próximos passos.
              </p>
            </div>
          </aside>
        </section>

        {related.length ? (
          <section className="border-t border-line bg-mist/50 py-16">
            <div className="container-page">
              <h2 className="font-display text-3xl tracking-tight">Imóveis relacionados</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <PropertyCard key={item.id} property={item} index={index} />
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
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              aria-label="Fechar"
              className="absolute right-5 top-5 text-white"
              onClick={() => setLightbox(false)}
            >
              <X className="h-7 w-7" />
            </button>
            <img
              src={gallery[active]}
              alt={cleanTitle(property.title)}
              className="max-h-[88vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Spec({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border border-line bg-white/70 px-4 py-3">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
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
      className={`absolute top-1/2 z-10 -translate-y-1/2 bg-white/90 p-2 text-ink ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
      aria-label={side === 'left' ? 'Anterior' : 'Próxima'}
    >
      {children}
    </button>
  )
}
