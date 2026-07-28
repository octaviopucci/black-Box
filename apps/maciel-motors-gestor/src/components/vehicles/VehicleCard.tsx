import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car } from 'lucide-react'
import type { Vehicle } from '@/types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatCurrency, formatNumber } from '@/utils'
import { daysBetween } from '@/utils'

export function VehicleCard({ vehicle, index = 0 }: { vehicle: Vehicle; index?: number }) {
  const photo = vehicle.fotos[vehicle.fotoPrincipal] || vehicle.fotos[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/veiculos/${vehicle.id}`}
        className="panel group block overflow-hidden transition hover:border-brand-red/40 hover:shadow-glow"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-black">
          {photo ? (
            <img
              src={photo}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <Car className="h-12 w-12" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-wide">
              {vehicle.marca} {vehicle.modelo}
            </h3>
            <p className="text-sm text-white/50">
              {vehicle.versao} · {vehicle.ano}/{vehicle.anoModelo}
            </p>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-white/40">Anúncio</p>
              <p className="font-display text-xl font-bold text-white">
                {vehicle.precoAnunciado ? formatCurrency(vehicle.precoAnunciado) : '—'}
              </p>
            </div>
            <div className="text-right text-xs text-white/45">
              <p>{vehicle.placa || 'S/ placa'}</p>
              <p>{formatNumber(vehicle.quilometragem)} km</p>
              <p>{daysBetween(vehicle.dataCompra)} dias</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
