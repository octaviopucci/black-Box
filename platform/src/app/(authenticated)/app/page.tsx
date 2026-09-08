import { Card } from '@/components/ui/primitives'
import { getAuthContext, toSafeUser } from '@/lib/auth/context'
import { getCurrentOrganizationForUser } from '@/modules/organization/application/organization-service'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AppHomePage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const organization = await getCurrentOrganizationForUser(ctx.user, ctx.session)
  const user = toSafeUser(ctx.user)

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Authenticated area</h1>
        <p className="text-sm text-zinc-400">
          Mission 02 — identity and tenant context are active. Business modules arrive in later missions.
        </p>
      </section>

      <Card>
        <h2 className="text-sm font-medium text-zinc-200">Current identity</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="User" value={user.name} />
          <Info label="Email" value={user.email} />
          <Info label="Organization" value={organization?.name ?? '—'} />
          <Info label="Org slug" value={organization?.slug ?? '—'} />
        </dl>
        {!organization ? (
          <p className="mt-4 text-sm text-amber-400">
            No active organization.{' '}
            <Link href="/app/select-organization" className="underline">
              Select organization
            </Link>
          </p>
        ) : null}
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-100">{value}</dd>
    </div>
  )
}
