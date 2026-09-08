import { redirect } from 'next/navigation'
import {
  getAuthContext,
  toSafeOrganization,
  toSafeUser,
} from '@/lib/auth/context'
import { getCurrentOrganizationForUser } from '@/modules/organization/application/organization-service'
import { AuthenticatedShell } from '@/components/shell/authenticated-shell'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  if (ctx.user.status !== 'ACTIVE') redirect('/login')

  const organization = await getCurrentOrganizationForUser(ctx.user, ctx.session)

  return (
    <AuthenticatedShell
      user={toSafeUser(ctx.user)}
      organization={organization ? toSafeOrganization(organization) : null}
    >
      {children}
    </AuthenticatedShell>
  )
}
