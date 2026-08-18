import type { Product, Category, User } from '@/types'
import { productService, categoryService, userService } from '@/services'

const isApiEnabled = () => process.env.NEXT_PUBLIC_USE_API === '1'

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Erro ${res.status}`)
  }
  return data as T
}

/** Hybrid client: API when server mode + DATABASE_URL; mocks otherwise. */
export const liveCatalog = {
  async listProducts(params?: { q?: string; categoryId?: string; sellerId?: string }): Promise<Product[]> {
    if (!isApiEnabled()) return productService.list()
    try {
      const qs = new URLSearchParams()
      if (params?.q) qs.set('q', params.q)
      if (params?.categoryId) qs.set('categoryId', params.categoryId)
      if (params?.sellerId) qs.set('sellerId', params.sellerId)
      const data = await api<{ products: Product[] }>(`/api/products?${qs.toString()}`)
      return data.products
    } catch {
      return productService.list()
    }
  },

  async getProduct(id: string): Promise<Product | undefined> {
    if (!isApiEnabled()) return productService.get(id)
    try {
      const data = await api<{ product: Product }>(`/api/products/${id}`)
      return data.product
    } catch {
      return productService.get(id)
    }
  },

  async listCategories(): Promise<Category[]> {
    if (!isApiEnabled()) return categoryService.list()
    try {
      const data = await api<{ categories: Category[] }>('/api/categories')
      return data.categories
    } catch {
      return categoryService.list()
    }
  },

  async register(input: {
    name: string
    email: string
    password: string
    phone?: string
  }): Promise<User> {
    const data = await api<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return data.user
  },

  async publish(input: {
    title: string
    description: string
    price: number
    condition: 'novo' | 'seminovo' | 'usado'
    categoryId: string
    images: string[]
    neighborhood: string
    tags?: string[]
  }): Promise<Product> {
    const data = await api<{ product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return data.product
  },

  async me(): Promise<{ user: User; products: Product[] } | null> {
    if (!isApiEnabled()) {
      return { user: userService.current(), products: productService.bySeller(userService.current().id) }
    }
    try {
      return await api('/api/me')
    } catch {
      return null
    }
  },

  async billingMe() {
    if (!isApiEnabled()) {
      const user = userService.current()
      return {
        user,
        gate: {
          canPublish: user.plan !== 'gratuito',
          reason: user.plan === 'gratuito' ? 'subscription' : 'ok',
          activeAds: productService.bySeller(user.id).filter((p) => p.status === 'ativo').length,
          adsLimit: user.adsLimit ?? 0,
        },
      }
    }
    return api<{
      user: User
      gate: {
        canPublish: boolean
        reason: 'ok' | 'subscription' | 'limit' | 'missing'
        activeAds: number
        adsLimit: number
      }
    }>('/api/billing/me')
  },

  async createPix(planId: string) {
    return api<{ payment: PixPayment }>('/api/billing/pix', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    })
  },

  async getPayment(id: string) {
    return api<{ payment: PixPayment }>(`/api/billing/payments/${id}`)
  },

  async sandboxConfirm(paymentId: string) {
    return api<{ payment: PixPayment }>('/api/billing/sandbox-confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentId }),
    })
  },
}

export type PixPayment = {
  id: string
  plan: string
  amount: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  pixCopyPaste: string | null
  pixQrImage: string | null
  pixExpiresAt: string | null
  provider: string
  paidAt: string | null
  periodEnd: string | null
  createdAt: string
  sandbox: boolean
}
