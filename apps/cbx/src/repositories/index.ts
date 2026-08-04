import type { Product, Category, Store, User, Conversation, Message, AppNotification, Review, Banner, Promotion, Plan, Address, Purchase, HistoryItem, Company } from '@/types'
import {
  products,
  categories,
  stores,
  users,
  conversations,
  messages,
  notifications,
  reviews,
  banners,
  promotions,
  plans,
  addresses,
  purchases,
  history,
  companies,
  CURRENT_USER_ID,
} from '@/mocks'

/** Mock repository — swap implementations when Prisma/Neon lands. */
export const productRepository = {
  findAll: (): Product[] => products.filter((p) => p.status === 'ativo'),
  findById: (id: string): Product | undefined => products.find((p) => p.id === id),
  findByCategory: (categoryId: string): Product[] =>
    products.filter((p) => p.categoryId === categoryId && p.status === 'ativo'),
  findBySeller: (sellerId: string): Product[] =>
    products.filter((p) => p.sellerId === sellerId),
  findSponsored: (): Product[] => products.filter((p) => p.sponsored && p.status === 'ativo'),
  findFeatured: (): Product[] => products.filter((p) => p.featured && p.status === 'ativo'),
  search: (query: string): Product[] => {
    const q = query.toLowerCase().trim()
    if (!q) return productRepository.findAll()
    return products.filter(
      (p) =>
        p.status === 'ativo' &&
        (p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))),
    )
  },
  findRelated: (productId: string, limit = 6): Product[] => {
    const product = productRepository.findById(productId)
    if (!product) return []
    return products
      .filter(
        (p) =>
          p.id !== productId &&
          p.status === 'ativo' &&
          (p.categoryId === product.categoryId || p.sellerId === product.sellerId),
      )
      .slice(0, limit)
  },
  findRecent: (limit = 8): Product[] =>
    [...productRepository.findAll()]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, limit),
  findMostViewed: (limit = 8): Product[] =>
    [...productRepository.findAll()]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit),
}

export const categoryRepository = {
  findAll: (): Category[] => categories,
  findBySlug: (slug: string): Category | undefined =>
    categories.find((c) => c.slug === slug),
  findById: (id: string): Category | undefined =>
    categories.find((c) => c.id === id),
}

export const userRepository = {
  findById: (id: string): User | undefined => users.find((u) => u.id === id),
  findCurrent: (): User => users.find((u) => u.id === CURRENT_USER_ID)!,
  findAll: (): User[] => users,
}

export const storeRepository = {
  findAll: (): Store[] => stores,
  findById: (id: string): Store | undefined => stores.find((s) => s.id === id),
  findBySlug: (slug: string): Store | undefined =>
    stores.find((s) => s.slug === slug),
}

export const companyRepository = {
  findAll: (): Company[] => companies,
  findById: (id: string): Company | undefined => companies.find((c) => c.id === id),
}

export const conversationRepository = {
  findAll: (): Conversation[] =>
    [...conversations].sort(
      (a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt),
    ),
  findById: (id: string): Conversation | undefined =>
    conversations.find((c) => c.id === id),
  findMessages: (conversationId: string): Message[] =>
    messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
}

export const notificationRepository = {
  findAll: (): AppNotification[] =>
    [...notifications].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
  unreadCount: (): number => notifications.filter((n) => !n.read).length,
}

export const reviewRepository = {
  findByTarget: (targetId: string): Review[] =>
    reviews.filter((r) => r.targetId === targetId),
}

export const bannerRepository = {
  findAll: (): Banner[] => banners,
  findPromotions: (): Promotion[] => promotions,
}

export const planRepository = {
  findAll: (): Plan[] => plans,
}

export const addressRepository = {
  findAll: (): Address[] => addresses,
}

export const purchaseRepository = {
  findAll: (): Purchase[] => purchases,
  findHistory: (): HistoryItem[] => history,
}
