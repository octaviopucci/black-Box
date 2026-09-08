'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'
import { PRODUCT_CATEGORIES } from '@/modules/products/domain/catalog-status'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
}

type Offer = {
  id: string
  name: string
  slug: string
  description: string | null
  price: string
  currency: string
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
}

type ProductDetailClientProps = {
  productId: string
  canUpdateProduct: boolean
  canCreateOffer: boolean
  canUpdateOffer: boolean
}

function formatMoney(price: string, currency: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(Number(price))
}

export function ProductDetailClient({
  productId,
  canUpdateProduct,
  canCreateOffer,
  canUpdateOffer,
}: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productRes, offersRes] = await Promise.all([
        fetch(`/api/products/${productId}`),
        fetch(`/api/products/${productId}/offers`),
      ])
      const productData = await productRes.json()
      if (!productRes.ok) throw new Error(productData?.error?.message ?? 'Failed to load product')
      setProduct(productData.product)
      if (offersRes.ok) {
        const offersData = await offersRes.json()
        setOffers(offersData.offers ?? [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  async function onUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!product || !canUpdateProduct) return
    setSaving(true)
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') ?? ''),
          description: String(form.get('description') ?? '') || null,
          category: String(form.get('category') ?? '') || null,
          status: String(form.get('status') ?? product.status),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update product')
      setProduct(data.product)
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  async function onCreateOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canCreateOffer) return
    setActionError(null)
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch(`/api/products/${productId}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('offerName') ?? ''),
          description: String(form.get('offerDescription') ?? '') || undefined,
          price: Number(form.get('price') ?? 0),
          currency: String(form.get('currency') ?? 'BRL'),
          status: String(form.get('offerStatus') ?? 'DRAFT'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create offer')
      event.currentTarget.reset()
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create offer')
    }
  }

  async function updateOfferStatus(offerId: string, status: Offer['status']) {
    if (!canUpdateOffer) return
    try {
      const res = await fetch(`/api/products/${productId}/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update offer')
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update offer')
    }
  }

  if (loading) return <LoadingState title="Carregando produto…" />
  if (error || !product) {
    return (
      <ErrorState
        title="Produto não encontrado"
        description={error ?? 'Recurso indisponível'}
        action={
          <Link href="/app/products">
            <Button variant="secondary">Voltar</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/products" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="text-sm text-zinc-400">
          {product.slug} · {product.status}
        </p>
      </div>

      {actionError ? (
        <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          {actionError}
        </p>
      ) : null}

      {canUpdateProduct ? (
        <Card>
          <h2 className="font-medium">Editar produto</h2>
          <form onSubmit={(e) => void onUpdateProduct(e)} className="mt-4 space-y-3">
            <input name="name" defaultValue={product.name} required className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
            <textarea name="description" defaultValue={product.description ?? ''} rows={3} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
            <select name="category" defaultValue={product.category ?? ''} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
              <option value="">Sem categoria</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <select name="status" defaultValue={product.status} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <Button type="submit" disabled={saving}>
              Salvar produto
            </Button>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-medium">Offers</h2>
          {canCreateOffer ? (
            <Link href={`/app/products/${productId}/offers/new`}>
              <Button variant="secondary">Nova oferta</Button>
            </Link>
          ) : null}
        </div>

        {offers.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Nenhuma oferta vinculada.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {offers.map((offer) => (
              <li key={offer.id} className="rounded-lg border border-zinc-800 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-medium text-zinc-100">{offer.name}</h3>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      {formatMoney(offer.price, offer.currency)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {offer.slug} · {offer.status}
                    </p>
                    {offer.description ? (
                      <p className="mt-2 text-sm text-zinc-400">{offer.description}</p>
                    ) : null}
                  </div>
                  {canUpdateOffer ? (
                    <div className="flex flex-wrap gap-2">
                      {offer.status !== 'ACTIVE' ? (
                        <Button variant="secondary" onClick={() => void updateOfferStatus(offer.id, 'ACTIVE')}>
                          Ativar
                        </Button>
                      ) : null}
                      {offer.status === 'ACTIVE' ? (
                        <Button variant="secondary" onClick={() => void updateOfferStatus(offer.id, 'INACTIVE')}>
                          Desativar
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}

        {canCreateOffer ? (
          <form onSubmit={(e) => void onCreateOffer(e)} className="mt-6 space-y-3 border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-medium text-zinc-300">Nova oferta rápida</h3>
            <input name="offerName" required placeholder="Nome da oferta" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
            <textarea name="offerDescription" rows={2} placeholder="Descrição comercial" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input name="price" type="number" min={0} step="0.01" required placeholder="Preço" className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
              <input name="currency" defaultValue="BRL" maxLength={3} className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
            </div>
            <select name="offerStatus" defaultValue="DRAFT" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm">
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <Button type="submit">Criar oferta</Button>
          </form>
        ) : null}
      </Card>
    </div>
  )
}
