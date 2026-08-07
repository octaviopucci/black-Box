'use client'

import { useEffect, useMemo, useState } from 'react'
import { liveCatalog } from '@/lib/live-catalog'
import { categoryService, productService, userService } from '@/services'
import type { Category, Product, User } from '@/types'

const apiOn = () => process.env.NEXT_PUBLIC_USE_API === '1'

/** Home / browse: mocks first, then API when server mode is on. */
export function useLiveProducts(params?: { q?: string; categoryId?: string }) {
  const q = params?.q
  const categoryId = params?.categoryId
  const [products, setProducts] = useState<Product[]>(() => {
    if (q) return productService.search(q)
    if (categoryId) return productService.byCategory(categoryId)
    return productService.list()
  })
  const [loading, setLoading] = useState(apiOn())

  useEffect(() => {
    let cancelled = false
    setLoading(apiOn())
    liveCatalog
      .listProducts({ q, categoryId })
      .then((list) => {
        if (!cancelled) setProducts(list)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [q, categoryId])

  return { products, loading }
}

export function useLiveCategories() {
  const [categories, setCategories] = useState<Category[]>(() => categoryService.list())

  useEffect(() => {
    let cancelled = false
    liveCatalog.listCategories().then((list) => {
      if (!cancelled) setCategories(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return categories
}

export function useMyListings() {
  const [user, setUser] = useState<User>(() => userService.current())
  const [products, setProducts] = useState<Product[]>(() =>
    productService.bySeller(userService.current().id),
  )
  const [loading, setLoading] = useState(apiOn())

  useEffect(() => {
    let cancelled = false
    liveCatalog
      .me()
      .then((data) => {
        if (!cancelled && data) {
          setUser(data.user)
          setProducts(data.products)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { user, products, loading }
}

export function useLiveProduct(id: string, initial?: Product) {
  const [product, setProduct] = useState<Product | undefined>(
    () => initial ?? productService.get(id),
  )

  useEffect(() => {
    let cancelled = false
    liveCatalog.getProduct(id).then((p) => {
      if (!cancelled && p) setProduct(p)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  const related = useMemo(() => {
    if (!product) return []
    return productService.related(product.id).filter((p) => p.id !== product.id)
  }, [product])

  return { product, related }
}
