import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { type Property } from '../data/properties'

export function PropertyCard({
  property,
  index = 0,
  layout = 'editorial',
}: {
  property: Property
  index?: number
  layout?: 'editorial' | 'compact'
}) {
  const isRent = property.transaction === 'rent'
  const price = property.cashPrice || property.price

  if (layout === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.04, 0.2) }}
      >
        <Link
          to={`/imovel/${encodeURIComponent(property.slug)}`}
          className="group grid overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:grid-cols-[180px_1fr]"
        >
          <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-full">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-between p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                {isRent ? 'Aluguel' : 'À vista'} · {price}
                {isRent && price !== 'Consulte' ? '/mês' : ''}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-ink">{property.title}</h3>
              <p className="mt-2 text-sm text-mute">{property.address}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
              Abrir imóvel <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    )
  }

  const large = index % 5 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
      className={large ? 'md:col-span-2' : ''}
    >
      <Link
        to={`/imovel/${encodeURIComponent(property.slug)}`}
        className="group block overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
      >
        <div className={`overflow-hidden bg-ink ${large ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-[1000ms] ease-luxury group-hover:scale-[1.05]"
            loading="lazy"
          />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            {isRent ? 'Aluguel' : 'À vista'} · {price}
            {isRent && price !== 'Consulte' ? '/mês' : ''}
          </p>
          <h3
            className={`mt-2 font-display leading-tight text-ink ${
              large ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {property.title}
          </h3>
          <p className="mt-2 text-sm text-mute">{property.address}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
            Ver detalhes{' '}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
