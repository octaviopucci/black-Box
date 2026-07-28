import type { Vehicle, VehicleFilters, VehicleStatus } from '@/types'
import { loadDatabase } from '@/services/database'
import { historyService, persist } from '@/services/auth'
import { generateId, nowISO } from '@/utils'
import { STATUS_LABELS } from '@/utils/constants'

export type VehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'archived'>

export const vehicleService = {
  list(filters: VehicleFilters = {}): Vehicle[] {
    let items = loadDatabase().vehicles.slice()

    if (!filters.archived) {
      items = items.filter((v) => !v.archived)
    } else {
      items = items.filter((v) => v.archived)
    }

    if (filters.inStock) {
      items = items.filter((v) => !['vendido', 'entregue'].includes(v.status))
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim()
      items = items.filter((v) => {
        const hay = [
          v.placa,
          v.marca,
          v.modelo,
          v.versao,
          String(v.ano),
          String(v.anoModelo),
          v.fornecedor,
          v.cidade,
          v.cor,
          v.status,
          v.renavam,
          v.chassi,
          String(v.precoAnunciado),
          String(v.valorCompra),
        ]
          .join(' ')
          .toLowerCase()
        return hay.includes(q)
      })
    }

    if (filters.marca) {
      items = items.filter((v) => v.marca.toLowerCase() === filters.marca!.toLowerCase())
    }
    if (filters.ano) items = items.filter((v) => v.ano === filters.ano)
    if (filters.cidade) {
      items = items.filter((v) => v.cidade.toLowerCase().includes(filters.cidade!.toLowerCase()))
    }
    if (filters.cor) {
      items = items.filter((v) => v.cor.toLowerCase().includes(filters.cor!.toLowerCase()))
    }
    if (filters.status) items = items.filter((v) => v.status === filters.status)
    if (filters.combustivel) items = items.filter((v) => v.combustivel === filters.combustivel)
    if (filters.cambio) items = items.filter((v) => v.cambio === filters.cambio)
    if (filters.consignado === true) items = items.filter((v) => v.consignado)
    if (filters.consignado === false) items = items.filter((v) => !v.consignado)
    if (filters.precoMin != null) {
      items = items.filter((v) => v.precoAnunciado >= (filters.precoMin || 0))
    }
    if (filters.precoMax != null && filters.precoMax > 0) {
      items = items.filter((v) => v.precoAnunciado <= filters.precoMax!)
    }

    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  getById(id: string): Vehicle | undefined {
    return loadDatabase().vehicles.find((v) => v.id === id)
  },

  create(input: VehicleInput): Vehicle {
    const db = loadDatabase()
    const vehicle: Vehicle = {
      ...input,
      id: generateId('veh'),
      archived: false,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.vehicles.unshift(vehicle)
    historyService.add(db, {
      vehicleId: vehicle.id,
      type: 'compra',
      descricao: `Cadastro de ${vehicle.marca} ${vehicle.modelo} — placa ${vehicle.placa}`,
    })
    historyService.add(db, {
      vehicleId: vehicle.id,
      type: 'entrada_estoque',
      descricao: `Entrada no estoque como ${STATUS_LABELS[vehicle.status]}`,
    })
    persist(db)
    return vehicle
  },

  update(id: string, patch: Partial<VehicleInput>): Vehicle {
    const db = loadDatabase()
    const idx = db.vehicles.findIndex((v) => v.id === id)
    if (idx < 0) throw new Error('Veículo não encontrado')
    const prev = db.vehicles[idx]
    const updated: Vehicle = {
      ...prev,
      ...patch,
      id: prev.id,
      createdAt: prev.createdAt,
      updatedAt: nowISO(),
    }
    db.vehicles[idx] = updated
    if (patch.status && patch.status !== prev.status) {
      historyService.add(db, {
        vehicleId: id,
        type: 'status_change',
        descricao: `Status alterado de ${STATUS_LABELS[prev.status]} para ${STATUS_LABELS[patch.status]}`,
      })
    } else {
      historyService.add(db, {
        vehicleId: id,
        type: 'edicao',
        descricao: `Dados do veículo atualizados`,
      })
    }
    persist(db)
    return updated
  },

  remove(id: string): void {
    const db = loadDatabase()
    const vehicle = db.vehicles.find((v) => v.id === id)
    if (!vehicle) throw new Error('Veículo não encontrado')
    db.vehicles = db.vehicles.filter((v) => v.id !== id)
    db.expenses = db.expenses.filter((e) => e.vehicleId !== id)
    historyService.add(db, {
      vehicleId: id,
      type: 'outro',
      descricao: `Veículo ${vehicle.marca} ${vehicle.modelo} (${vehicle.placa}) excluído`,
    })
    persist(db)
  },

  duplicate(id: string): Vehicle {
    const original = this.getById(id)
    if (!original) throw new Error('Veículo não encontrado')
    const { id: _id, createdAt: _c, updatedAt: _u, archived: _a, ...rest } = original
    const copy = this.create({
      ...rest,
      placa: '',
      renavam: '',
      chassi: '',
      status: 'disponivel',
      fotos: [...original.fotos],
    })
    const db = loadDatabase()
    historyService.add(db, {
      vehicleId: copy.id,
      type: 'duplicacao',
      descricao: `Duplicado a partir de ${original.placa || original.id}`,
    })
    persist(db)
    return copy
  },

  archive(id: string): Vehicle {
    const db = loadDatabase()
    const idx = db.vehicles.findIndex((v) => v.id === id)
    if (idx < 0) throw new Error('Veículo não encontrado')
    db.vehicles[idx] = { ...db.vehicles[idx], archived: true, updatedAt: nowISO() }
    historyService.add(db, {
      vehicleId: id,
      type: 'arquivo',
      descricao: 'Veículo arquivado',
    })
    persist(db)
    return db.vehicles[idx]
  },

  restore(id: string): Vehicle {
    const db = loadDatabase()
    const idx = db.vehicles.findIndex((v) => v.id === id)
    if (idx < 0) throw new Error('Veículo não encontrado')
    db.vehicles[idx] = { ...db.vehicles[idx], archived: false, updatedAt: nowISO() }
    historyService.add(db, {
      vehicleId: id,
      type: 'restauracao',
      descricao: 'Veículo restaurado do arquivo',
    })
    persist(db)
    return db.vehicles[idx]
  },

  setStatus(id: string, status: VehicleStatus): Vehicle {
    return this.update(id, {
      status,
      consignado: status === 'consignado',
    })
  },

  getBrands(): string[] {
    return [...new Set(loadDatabase().vehicles.map((v) => v.marca))].sort()
  },

  getCities(): string[] {
    return [...new Set(loadDatabase().vehicles.map((v) => v.cidade))].sort()
  },

  getColors(): string[] {
    return [...new Set(loadDatabase().vehicles.map((v) => v.cor))].sort()
  },
}
