import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Bath, BedDouble, Car, MapPin } from 'lucide-react'
import type { Property } from '../data/properties'

export function PropertyCard({
  property,
  index = 0,
}: {
  property: Property
  index?: number
}) {
  const isRent = property.transaction === 'rent'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.28), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/imovel/${encodeURIComponent(property.slug)}`}
        className="group block overflow-hidden bg-blue-deep text-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-[900ms] ease-silk group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-deep via-blue-deep/30 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <span
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                isRent ? 'bg-gold text-blue-deep' : 'bg-blue text-white'
              }`}
            >
              {isRent ? 'Aluguel' : 'Venda'}
            </span>
            <span className="bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              Ref. {property.reference}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-2xl font-semibold tracking-tight">{property.price}</p>
            <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">
              {property.title}
            </h3>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-white/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {property.city}
              {property.profile ? ` · ${property.profile}` : ''}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-white/60">
              {property.bedroomCount ? (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-3.5 w-3.5 text-gold" />
                  {property.bedrooms} dorm.
                </span>
              ) : null}
              {property.bathroomCount ? (
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-3.5 w-3.5 text-gold" />
                  {property.bathrooms} ban.
                </span>
              ) : null}
              {property.garageCount ? (
                <span className="inline-flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-gold" />
                  {property.garages} vaga{property.garageCount > 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white">
              Ver detalhes
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
