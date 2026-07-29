import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
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
  X,
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

  useEffect(() => {
    setActive(0)
    setLightbox(false)
  }, [slug])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') setActive((i) => i - 1)
      if (e.key === 'ArrowRight') setActive((i) => i + 1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  if (!property) return <NotFoundPage />

  const related = relatedProperties(property, 3)
  const gallery = property.images.length ? property.images : [property.image]
  const safeIndex = ((active % gallery.length) + gallery.length) % gallery.length
  const current = gallery[safeIndex]

  function prev() {
    setActive((i) => i - 1)
  }
  function next() {
    setActive((i) => i + 1)
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar solid />
      <main className="pt-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Link
            to={isRent ? '/#alugar' : '/#comprar'}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-mute transition hover:text-brand"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>

          {/* Photo stage: fit viewport, no title/price/text on the image */}
          <section className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#0c0b0a] sm:rounded-[1.75rem]">
            <div className="relative flex h-[min(70svh,720px)] items-center justify-center sm:h-[min(74svh,820px)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={current}
                  alt={`Foto ${safeIndex + 1} — ${property.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="max-h-full max-w-full cursor-zoom-in object-contain p-2 sm:p-4"
                  onClick={() => setLightbox(true)}
                />
              </AnimatePresence>

              {gallery.length > 1 ? (
                <>
                  <GalleryNav side="left" onClick={prev} />
                  <GalleryNav side="right" onClick={next} />
                </>
              ) : null}
            </div>

            {gallery.length > 1 ? (
              <div className="border-t border-white/10 bg-black/50">
                <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  <span>Galeria</span>
                  <span>
                    {safeIndex + 1} / {gallery.length}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto px-3 pb-3">
                  {gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      className={`h-[4.25rem] w-[5.75rem] shrink-0 overflow-hidden rounded-lg transition ${
                        i === safeIndex
                          ? 'ring-2 ring-brand ring-offset-1 ring-offset-[#0c0b0a]'
                          : 'opacity-55 hover:opacity-90'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="mt-10 grid gap-8 pb-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
                {isRent ? 'Aluguel' : 'À vista'} · Ref. {property.reference}
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[0.98] text-ink sm:text-5xl md:text-6xl">
                {property.title}
              </h1>
              <p className="mt-4 flex items-start gap-2 text-mute">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {property.address}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {property.bedrooms ? <Chip icon={<BedDouble className="h-4 w-4" />} label={property.bedrooms} /> : null}
                {property.bathrooms ? <Chip icon={<Bath className="h-4 w-4" />} label={property.bathrooms} /> : null}
                {property.garages ? <Chip icon={<Car className="h-4 w-4" />} label={property.garages} /> : null}
                {property.area ? <Chip label={property.area} /> : null}
              </div>

              {property.description ? (
                <div className="mt-10">
                  <h2 className="font-display text-3xl text-ink">Sobre o imóvel</h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-mute">
                    {property.description}
                  </p>
                </div>
              ) : null}

              {property.areas.length > 0 ? (
                <div className="mt-10">
                  <h2 className="font-display text-3xl text-ink">Áreas</h2>
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
                  <h2 className="font-display text-3xl text-ink">Características</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.characteristics.map((c) => (
                      <span
                        key={c.title}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                      >
                        {c.title}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
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
                  {property.profile ? <p>Perfil: {property.profile}</p> : null}
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
                  Ligar {site.phones[0].label}
                </a>
              </div>
            </aside>
          </section>
        </div>

        {related.length > 0 ? (
          <section className="border-t border-line bg-white/40 py-16">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
              <h2 className="font-display text-4xl text-ink">Continue explorando</h2>
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
            className="fixed inset-0 z-[70] flex flex-col bg-black"
          >
            <div className="flex items-center justify-between px-4 py-4 text-white sm:px-6">
              <p className="text-sm font-medium text-white/70">
                {safeIndex + 1} / {gallery.length}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-white/10"
              >
                <X className="h-4 w-4" /> Fechar
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-3 pb-6">
              <img
                src={current}
                alt={`Foto ${safeIndex + 1} — ${property.title}`}
                className="max-h-[calc(100svh-7rem)] max-w-full object-contain"
              />
              {gallery.length > 1 ? (
                <>
                  <GalleryNav side="left" onClick={prev} />
                  <GalleryNav side="right" onClick={next} />
                </>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function Chip({ icon, label }: { icon?: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink">
      {icon ? <span className="text-brand">{icon}</span> : null}
      {label}
    </span>
  )
}

function GalleryNav({
  side,
  onClick,
}: {
  side: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={side === 'left' ? 'Foto anterior' : 'Próxima foto'}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`absolute top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2.5 text-white backdrop-blur transition hover:bg-black/65 ${
        side === 'left' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
      }`}
    >
      {side === 'left' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  )
}
