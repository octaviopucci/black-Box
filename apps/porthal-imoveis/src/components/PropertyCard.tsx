import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BedDouble, Car, MapPin } from 'lucide-react'
import { type Property } from '../data/properties'

export function PropertyCard({
  property,
  index = 0,
  variant = 'sale',
}: {
  property: Property
  index?: number
  variant?: 'sale' | 'rent'
}) {
  const isRent = variant === 'rent' || property.transaction === 'rent'
  const price = property.cashPrice || property.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/imovel/${encodeURIComponent(property.slug)}`}
        className="group relative block overflow-hidden rounded-3xl bg-ink text-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-[900ms] ease-luxury group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                isRent ? 'bg-brand text-white' : 'bg-white text-ink'
              }`}
            >
              {isRent ? 'Aluguel' : 'Venda'}
            </span>
            {!isRent ? (
              <span className="rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                À vista
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              {price}
              {isRent && price !== 'Consulte' ? (
                <span className="ml-1 text-sm font-sans font-medium text-white/55">/mês</span>
              ) : null}
            </p>
            {!isRent ? (
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                Valor à vista
              </p>
            ) : null}
            <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {property.title}
            </h3>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-white/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
              {property.address}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-white/60">
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
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white">
              Ver detalhes
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
