import { hashPassword, type CloudOrg, type CloudUser, type JsonStore } from './store'
import type { LpOrgDatabase, LpVehicle } from './catalog'
import { pucciVehicleImage } from './pucci-vehicle-images'

const ORG_ID = 'org_pucci_motors'
const USER_ID = 'user_pucci_admin'
const DEMO_SLUG = 'pucci-motors'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function isoDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function vehicle(
  id: string,
  marca: string,
  modelo: string,
  versao: string,
  ano: number,
  preco: number,
  status: LpVehicle['status'],
  extras: Partial<LpVehicle> = {},
): LpVehicle {
  const img = pucciVehicleImage(id)
  return {
    id,
    organizationId: ORG_ID,
    codigoInterno: `PUC-${id.slice(-4).toUpperCase()}`,
    marca,
    modelo,
    versao,
    ano,
    anoModelo: ano,
    categoria: extras.categoria || 'Esportivo',
    cor: extras.cor || 'Preto',
    placa: extras.placa || '',
    renavam: '',
    chassi: '',
    motor: extras.motor || '',
    portas: 2,
    combustivel: extras.combustivel || 'gasolina',
    cambio: extras.cambio || 'automatico',
    quilometragem: extras.quilometragem ?? 12000,
    cidade: 'Capão Bonito',
    estado: 'SP',
    fornecedor: '',
    telefoneFornecedor: '',
    origem: 'Particular',
    cpfCnpjOrigem: '',
    localCompra: '',
    formaPagamentoCompra: '',
    entradaCompra: 0,
    financiamentoCompra: 0,
    observacoesCompra: '',
    precoFipe: Math.round(preco * 0.92),
    valorCompra: Math.round(preco * 0.82),
    precoAnunciado: preco,
    precoMinimo: Math.round(preco * 0.94),
    observacoes: extras.observacoes || `${marca} ${modelo} ${versao} — unidade inspecionada Pucci Motors.`,
    dataCompra: daysAgo(30),
    fotos: [img],
    fotoPrincipal: 0,
    status,
    consignado: false,
    archived: false,
    draft: false,
    vendedorResponsavel: 'Administrador',
    createdAt: isoDaysAgo(30),
    updatedAt: isoDaysAgo(2),
    ...extras,
  }
}

