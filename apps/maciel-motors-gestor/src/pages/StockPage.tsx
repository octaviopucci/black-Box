import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { SearchBar } from '@/components/common/SearchBar'
import { Filters } from '@/components/common/Filters'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { VehicleTable } from '@/components/vehicles/VehicleTable'
import { EmptyState } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Input'
import { useApp } from '@/context/AppContext'
import { vehicleService } from '@/services/vehicles'

export function StockPage() {
  const { filters, setFilters } = useApp()
  const [view, setView] = useState<'grid' | 'table'>('grid')

  const vehicles = useMemo(() => vehicleService.list(filters), [filters])
  const brands = vehicleService.getBrands()
  const cities = vehicleService.getCities()
  const colors = vehicleService.getColors()

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wide">Estoque</h1>
          <p className="mt-1 text-sm text-white/50">
            {vehicles.length} veículo(s) encontrados com os filtros atuais
          </p>
        </div>
        <Link to="/veiculos/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Cadastrar veículo
          </Button>
        </Link>
      </div>

      <div className="sticky top-[68px] z-20 space-y-3 rounded-2xl border border-brand-gray/40 bg-brand-black/85 p-3 backdrop-blur-xl sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <SearchBar
            className="flex-1"
            value={filters.search || ''}
            onChange={(search) => setFilters({ ...filters, search })}
          />
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </Button>
            <Button
              variant={view === 'table' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('table')}
            >
              <List className="h-4 w-4" />
              Tabela
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Checkbox
            label="Mostrar arquivados"
            checked={!!filters.archived}
            onChange={(e) => setFilters({ ...filters, archived: e.target.checked, inStock: false })}
          />
          <Checkbox
            label="Somente pátio (excluir vendidos)"
            checked={!!filters.inStock}
            onChange={(e) =>
              setFilters({ ...filters, inStock: e.target.checked || undefined, archived: false })
            }
          />
        </div>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        brands={brands}
        cities={cities}
        colors={colors}
      />

      {!vehicles.length ? (
        <EmptyState
          title="Nenhum veículo encontrado"
          description="Ajuste os filtros ou cadastre um novo veículo no estoque."
          action={
            <Link to="/veiculos/novo">
              <Button>Cadastrar veículo</Button>
            </Link>
          }
        />
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      ) : (
        <VehicleTable vehicles={vehicles} />
      )}
    </div>
  )
}
