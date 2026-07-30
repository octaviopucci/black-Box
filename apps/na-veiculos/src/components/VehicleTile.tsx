import { Link } from 'react-router-dom'
import { formatPrice, type Vehicle } from '../data/vehicles'
import { assetUrl } from '../lib/asset'

type Props = {
  vehicle: Vehicle
  index?: number
  variant?: 'garage' | 'delivery'
}

export function VehicleTile({ vehicle, index = 0, variant = 'garage' }: Props) {
  const sold = vehicle.status === 'sold'
  const num = String(index + 1).padStart(2, '0')

  return (
    <Link
      to={`/veiculo/${vehicle.id}`}
      data-cursor={sold ? 'Entrega' : 'Abrir'}
      className="group relative block w-full overflow-hidden border border-line bg-ink-lift transition duration-500 ease-cinema hover:border-lamp/45"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={assetUrl(vehicle.image)}
          alt={vehicle.title}
          className="h-full w-full object-cover transition duration-[900ms] ease-cinema group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        {/* Window-sticker artifact */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span className="plaque bg-ink/75">{num}</span>
          <span
            className={`plaque ${
              sold ? 'border-paper/20 text-paper-mute' : 'border-lamp/50 text-lamp'
            }`}
          >
            {sold ? 'Entregue' : 'Disponível'}
          </span>
        </div>

        {!sold && (
          <div className="absolute bottom-4 right-4 border border-lamp/40 bg-ink/80 px-3 py-2 backdrop-blur-sm">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-lamp">
              Valor
            </p>
            <p className="font-display text-xl font-semibold text-paper-soft">
              {formatPrice(vehicle.price)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-mute">
            {vehicle.brand}
            {vehicle.year ? ` · ${vehicle.year}` : ''}
          </p>
          <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-tight tracking-tight text-paper-soft sm:text-2xl">
            {vehicle.model}
          </h3>
        </div>

        {variant === 'garage' && !sold && (
          <div className="flex flex-wrap gap-2">
            {vehicle.highlights.slice(0, 3).map((h) => (
              <span key={h} className="plaque">
                {h}
              </span>
            ))}
          </div>
        )}

        {sold && vehicle.praise && (
          <p className="line-clamp-2 text-sm leading-relaxed text-paper/65">
            {vehicle.praise}
          </p>
        )}
      </div>
    </Link>
  )
}
