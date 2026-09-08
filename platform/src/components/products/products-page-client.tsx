'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { PRODUCT_CATEGORIES } from '@/modules/products/domain/catalog-status'

type Product = {
  id: string
  name: string
  slug: string
  category: string | null
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
  offerCount: number
  updatedAt: string
}

type ProductsPageClientProps = {
  canCreate: boolean
  canUpdate: boolean
}

function formatCategory(value: string | null) {
  if (!value) return '—'
  return value.replace(/_/g, ' ')
}

function StatusBadge({ status }: { status: Product['status'] }) {
  const styles = {
    DRAFT: 'bg-zinc-800 text-zinc-300',
    ACTIVE: 'bg-emerald-950 text-emerald-300',
    INACTIVE: 'bg-red-950/60 text-red-300',
  } as const
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

export function ProductsPageClient({ canCreate, canUpdate }: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [total, setTotal] = useState(0)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)
      if (category) params.set('category', category)
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load products')
      setProducts(data.products ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [search, status, category])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  async function setProductStatus(productId: string, nextStatus: Product['status']) {
    if (!canUpdate) return
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error?.message ?? 'Failed to update product')
      }
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-zinc-400">
            Catálogo comercial — serviços e soluções vendáveis da organização.
          </p>
        </div>
        {canCreate ? (
          <Link href="/app/products/new">
            <Button>Novo produto</Button>
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar nome, slug, descrição…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:max-w-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        >
          <option value="">Todos os status</option>
          <option value="DRAFT">DRAFT</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        >
          <option value="">Todas categorias</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {formatCategory(c)}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={() => void loadProducts()}>
          Aplicar
        </Button>
      </div>

      {loading ? (
        <LoadingState title="Carregando produtos…" />
      ) : error ? (
        <ErrorState
          title="Não foi possível carregar produtos"
          description={error}
          action={
            <Button variant="secondary" onClick={() => void loadProducts()}>
              Tentar novamente
            </Button>
          }
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Nenhum produto"
          description="Crie o primeiro produto do catálogo comercial."
          action={
            canCreate ? (
              <Link href="/app/products/new">
                <Button>Criar produto</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-xs text-zinc-500">{total} produto(s)</p>
          <div className="hidden overflow-x-auto rounded-xl border border-zinc-800 md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ofertas</th>
                  <th className="px-4 py-3 font-medium">Atualizado</th>
                  <th className="px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-zinc-800/80 hover:bg-zinc-900/40">
                    <td className="px-4 py-3">
                      <Link href={`/app/products/${product.id}`} className="font-medium hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{formatCategory(product.category)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{product.offerCount}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/app/products/${product.id}`}>
                          <Button variant="secondary">Ver</Button>
                        </Link>
                        {canUpdate && product.status !== 'ACTIVE' ? (
                          <Button variant="secondary" onClick={() => void setProductStatus(product.id, 'ACTIVE')}>
                            Ativar
                          </Button>
                        ) : null}
                        {canUpdate && product.status === 'ACTIVE' ? (
                          <Button variant="secondary" onClick={() => void setProductStatus(product.id, 'INACTIVE')}>
                            Desativar
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/app/products/${product.id}`} className="font-medium hover:underline">
                    {product.name}
                  </Link>
                  <StatusBadge status={product.status} />
                </div>
                <p className="mt-2 text-sm text-zinc-400">{formatCategory(product.category)}</p>
                <p className="mt-1 text-xs text-zinc-500">{product.offerCount} oferta(s)</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
