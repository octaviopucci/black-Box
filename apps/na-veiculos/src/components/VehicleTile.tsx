import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Vehicle } from '../data/vehicles'
import { formatPrice } from '../data/vehicles'
import { assetUrl } from '../lib/asset'

type Props = {
  vehicle: Vehicle
  index?: number
  variant?: 'lane' | 'archive'
}

export function VehicleTile({ vehicle, index = 0, variant = 'lane' }: Props) {
  const sold = vehicle.status === 'sold'
  const number = String(index + 1).padStart(2, '0')

  return (
    <Link
      to={`/veiculo/${vehicle.id}`}
      className={`group relative block overflow-hidden border border-line bg-asphalt-lift transition duration-500 ease-drive hover:border-signal/50 ${
        variant === 'archive' ? 'opacity-95' : ''
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={assetUrl(vehicle.image)}
          alt={vehicle.title}
          className="h-full w-full object-cover transition duration-700 ease-drive group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-transparent opacity-90" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="spec-chip bg-asphalt/70 backdrop-blur-sm">
            {number}
          </span>
          <span
            className={`spec-chip backdrop-blur-sm ${
              sold
                ? 'border-chrome/25 bg-asphalt/70 text-chrome-mute'
                : 'border-signal/40 bg-signal/20 text-chrome-soft'
            }`}
          >
            {sold ? 'Vendido' : 'Disponível'}
          </span>
        </div>
        <ArrowUpRight
          className="absolute right-4 top-4 h-5 w-5 text-chrome-soft opacity-0 transition duration-500 group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="relative space-y-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-chrome-mute">
              {vehicle.brand}
              {vehicle.year ? ` · ${vehicle.year}` : ''}
            </p>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.04em] text-chrome-soft sm:text-[1.7rem]">
              {vehicle.model}
            </h3>
          </div>
          {!sold && (
            <p className="shrink-0 font-brand text-xl italic text-signal sm:text-2xl">
              {formatPrice(vehicle.price)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(sold
            ? [vehicle.praise ? 'Sonho entregue' : 'Entregue']
            : vehicle.highlights.slice(0, 3)
          ).map((item) => (
            <span key={item} className="spec-chip">
              {item.length > 28 ? `${item.slice(0, 28)}…` : item}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
