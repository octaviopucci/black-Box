/**
 * Testes catálogo LP Motors — status gestor → vitrine site.
 * Rodar: npx tsx api/_lp-motors/catalog.test.ts
 */
import assert from 'node:assert/strict'
import { buildPublicCatalog, isSiteVisibleVehicle } from './catalog'
import type { LpOrgDatabase, LpVehicle } from './catalog'

function vehicle(overrides: Partial<LpVehicle> = {}): LpVehicle {
  return {
    id: 'veh_1',
    codigoInterno: 'PUC-001',
    marca: 'Toyota',
    modelo: 'Corolla',
    versao: 'XEi',
    ano: 2020,
    anoModelo: 2020,
    cor: 'Prata',
    combustivel: 'flex',
    cambio: 'automatico',
    quilometragem: 45000,
    cidade: 'Capão Bonito',
    estado: 'SP',
    precoAnunciado: 89900,
    observacoes: '',
    fotos: ['data:image/jpeg;base64,abc'],
    fotoPrincipal: 0,
    status: 'pronto',
    archived: false,
    draft: false,
    consignado: false,
    ...overrides,
  }
}

function db(vehicles: LpVehicle[]): LpOrgDatabase {
  return {
    organization: { id: 'org_1', name: 'Pucci Motors', slug: 'pucci-motors' },
    vehicles,
    settings: [
      {
        nomeEmpresa: 'Pucci Motors',
        whatsapp: '5515999999999',
        cidade: 'Capão Bonito, SP',
      },
    ],
  }
}

// pronto e anunciado entram no site
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'pronto' })), true)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'anunciado' })), true)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'disponivel' })), true)

// oficina / preparação / pipeline não entram
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'preparacao' })), false)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'oficina' })), false)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'negociacao' })), false)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'documentacao' })), false)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'reservado' })), false)
assert.equal(isSiteVisibleVehicle(vehicle({ status: 'vendido' })), false)

// rascunho e arquivado não entram
assert.equal(isSiteVisibleVehicle(vehicle({ draft: true })), false)
assert.equal(isSiteVisibleVehicle(vehicle({ archived: true })), false)

const catalog = buildPublicCatalog(
  db([
    vehicle({ id: 'a', status: 'pronto' }),
    vehicle({ id: 'b', status: 'preparacao' }),
    vehicle({ id: 'c', status: 'anunciado' }),
    vehicle({ id: 'd', status: 'oficina' }),
  ]),
  'pucci-motors',
)

assert.equal(catalog.vehicles.length, 2)
assert.deepEqual(catalog.vehicles.map((v) => v.id).sort(), ['a', 'c'])
assert.equal(catalog.storeName, 'Pucci Motors')
assert.equal(catalog.storeSlug, 'pucci-motors')

console.log('api/_lp-motors/catalog.test.ts — OK')
