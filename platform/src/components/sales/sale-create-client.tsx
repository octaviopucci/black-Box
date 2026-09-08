'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

type SaleCreateClientProps = {
  canOverridePrice: boolean
}

type OfferOption = {
  id: string
  name: string
  price: string
  currency: string
  product: { name: string }
}

type CustomerOption = {
  id: string
  name: string
  email: string | null
}

export function SaleCreateClient({ canOverridePrice }: SaleCreateClientProps) {
  const router = useRouter()
  const [offers, setOffers] = useState<OfferOption[]>([])
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [offerId, setOfferId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [leadId, setLeadId] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PENDING_PAYMENT'>('PENDING_PAYMENT')

  const selectedOffer = offers.find((o) => o.id === offerId)

  const loadOptions = useCallback(async () => {
    setLoading(true)
    try {
      const [offersRes, customersRes] = await Promise.all([
        fetch('/api/offers?status=ACTIVE&pageSize=100'),
        fetch('/api/customers?pageSize=100'),
      ])
      const offersData = await offersRes.json()
      const customersData = await customersRes.json()
      if (!offersRes.ok) throw new Error(offersData?.error?.message ?? 'Failed to load offers')
      if (!customersRes.ok) throw new Error(customersData?.error?.message ?? 'Failed to load customers')
      setOffers(offersData.offers ?? [])
      setCustomers(customersData.customers ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load options')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOptions()
  }, [loadOptions])

  useEffect(() => {
    if (selectedOffer && !finalPrice) {
      setFinalPrice(selectedOffer.price)
    }
  }, [selectedOffer, finalPrice])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const body: Record<string, string> = { offerId, status }
      if (customerId) body.customerId = customerId
      if (leadId) body.leadId = leadId
      if (canOverridePrice && finalPrice) body.finalPrice = finalPrice

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to create sale')
      router.push(`/app/sales/${data.sale.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sale')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingState title="Loading form..." />

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/app/sales" className="text-sm text-zinc-400 hover:text-zinc-200">
          ← Back to sales
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New sale</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm text-zinc-400">Offer *</span>
            <select
              required
              value={offerId}
              onChange={(e) => setOfferId(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="">Select offer</option>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.product.name} (R$ {o.price})
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-400">Customer</span>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="">Select existing customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.email ? `(${c.email})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-400">Or lead ID (creates customer)</span>
            <input
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              placeholder="Lead UUID"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
          </label>

          {canOverridePrice && (
            <label className="block space-y-1">
              <span className="text-sm text-zinc-400">Final price</span>
              <input
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              />
            </label>
          )}

          <label className="block space-y-1">
            <span className="text-sm text-zinc-400">Initial status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PENDING_PAYMENT')}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PENDING_PAYMENT">Pending payment</option>
            </select>
          </label>

          {error && <ErrorState title="Failed to create sale" description={error} />}
          <Button type="submit" disabled={submitting || (!customerId && !leadId)}>
            {submitting ? 'Creating...' : 'Create sale'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
