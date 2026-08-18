import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
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
  const [showArchived, setShowArchived] = useState(!!filters.archived)
  const [inStockOnly, setInStockOnly] = useState(!!filters.inStock)

  const vehicles = useMemo(() => vehicleService.list(filters), [filters])
  const brands = vehicleService.getBrands()
  const cities = vehicleService.getCities()
  const colors = vehicleService.getColors()

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">Estoque</h1>
          <p className="section-sub">{vehicles.length} veículo(s) com os filtros atuais</p>
        </div>
        <Link to="/veiculos/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Cadastrar veículo
          </Button>
        </Link>
      </div>

      <div className="panel space-y-3 p-3 sm:p-4">
        <SearchBar
          value={filters.search || ''}
          onChange={(search) => setFilters({ ...filters, search })}
          placeholder="Placa, modelo, marca, chassi, renavam, código…"
        />
        <div className="flex flex-wrap gap-4">
          <Checkbox
            label="Mostrar arquivados"
            checked={showArchived}
            onChange={(e) => {
              setShowArchived(e.target.checked)
              setFilters({ ...filters, archived: e.target.checked, inStock: false })
            }}
          />
          <Checkbox
            label="Somente pátio"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked)
              setFilters({ ...filters, inStock: e.target.checked || undefined, archived: false })
            }}
          />
        </div>
      </div>

      <Filters value={filters} onChange={setFilters} brands={brands} cities={cities} colors={colors} />

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
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {vehicles.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
          <div className="hidden md:block">
            <VehicleTable vehicles={vehicles} />
          </div>
        </>
      )}
    </div>
  )
}
