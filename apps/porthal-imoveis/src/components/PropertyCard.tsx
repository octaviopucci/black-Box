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
  const accent = variant === 'rent' ? 'text-brand' : 'text-sale'

  return (
    <motion.a
      href={property.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.28), ease: [0.22, 1, 0.36, 1] }}
      className="group relative block overflow-hidden rounded-[1.35rem] bg-ink text-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-[900ms] ease-luxury group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-95" />
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
              variant === 'rent' ? 'bg-brand text-white' : 'bg-white/90 text-ink'
            }`}
          >
            {variant === 'rent' ? 'Aluguel' : 'Venda'}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className={`font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem] ${accent}`}>
            {property.price}
            {variant === 'rent' && property.price !== 'Consulte' ? (
              <span className="ml-1 text-sm font-sans font-medium text-white/55">/mês</span>
            ) : null}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
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
    </motion.a>
  )
}
