import type { Product, Category, User } from '@/types'
import { productService, categoryService, userService } from '@/services'

const useApi = () =>
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_USE_API === '1'
    : process.env.NEXT_PUBLIC_USE_API === '1'

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
    if (!useApi()) return productService.list()
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
    if (!useApi()) return productService.get(id)
    try {
      const data = await api<{ product: Product }>(`/api/products/${id}`)
      return data.product
    } catch {
      return productService.get(id)
    }
  },

  async listCategories(): Promise<Category[]> {
    if (!useApi()) return categoryService.list()
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
    if (!useApi()) {
      return { user: userService.current(), products: productService.bySeller(userService.current().id) }
    }
    try {
      return await api('/api/me')
    } catch {
      return null
    }
  },
}
