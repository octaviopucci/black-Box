'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui/primitives'
import { LoadingState, ErrorState } from '@/components/ui/states'

type OrganizationOption = {
  id: string
  name: string
  slug: string
}

export default function SelectOrganizationPage() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error?.message ?? 'Failed to load session')

        if (data.organization) {
          router.replace('/app')
          return
        }

        setOrganizations(data.availableOrganizations ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load organizations')
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  async function selectOrganization(organizationId: string) {
    setSubmitting(organizationId)
    setError(null)
    try {
      const res = await fetch('/api/organizations/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Selection failed')
      router.replace('/app')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Selection failed')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return <LoadingState title="Loading organizations" description="Checking your memberships." />
  }

  if (error) {
    return <ErrorState title="Unable to continue" description={error} />
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Select organization</h1>
      <p className="text-sm text-zinc-400">Your account belongs to multiple organizations.</p>

      <div className="space-y-3">
        {organizations.map((org) => (
          <Card key={org.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-zinc-100">{org.name}</p>
              <p className="text-xs text-zinc-500">{org.slug}</p>
            </div>
            <Button
              variant="secondary"
              disabled={submitting !== null}
              onClick={() => void selectOrganization(org.id)}
            >
              {submitting === org.id ? 'Selecting…' : 'Select'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
