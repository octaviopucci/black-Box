import type { VehicleFilters, VehicleStatus, FuelType, TransmissionType } from '@/types'
import { Select, Checkbox, Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  FUEL_LABELS,
  STATUS_LABELS,
  TRANSMISSION_LABELS,
} from '@/utils/constants'

interface FiltersProps {
  value: VehicleFilters
  onChange: (next: VehicleFilters) => void
  brands: string[]
  cities: string[]
  colors: string[]
}

export function Filters({ value, onChange, brands, cities, colors }: FiltersProps) {
  const set = <K extends keyof VehicleFilters>(key: K, val: VehicleFilters[K]) => {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <Select
        label="Marca"
        value={value.marca || ''}
        onChange={(e) => set('marca', e.target.value || undefined)}
      >
        <option value="">Todas</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </Select>

      <Input
        label="Ano"
        type="number"
        value={value.ano || ''}
        onChange={(e) => set('ano', e.target.value ? Number(e.target.value) : undefined)}
        placeholder="Ex: 2022"
      />

      <Select
        label="Cidade"
        value={value.cidade || ''}
        onChange={(e) => set('cidade', e.target.value || undefined)}
      >
        <option value="">Todas</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Select
        label="Cor"
        value={value.cor || ''}
        onChange={(e) => set('cor', e.target.value || undefined)}
      >
        <option value="">Todas</option>
        {colors.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Select
        label="Status"
        value={value.status || ''}
        onChange={(e) => set('status', (e.target.value || '') as VehicleStatus | '')}
      >
        <option value="">Todos</option>
        {Object.entries(STATUS_LABELS).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        label="Combustível"
        value={value.combustivel || ''}
        onChange={(e) => set('combustivel', (e.target.value || '') as FuelType | '')}
      >
        <option value="">Todos</option>
        {Object.entries(FUEL_LABELS).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        label="Câmbio"
        value={value.cambio || ''}
        onChange={(e) => set('cambio', (e.target.value || '') as TransmissionType | '')}
      >
        <option value="">Todos</option>
        {Object.entries(TRANSMISSION_LABELS).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </Select>

      <Input
        label="Preço mín."
        type="number"
        value={value.precoMin ?? ''}
        onChange={(e) => set('precoMin', e.target.value ? Number(e.target.value) : undefined)}
      />

      <Input
        label="Preço máx."
        type="number"
        value={value.precoMax ?? ''}
        onChange={(e) => set('precoMax', e.target.value ? Number(e.target.value) : undefined)}
      />

      <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-1">
        <Checkbox
          label="Somente consignados"
          checked={value.consignado === true}
          onChange={(e) => set('consignado', e.target.checked ? true : null)}
        />
        <Button
          variant="secondary"
          type="button"
          onClick={() =>
            onChange({
              search: value.search,
              archived: value.archived,
            })
          }
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}
