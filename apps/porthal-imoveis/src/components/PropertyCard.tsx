import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BedDouble, Car, MapPin } from 'lucide-react'
import { type Property } from '../data/properties'
import { cleanTitle } from '../lib/filters'
import { ease } from '../lib/motion'

export function PropertyCard({
  property,
  index = 0,
}: {
  property: Property
  index?: number
}) {
  const isRent = property.transaction === 'rent'
  const price = property.cashPrice || property.price

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.3), ease }}
    >
      <Link
        to={`/imovel/${encodeURIComponent(property.slug)}`}
        className="group relative block overflow-hidden bg-ink text-white"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={property.image}
            alt={cleanTitle(property.title)}
            className="h-full w-full object-cover transition duration-[1100ms] ease-cinematic group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-95" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                isRent ? 'bg-brand text-white' : 'bg-white text-ink'
              }`}
            >
              {isRent ? 'Aluguel' : 'Venda'}
            </span>
            {!isRent ? (
              <span className="bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                À vista
              </span>
            ) : null}
            {property.profile === 'Rural' ? (
              <span className="bg-forest/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                Rural
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="font-display text-[1.85rem] leading-none tracking-tight sm:text-[2.05rem]">
              {price}
              {isRent && price !== 'Consulte' ? (
                <span className="ml-1 font-sans text-sm font-medium text-white/55">/mês</span>
              ) : null}
            </p>
            {!isRent ? (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Valor à vista
              </p>
            ) : null}
            <h3 className="mt-4 font-display text-[1.45rem] leading-tight tracking-tight sm:text-[1.65rem]">
              {cleanTitle(property.title)}
            </h3>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-white/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
              {property.address}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-white/58">
              {property.bedrooms ? (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-3.5 w-3.5 text-brand-soft" />
                  {property.bedrooms}
                </span>
              ) : null}
              {property.garages ? (
                <span className="inline-flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-brand-soft" />
                  {property.garages}
                </span>
              ) : null}
              {property.area ? <span>{property.area}</span> : null}
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              Ver imóvel
              <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
