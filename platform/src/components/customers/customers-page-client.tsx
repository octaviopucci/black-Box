'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string | null
  companyName: string | null
  status: 'ACTIVE' | 'INACTIVE'
  salesCount: number
  lastSale: { finalPrice: string; status: string; createdAt: string } | null
}

export function CustomersPageClient() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      const res = await fetch(`/api/customers?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load customers')
      setCustomers(data.customers ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    void loadCustomers()
  }, [loadCustomers])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-zinc-400">Commercial customer registry</p>
      </div>

      <Card className="space-y-4 p-4">
        <input
          type="search"
          placeholder="Search name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:max-w-md"
        />

        {loading && <LoadingState title="Loading customers..." />}
        {error && (
          <ErrorState
            title="Failed to load customers"
            description={error}
            action={
              <Button variant="secondary" onClick={() => void loadCustomers()}>
                Retry
              </Button>
            }
          />
        )}
        {!loading && !error && customers.length === 0 && (
          <EmptyState title="No customers yet" description="Customers are created from sales or lead conversion." />
        )}

        {!loading && !error && customers.length > 0 && (
          <div className="space-y-3">
            {customers.map((customer) => (
              <Card key={customer.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/app/customers/${customer.id}`} className="font-medium hover:underline">
                    {customer.name}
                  </Link>
                  {customer.companyName && (
                    <p className="text-sm text-zinc-400">{customer.companyName}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    {[customer.email, customer.phone].filter(Boolean).join(' · ') || 'No contact info'}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{customer.salesCount} sale(s)</p>
                  {customer.lastSale && (
                    <p className="text-zinc-400">
                      Last: R$ {customer.lastSale.finalPrice} ({customer.lastSale.status})
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
