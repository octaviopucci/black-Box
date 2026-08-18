export type ProductCondition = 'novo' | 'seminovo' | 'usado'

export type PlanTier =
  | 'gratuito'
  | 'starter'
  | 'premium'
  | 'empresarial'
  | 'empresarial_ilimitado'

export type SubscriptionStatus = 'none' | 'pending' | 'active' | 'expired' | 'canceled'

export type SellerPlanId = Exclude<PlanTier, 'gratuito'>

export type AdStatus = 'ativo' | 'pausado' | 'vendido' | 'rascunho' | 'expirado'

export type NotificationType =
  | 'mensagem'
  | 'favorito'
  | 'sistema'
  | 'promocao'
  | 'anuncio'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  city: string
  state: string
  bio?: string
  verified: boolean
  phoneVerified: boolean
  memberSince: string
  plan: PlanTier
  rating: number
  reviewCount: number
  salesCount: number
  adsCount: number
  subscriptionStatus?: SubscriptionStatus
  planExpiresAt?: string | null
  adsLimit?: number
  canPublish?: boolean
  activeAds?: number
}

export interface Address {
  id: string
  label: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zip: string
  isDefault: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  productCount: number
  image: string
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  oldPrice?: number
  condition: ProductCondition
  images: string[]
  categoryId: string
  sellerId: string
  storeId?: string
  city: string
  neighborhood: string
  createdAt: string
  views: number
  favorites: number
  status: AdStatus
  sponsored?: boolean
  featured?: boolean
  tags: string[]
  specs: Record<string, string>
  location: { lat: number; lng: number }
}

export interface Store {
  id: string
  name: string
  slug: string
  logo: string
  cover: string
  description: string
  city: string
  verified: boolean
  rating: number
  reviewCount: number
  productCount: number
  plan: PlanTier
  category: string
  phone: string
  whatsapp: string
  address: string
}

export interface Company {
  id: string
  name: string
  logo: string
  cover: string
  description: string
  category: string
  city: string
  verified: boolean
  rating: number
  storeId?: string
}

export interface Review {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  targetId: string
  targetType: 'seller' | 'store' | 'product'
  rating: number
  comment: string
  createdAt: string
}

export interface Conversation {
  id: string
  productId: string
  productTitle: string
  productImage: string
  participantId: string
  participantName: string
  participantAvatar: string
  lastMessage: string
  lastMessageAt: string
  unread: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  createdAt: string
  read: boolean
}

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  cta: string
  href: string
  tone: 'primary' | 'secondary' | 'accent' | 'dark'
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: string
  image: string
  productIds: string[]
  endsAt: string
}

export interface Plan {
  id: SellerPlanId
  name: string
  price: number
  period: string
  adsLimit: number | null
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

export interface Purchase {
  id: string
  productId: string
  productTitle: string
  productImage: string
  price: number
  date: string
  status: 'concluida' | 'em_andamento' | 'cancelada'
  sellerName: string
}

export interface HistoryItem {
  id: string
  productId: string
  viewedAt: string
}