export function buildPucciDemoVehicles(): LpVehicle[] {
  return [
    vehicle('pucci_001', 'Porsche', '911', 'Carrera S 3.0', 2022, 899000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Cinza GT',
      motor: '3.0 biturbo',
      quilometragem: 8400,
    }),
    vehicle('pucci_002', 'Porsche', 'Cayenne', 'Turbo GT', 2021, 1249000, 'anunciado', {
      categoria: 'SUV',
      cor: 'Branco Carrara',
      motor: '4.0 V8',
      quilometragem: 22000,
    }),
    vehicle('pucci_003', 'BMW', 'M4', 'Competition', 2023, 689000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Azul Portimão',
      motor: '3.0 biturbo',
      quilometragem: 5100,
    }),
    vehicle('pucci_004', 'BMW', 'X5', 'M50i xDrive', 2022, 549000, 'anunciado', {
      categoria: 'SUV',
      cor: 'Preto',
      motor: '4.4 V8',
      quilometragem: 28000,
    }),
    vehicle('pucci_005', 'Mercedes-AMG', 'GT', '63 S 4MATIC+', 2021, 998000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Prata Selenite',
      motor: '4.0 V8 biturbo',
      quilometragem: 15000,
    }),
    vehicle('pucci_006', 'Mercedes-Benz', 'GLE', '450 4MATIC', 2023, 589000, 'anunciado', {
      categoria: 'SUV',
      cor: 'Preto Obsidiana',
      motor: '3.0 inline-6',
      quilometragem: 12000,
    }),
    vehicle('pucci_007', 'Ferrari', 'Roma', '3.9 V8', 2021, 1890000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Vermelho Rosso',
      motor: '3.9 V8',
      quilometragem: 6200,
    }),
    vehicle('pucci_008', 'Aston Martin', 'DB11', 'V8 AMR', 2020, 1290000, 'anunciado', {
      categoria: 'Esportivo',
      cor: 'Verde British',
      motor: '4.0 V8',
      quilometragem: 18500,
    }),
    vehicle('pucci_009', 'Lamborghini', 'Huracán', 'EVO RWD', 2022, 2490000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Amarelo Giallo',
      motor: '5.2 V10',
      quilometragem: 4800,
    }),
    vehicle('pucci_010', 'Audi', 'R8', 'V10 Performance', 2021, 1190000, 'anunciado', {
      categoria: 'Esportivo',
      cor: 'Preto Mythos',
      motor: '5.2 V10',
      quilometragem: 9100,
    }),
    vehicle('pucci_011', 'McLaren', '570S', 'Coupe', 2019, 1090000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Laranja McLaren',
      motor: '3.8 V8 biturbo',
      quilometragem: 24000,
    }),
    vehicle('pucci_012', 'Bentley', 'Continental GT', 'V8', 2022, 1590000, 'anunciado', {
      categoria: 'Luxo',
      cor: 'Branco Glacier',
      motor: '4.0 V8',
      quilometragem: 7000,
    }),
    vehicle('pucci_013', 'Maserati', 'GranTurismo', 'Trofeo', 2024, 899000, 'pronto', {
      categoria: 'Esportivo',
      cor: 'Azul Emozione',
      motor: '3.0 V6 Nettuno',
      quilometragem: 2100,
    }),
    vehicle('pucci_014', 'Rolls-Royce', 'Ghost', 'Black Badge', 2020, 2890000, 'pronto', {
      categoria: 'Luxo',
      cor: 'Preto Diamond',
      motor: '6.75 V12',
      quilometragem: 16000,
    }),
    vehicle('pucci_015', 'Lexus', 'LC', '500 Inspiration', 2022, 649000, 'anunciado', {
      categoria: 'Esportivo',
      cor: 'Vermelho Infrared',
      motor: '5.0 V8',
      quilometragem: 11000,
    }),
    vehicle('pucci_016', 'Jaguar', 'F-Type', 'R AWD', 2021, 489000, 'preparacao', {
      categoria: 'Esportivo',
      cor: 'Branco Fuji',
      motor: '5.0 V8',
      quilometragem: 19000,
      observacoes: 'Em detalhamento estético — não publicado no site ainda.',
    }),
    vehicle('pucci_017', 'Land Rover', 'Range Rover Sport', 'SVR', 2022, 799000, 'preparacao', {
      categoria: 'SUV',
      cor: 'Verde Santorini',
      motor: '5.0 V8 SC',
      quilometragem: 25000,
      observacoes: 'Revisão mecânica em andamento.',
    }),
    vehicle('pucci_018', 'Volvo', 'XC90', 'Recharge T8', 2023, 429000, 'negociacao', {
      categoria: 'SUV',
      cor: 'Cinza Thunder',
      combustivel: 'hibrido',
      motor: '2.0 plug-in hybrid',
      quilometragem: 14000,
      observacoes: 'Em negociação de compra — ainda não no site.',
    }),
  ]
}

