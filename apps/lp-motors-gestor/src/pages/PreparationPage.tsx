import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { checklistService } from '@/services/expenses'
import { isActiveStock } from '@/utils/finance'
import { EmptyState } from '@/components/ui/Feedback'

export function PreparationPage() {
  const { vehicles } = useApp()

  const items = useMemo(() => {
    return vehicles
      .filter((v) => !v.archived && isActiveStock(v))
      .map((v) => {
        const chk = checklistService.get(v.id)
        const done = chk.items.filter((i) => i.done).length
        const total = chk.items.length
        return { vehicle: v, done, total, pct: total ? Math.round((done / total) * 100) : 0 }
      })
      .sort((a, b) => a.pct - b.pct)
  }, [vehicles])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Preparação</h1>
        <p className="section-sub">Checklists de preparação por veículo</p>
      </div>

      {!items.length ? (
        <EmptyState title="Nenhum veículo em preparação" />
      ) : (
        <div className="space-y-3">
          {items.map(({ vehicle, done, total, pct }) => (
            <Link
              key={vehicle.id}
              to={`/veiculos/${vehicle.id}`}
              className="panel flex items-center gap-4 p-4 transition hover:border-lp-accent/40"
            >
              <div className="flex-1">
                <p className="font-semibold">{vehicle.marca} {vehicle.modelo}</p>
                <p className="text-sm text-lp-steel">{vehicle.placa || vehicle.codigoInterno}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold text-lp-accent">{pct}%</p>
                <p className="text-xs text-lp-steel">{done}/{total} itens</p>
              </div>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-lp-mist">
                <div className="h-full bg-lp-accent" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
