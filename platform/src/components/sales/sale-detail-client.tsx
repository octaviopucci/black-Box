'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { ErrorState, LoadingState } from '@/components/ui/states'

type SaleDetailClientProps = {
  saleId: string
  canUpdate: boolean
  canConfirmPayment: boolean
}

type SaleDetail = {
  id: string
  status: 'DRAFT' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'
  productNameSnapshot: string
  offerNameSnapshot: string
  listPrice: string
  finalPrice: string
  currency: string
  soldAt: string | null
  paidAt: string | null
  paymentMethod: string | null
  paymentReference: string | null
  createdAt: string
  customer: { id: string; name: string; email: string | null; companyName: string | null }
  partner: { id: string; name: string } | null
}

function formatMoney(value: string, currency: string) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(Number(value))
}

function StatusBadge({ status }: { status: SaleDetail['status'] }) {
  const styles = {
    DRAFT: 'bg-zinc-800 text-zinc-300',
    PENDING_PAYMENT: 'bg-amber-950 text-amber-300',
    PAID: 'bg-emerald-950 text-emerald-300',
    CANCELED: 'bg-red-950/60 text-red-300',
  } as const
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export function SaleDetailClient({ saleId, canUpdate, canConfirmPayment }: SaleDetailClientProps) {
  const [sale, setSale] = useState<SaleDetail | null>(null)
  const [lead, setLead] = useState<{ id: string; name: string; email: string | null } | null>(null)
  const [opportunity, setOpportunity] = useState<{ id: string; title: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadSale = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sales/${saleId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load sale')
      setSale(data.sale)
      setLead(data.lead ?? null)
      setOpportunity(data.opportunity ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sale')
    } finally {
      setLoading(false)
    }
  }, [saleId])

  useEffect(() => {
    void loadSale()
  }, [loadSale])

  async function updateStatus(nextStatus: SaleDetail['status']) {
    setActionError(null)
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to update sale')
      await loadSale()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update sale')
    }
  }

  async function confirmPayment() {
    setActionError(null)
    try {
      const res = await fetch(`/api/sales/${saleId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'manual', paymentReference: 'internal' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to confirm payment')
      await loadSale()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to confirm payment')
    }
  }

  if (loading) return <LoadingState title="Loading sale..." />
  if (error || !sale) {
    return (
      <ErrorState
        title="Failed to load sale"
        description={error ?? 'Sale not found'}
        action={
          <Button variant="secondary" onClick={() => void loadSale()}>
            Retry
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/sales" className="text-sm text-zinc-400 hover:text-zinc-200">
          ← Back to sales
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{sale.offerNameSnapshot}</h1>
          <StatusBadge status={sale.status} />
        </div>
      </div>

      {actionError && <ErrorState title="Action failed" description={actionError} />}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h2 className="font-medium text-zinc-200">Commercial</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Product</dt>
              <dd>{sale.productNameSnapshot}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">List price</dt>
              <dd>{formatMoney(sale.listPrice, sale.currency)}</dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt className="text-zinc-500">Final price</dt>
              <dd className="text-lg">{formatMoney(sale.finalPrice, sale.currency)}</dd>
            </div>
          </dl>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="font-medium text-zinc-200">Parties</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">Customer</dt>
              <dd>
                <Link href={`/app/customers/${sale.customer.id}`} className="text-zinc-100 hover:underline">
                  {sale.customer.name}
                </Link>
              </dd>
            </div>
            {lead && (
              <div>
                <dt className="text-zinc-500">Original lead</dt>
                <dd>{lead.name}</dd>
              </div>
            )}
            {opportunity && (
              <div>
                <dt className="text-zinc-500">Opportunity</dt>
                <dd>{opportunity.title}</dd>
              </div>
            )}
            <div>
              <dt className="text-zinc-500">Partner</dt>
              <dd>{sale.partner?.name ?? '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="space-y-3 p-5 md:col-span-2">
          <h2 className="font-medium text-zinc-200">Payment</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-zinc-500">Sold at</dt>
              <dd>{sale.soldAt ? new Date(sale.soldAt).toLocaleString('pt-BR') : '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Paid at</dt>
              <dd>{sale.paidAt ? new Date(sale.paidAt).toLocaleString('pt-BR') : '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Method</dt>
              <dd>{sale.paymentMethod ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Reference</dt>
              <dd>{sale.paymentReference ?? '—'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {canUpdate && sale.status === 'DRAFT' && (
          <Button onClick={() => void updateStatus('PENDING_PAYMENT')}>Send to payment</Button>
        )}
        {canConfirmPayment && sale.status === 'PENDING_PAYMENT' && (
          <Button onClick={() => void confirmPayment()}>Confirm payment</Button>
        )}
        {canUpdate && (sale.status === 'DRAFT' || sale.status === 'PENDING_PAYMENT') && (
          <Button variant="secondary" onClick={() => void updateStatus('CANCELED')}>
            Cancel sale
          </Button>
        )}
      </div>
    </div>
  )
}
