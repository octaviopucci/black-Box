import type { OrgDatabase } from './types'

const DEFAULT_CATEGORIES = [
  {
    slug: 'iphones',
    name: 'iPhones',
    description: 'Linha completa Apple — novos e seminovos',
    image: 'https://images.unsplash.com/photo-1592286927505-4eed024c85d2?w=800&q=80',
    featured: true,
  },
  {
    slug: 'airpods-fones',
    name: 'AirPods & Fones',
    description: 'AirPods, fones Bluetooth e acessórios de áudio',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80',
    featured: true,
  },
  {
    slug: 'apple-watch',
    name: 'Apple Watch',
    description: 'Relógios inteligentes Apple Watch',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80',
    featured: true,
  },
  {
    slug: 'acessorios',
    name: 'Acessórios',
    description: 'Capas, películas, carregadores e mais',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',
  },
  {
    slug: 'manutencao',
    name: 'Manutenção',
    description: 'Serviços de reparo e manutenção',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886220?w=800&q=80',
  },
]

export function buildEmptyStoreDatabase(input: {
  orgId: string
  orgName: string
  slug: string
  userId: string
  username: string
  password: string
  ownerName: string
  city?: string
  phone?: string
}): OrgDatabase {
  const now = new Date().toISOString()
  const storeId = `store_${Date.now().toString(36)}`

  const categories = DEFAULT_CATEGORIES.map((c, i) => ({
    id: `cat_${i + 1}`,
    organizationId: input.orgId,
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    featured: c.featured,
    active: true,
    createdAt: now,
    updatedAt: now,
  }))

  return {
    version: 1,
    organization: {
      id: input.orgId,
      name: input.orgName,
      slug: input.slug,
      createdAt: now,
    },
    stores: [
      {
        id: storeId,
        organizationId: input.orgId,
        name: input.orgName,
        city: input.city,
        phone: input.phone,
        active: true,
        createdAt: now,
      },
    ],
    categories,
    products: [],
    inventory: [],
    customers: [],
    interactions: [],
    settings: {
      id: 'settings_default',
      organizationId: input.orgId,
      storeName: input.orgName,
      whatsapp: input.phone || '5511999999999',
      hours: 'Seg–Sex 9h–18h · Sáb 9h–13h',
      topBarMessage: '🔥 Ofertas especiais toda semana • Atendimento rápido pelo WhatsApp',
      promoBarMessage: '🔥 Semana especial — confira nossas ofertas',
      city: input.city,
      updatedAt: now,
    },
    users: [
      {
        id: input.userId,
        organizationId: input.orgId,
        username: input.username,
        password: input.password,
        nome: input.ownerName,
        role: 'admin',
        active: true,
        createdAt: now,
      },
    ],
    auditLogs: [
      {
        id: `aud_${Date.now().toString(36)}`,
        organizationId: input.orgId,
        userId: input.userId,
        username: input.username,
        action: 'org.register',
        entityType: 'organization',
        entityId: input.orgId,
        detail: `Loja ${input.orgName} cadastrada`,
        createdAt: now,
      },
    ],
  }
}
