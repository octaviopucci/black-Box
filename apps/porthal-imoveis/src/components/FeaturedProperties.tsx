import { motion } from 'framer-motion'
import { ArrowUpRight, BedDouble, Car, MapPin } from 'lucide-react'
import { properties, type Property } from '../data/properties'

export function FeaturedProperties({ filterIds }: { filterIds: string[] | null }) {
  const list =
    filterIds === null
      ? properties
      : properties.filter((p) => filterIds.includes(p.id))

  return (
    <section id="imoveis" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Seleção</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Imóveis em destaque
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mute">
          Oportunidades curadas em Capão Bonito e região — residências de alto padrão, sítios e
          áreas com potencial.
        </p>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-mute">
          Nenhum imóvel encontrado com esses filtros. Ajuste a busca ou fale conosco no WhatsApp.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, 9).map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

function PropertyCard({ property, index }: { property: Property; index: number }) {
  return (
    <motion.a
      href={property.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25) }}
      className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:border-brand/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <p className="absolute bottom-4 left-4 font-display text-2xl font-semibold text-white">
          {property.price}
        </p>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
          {property.title}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-mute">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          {property.address}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-mute">
          {property.bedrooms && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-brand" />
              {property.bedrooms}
            </span>
          )}
          {property.garages && (
            <span className="inline-flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-brand" />
              {property.garages}
            </span>
          )}
          {property.area && <span>{property.area}</span>}
        </div>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Ver detalhes
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.a>
  )
}