export function buildPucciDemoDatabase(): LpOrgDatabase {
  const now = new Date().toISOString()
  return {
    version: 7,
    organization: {
      id: ORG_ID,
      name: 'Pucci Motors',
      slug: DEMO_SLUG,
      createdAt: now,
    },
    vehicles: buildPucciDemoVehicles(),
    sales: [],
    expenses: [],
    customers: [],
    users: [
      {
        id: USER_ID,
        organizationId: ORG_ID,
        username: 'admin',
        password: 'PucciMotors123',
        nome: 'Administrador Pucci',
        role: 'admin',
        active: true,
        createdAt: now,
      },
    ],
    settings: [
      {
        id: 'settings_pucci',
        organizationId: ORG_ID,
        nomeEmpresa: 'Pucci Motors',
        nomeCurto: 'Pucci',
        slogan: 'Seminovos premium com transparência',
        logo: '',
        telefone: '(15) 3542-0000',
        whatsapp: '5515996532750',
        instagram: '@puccimotors',
        email: 'contato@puccimotors.com.br',
        endereco: 'Av. Principal, 1000 — Centro',
        cidade: 'Capão Bonito, SP',
        tema: 'dark',
        modoEscuro: true,
        brand: {
          presetId: 'lp',
          corPrimaria: '#C4A574',
          corSecundaria: '#0F766E',
          corFundo: '#0B1018',
          corSuperficie: '#121A26',
          corTexto: '#E8EEF6',
          corPainel: '#081018',
          aparencia: 'premium',
          atmosfera: 'showroom',
          intensidadeFoto: 42,
        },
        org: {
          alertDaysWarn: 30,
          alertDaysAlert: 45,
          alertDaysCritical: 60,
          minMarginPercent: 8,
          brandConcentrationLimit: 20,
          lowStockDemandGap: 15,
          docExpiryWarnDays: 30,
        },
        updatedAt: now,
      },
    ],
    history: [],
    documents: [],
    checklists: [],
    priceHistory: [],
    statusHistory: [],
    suppliers: [],
    payables: [],
    auditLogs: [],
  }
}

/** Atualiza fotos demo no Blob quando o mapa de imagens mudar (deploy). */
export async function refreshPucciDemoVehicleImages(store: JsonStore): Promise<number> {
  const org = store.findOrgBySlug(DEMO_SLUG)
  if (!org) return 0

  const rec = store.data().databases[org.id]
  const db = rec?.data as LpOrgDatabase | undefined
  if (!db?.vehicles?.length) return 0

  const seedById = new Map(buildPucciDemoVehicles().map((v) => [v.id, v]))
  let updated = 0

  for (const vehicle of db.vehicles) {
    const seed = seedById.get(vehicle.id)
    if (!seed) continue
    const nextUrl = seed.fotos[0] || ''
    if (!nextUrl || vehicle.fotos[0] === nextUrl) continue
    vehicle.fotos = [...seed.fotos]
    vehicle.fotoPrincipal = seed.fotoPrincipal
    updated++
  }

  if (updated > 0) {
    store.markDirty()
    await store.persist()
  }

  return updated
}

/** Garante org demo Pucci Motors no Blob (só se ainda não existir ou estiver vazia). */
export async function ensurePucciMotorsDemo(store: JsonStore): Promise<boolean> {
  const existing = store.findOrgBySlug(DEMO_SLUG)
  const rec = existing ? store.data().databases[existing.id] : null
  const vehicles = (rec?.data as LpOrgDatabase | undefined)?.vehicles || []

  if (existing && vehicles.length > 0) return false

  const now = new Date().toISOString()
  const org: CloudOrg = existing || {
    id: ORG_ID,
    name: 'Pucci Motors',
    slug: DEMO_SLUG,
    createdAt: now,
  }

  store.data().organizations[org.id] = org

  const user: CloudUser = {
    id: USER_ID,
    organizationId: org.id,
    username: 'admin',
    passwordHash: hashPassword('PucciMotors123'),
    nome: 'Administrador Pucci',
    role: 'admin',
    active: true,
  }
  store.data().users[user.id] = user

  store.data().databases[org.id] = {
    version: 1,
    updatedAt: now,
    data: buildPucciDemoDatabase(),
  }

  store.markDirty()
  await store.persist()
  return true
}

export const PUCCI_DEMO_CREDENTIALS = {
  store: DEMO_SLUG,
  username: 'admin',
  password: 'PucciMotors123',
} as const
