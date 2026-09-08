'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui/primitives'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

type Lead = {
  id: string
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  source: string | null
  createdAt: string
  partner?: { id: string; name: string } | null
}

type LeadsPageClientProps = {
  canCreate: boolean
}

export function LeadsPageClient({ canCreate }: LeadsPageClientProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('')
  const [total, setTotal] = useState(0)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (source.trim()) params.set('source', source.trim())
      const res = await fetch(`/api/leads?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load leads')
      setLeads(data.leads ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [search, source])

  useEffect(() => {
    void loadLeads()
  }, [loadLeads])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-zinc-400">
            Prospective contacts for your commercial operation.
          </p>
        </div>
        {canCreate ? (
          <Link href="/app/leads/new">
            <Button>New Lead</Button>
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search name, company, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 sm:max-w-md"
        />
        <input
          type="text"
          placeholder="Filter by source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 sm:max-w-xs"
        />
        <Button variant="secondary" onClick={() => void loadLeads()}>
          Apply
        </Button>
      </div>

      {loading ? (
        <LoadingState title="Loading leads…" />
      ) : error ? (
        <ErrorState
          title="Could not load leads"
          description={error}
          action={
            <Button variant="secondary" onClick={() => void loadLeads()}>
              Retry
            </Button>
          }
        />
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads yet"
          description="Create your first lead to start building your pipeline foundation."
          action={
            canCreate ? (
              <Link href="/app/leads/new">
                <Button>Create lead</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-xs text-zinc-500">{total} lead(s)</p>
          <div className="hidden overflow-x-auto rounded-xl border border-zinc-800 md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Partner</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-zinc-800/80 hover:bg-zinc-900/40">
                    <td className="px-4 py-3">
                      <Link href={`/app/leads/${lead.id}`} className="font-medium text-zinc-100 hover:underline">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{lead.companyName ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{lead.email ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{lead.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{lead.partner?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-300">{lead.source ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {leads.map((lead) => (
              <Link key={lead.id} href={`/app/leads/${lead.id}`}>
                <Card className="transition hover:border-zinc-600">
                  <h2 className="font-medium text-zinc-100">{lead.name}</h2>
                  {lead.companyName ? (
                    <p className="mt-1 text-sm text-zinc-400">{lead.companyName}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                    {lead.email ? <span>{lead.email}</span> : null}
                    {lead.source ? <span>· {lead.source}</span> : null}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
