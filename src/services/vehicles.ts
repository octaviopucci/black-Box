import type { Vehicle, VehicleFilters, VehicleStatus } from '@/types'
import { ensureChecklist, loadDatabase } from '@/services/database'
import { auditService, historyService, persist } from '@/services/auth'
import { generateId, nowISO } from '@/utils'
import { STATUS_LABELS } from '@/utils/constants'
import { stockAgeDays } from '@/utils/finance'

export type VehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'archived'>

export const vehicleService = {
  list(filters: VehicleFilters = {}): Vehicle[] {
    let items = loadDatabase().vehicles.slice()

    if (filters.archived) {
      items = items.filter((v) => v.archived)
    } else {
      items = items.filter((v) => !v.archived)
    }

    if (filters.inStock) {
      items = items.filter((v) => !['vendido', 'entregue', 'cancelado'].includes(v.status))
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim()
      items = items.filter((v) => {
        const hay = [
          v.placa,
          v.marca,
          v.modelo,
          v.versao,
          v.codigoInterno,
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
    if (filters.modelo) {
      items = items.filter((v) => v.modelo.toLowerCase().includes(filters.modelo!.toLowerCase()))
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
    if (filters.diasMin != null) {
      items = items.filter((v) => stockAgeDays(v) >= (filters.diasMin || 0))
    }
    if (filters.diasMax != null && filters.diasMax > 0) {
      items = items.filter((v) => stockAgeDays(v) <= filters.diasMax!)
    }

    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  getById(id: string): Vehicle | undefined {
    return loadDatabase().vehicles.find((v) => v.id === id)
  },

  create(input: VehicleInput): Vehicle {
    const db = loadDatabase()
    const id = generateId('veh')
    const vehicle: Vehicle = {
      ...input,
      id,
      organizationId: db.organization?.id,
      codigoInterno: input.codigoInterno || `LP-${id.slice(-6).toUpperCase()}`,
      archived: false,
      draft: Boolean(input.draft),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.vehicles.unshift(vehicle)
    ensureChecklist(db, vehicle.id)
    historyService.add(db, {
      vehicleId: vehicle.id,
      type: 'cadastro',
      descricao: `Veículo cadastrado: ${vehicle.marca} ${vehicle.modelo}${vehicle.placa ? ` — placa ${vehicle.placa}` : ''}`,
    })
    if (!vehicle.draft) {
      historyService.add(db, {
        vehicleId: vehicle.id,
        type: 'entrada_estoque',
        descricao: `Entrada no fluxo como ${STATUS_LABELS[vehicle.status]}`,
      })
    }
    auditService.log(db, 'vehicle.create', 'vehicle', vehicle.id, `${vehicle.marca} ${vehicle.modelo}`)
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

    for (const campo of ['precoAnunciado', 'precoMinimo', 'valorCompra', 'precoFipe'] as const) {
      if (patch[campo] != null && patch[campo] !== prev[campo]) {
        db.priceHistory.unshift({
          id: generateId('price'),
          organizationId: db.organization?.id,
          vehicleId: id,
          campo,
          valorAnterior: prev[campo],
          valorNovo: patch[campo] as number,
          usuario: historyService.listRecent(1)[0]?.usuario || 'Sistema',
          createdAt: nowISO(),
        })
        historyService.add(db, {
          vehicleId: id,
          type: 'preco',
          descricao: `Preço (${campo}) alterado de R$ ${prev[campo].toLocaleString('pt-BR')} para R$ ${(patch[campo] as number).toLocaleString('pt-BR')}`,
        })
      }
    }

    if (patch.status && patch.status !== prev.status) {
      db.statusHistory.unshift({
        id: generateId('sth'),
        organizationId: db.organization?.id,
        vehicleId: id,
        de: prev.status,
        para: patch.status,
        usuario: 'Sistema',
        createdAt: nowISO(),
      })
      historyService.add(db, {
        vehicleId: id,
        type: 'status_change',
        descricao: `Status alterado de ${STATUS_LABELS[prev.status]} para ${STATUS_LABELS[patch.status]}`,
      })
    } else if (!patch.precoAnunciado && !patch.precoMinimo) {
      historyService.add(db, {
        vehicleId: id,
        type: 'edicao',
        descricao: 'Dados do veículo atualizados',
      })
    }

    if (patch.fotos && patch.fotos.length > prev.fotos.length) {
      historyService.add(db, {
        vehicleId: id,
        type: 'fotos',
        descricao: `Fotos atualizadas (${patch.fotos.length} no total)`,
      })
    }

    auditService.log(db, 'vehicle.update', 'vehicle', id, `${updated.marca} ${updated.modelo}`)
    persist(db)
    return updated
  },

  remove(id: string): void {
    const db = loadDatabase()
    const vehicle = db.vehicles.find((v) => v.id === id)
    if (!vehicle) throw new Error('Veículo não encontrado')
    db.vehicles = db.vehicles.filter((v) => v.id !== id)
    db.expenses = db.expenses.filter((e) => e.vehicleId !== id)
    db.documents = db.documents.filter((d) => d.vehicleId !== id)
    db.checklists = db.checklists.filter((c) => c.vehicleId !== id)
    historyService.add(db, {
      vehicleId: id,
      type: 'outro',
      descricao: `Veículo ${vehicle.marca} ${vehicle.modelo} (${vehicle.placa}) excluído`,
    })
    auditService.log(db, 'vehicle.delete', 'vehicle', id, `${vehicle.marca} ${vehicle.modelo}`)
    persist(db)
  },

  duplicate(id: string): Vehicle {
    const original = this.getById(id)
    if (!original) throw new Error('Veículo não encontrado')
    const { id: _id, createdAt: _c, updatedAt: _u, archived: _a, codigoInterno: _ci, ...rest } = original
    const copy = this.create({
      ...rest,
      placa: '',
      renavam: '',
      chassi: '',
      codigoInterno: '',
      status: 'comprado',
      fotos: [...original.fotos],
    })
    const db = loadDatabase()
    historyService.add(db, {
      vehicleId: copy.id,
      type: 'duplicacao',
      descricao: `Duplicado a partir de ${original.placa || original.codigoInterno || original.id}`,
    })
    persist(db)
    return copy
  },

  archive(id: string): Vehicle {
    const db = loadDatabase()
    const idx = db.vehicles.findIndex((v) => v.id === id)
    if (idx < 0) throw new Error('Veículo não encontrado')
    db.vehicles[idx] = { ...db.vehicles[idx], archived: true, updatedAt: nowISO() }
    historyService.add(db, { vehicleId: id, type: 'arquivo', descricao: 'Veículo arquivado' })
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
    return this.update(id, { status })
  },

  getBrands(): string[] {
    return [...new Set(loadDatabase().vehicles.map((v) => v.marca).filter(Boolean))].sort()
  },

  getCities(): string[] {
    return [...new Set(loadDatabase().vehicles.map((v) => v.cidade).filter(Boolean))].sort()
  },

  getColors(): string[] {
    return [...new Set(loadDatabase().vehicles.map((v) => v.cor).filter(Boolean))].sort()
  },

  globalSearch(q: string): Vehicle[] {
    return this.list({ search: q, inStock: false })
  },
}
