import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Vehicle } from '@/types'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatCurrency, formatNumber } from '@/utils'
import { daysBetween } from '@/utils'
import { Button } from '@/components/ui/Button'

type SortKey =
  | 'marca'
  | 'ano'
  | 'placa'
  | 'status'
  | 'precoAnunciado'
  | 'valorCompra'
  | 'quilometragem'
  | 'dataCompra'

interface VehicleTableProps {
  vehicles: Vehicle[]
  pageSize?: number
}

export function VehicleTable({ vehicles, pageSize = 10 }: VehicleTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('dataCompra')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const items = [...vehicles]
    items.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return items
  }, [vehicles, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = sorted.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-brand-red" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-brand-red" />
    )
  }

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="px-3 py-3 text-left">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/50 hover:text-white"
        onClick={() => toggleSort(k)}
      >
        {label}
        <SortIcon k={k} />
      </button>
    </th>
  )

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-brand-gray/50 bg-brand-black/40">
            <tr>
              <Th k="marca" label="Veículo" />
              <Th k="ano" label="Ano" />
              <Th k="placa" label="Placa" />
              <Th k="status" label="Status" />
              <Th k="valorCompra" label="Compra" />
              <Th k="precoAnunciado" label="Anúncio" />
              <Th k="quilometragem" label="KM" />
              <Th k="dataCompra" label="Dias" />
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/50">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {current.map((v) => (
              <tr key={v.id} className="border-b border-brand-gray/30 hover:bg-white/[0.02]">
                <td className="px-3 py-3">
                  <Link to={`/veiculos/${v.id}`} className="font-medium hover:text-brand-red">
                    {v.marca} {v.modelo}
                  </Link>
                  <p className="text-xs text-white/40">{v.versao}</p>
                </td>
                <td className="px-3 py-3 text-white/70">
                  {v.ano}/{v.anoModelo}
                </td>
                <td className="px-3 py-3 font-mono text-white/80">{v.placa || '—'}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-3 py-3">{formatCurrency(v.valorCompra)}</td>
                <td className="px-3 py-3">{formatCurrency(v.precoAnunciado)}</td>
                <td className="px-3 py-3">{formatNumber(v.quilometragem)}</td>
                <td className="px-3 py-3">{daysBetween(v.dataCompra)}</td>
                <td className="px-3 py-3 text-right">
                  <Link to={`/veiculos/${v.id}`}>
                    <Button variant="ghost" size="sm">
                      Detalhes
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-brand-gray/40 px-4 py-3">
        <p className="text-xs text-white/45">
          {vehicles.length} veículo(s) · página {page} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
