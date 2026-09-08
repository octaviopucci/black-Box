import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import type { AuthorizationContext } from '@/lib/authorization/types'

export type PartnerDataScope =
  | { type: 'unrestricted' }
  | { type: 'partner'; partnerId: string }
  | { type: 'none' }

export async function resolvePartnerDataScope(
  ctx: AuthorizationContext,
): Promise<PartnerDataScope> {
  const activeSlugs = ctx.roles.filter((r) => r.status === 'ACTIVE').map((r) => r.slug)
  const hasInternalRole = activeSlugs.some(
    (slug) => slug === ROLE_SLUGS.ADMIN || slug === ROLE_SLUGS.GESTOR,
  )
  if (hasInternalRole) return { type: 'unrestricted' }

  const partner = await prisma.partner.findFirst({
    where: {
      organizationId: ctx.organization.id,
      userId: ctx.user.id,
      status: 'ACTIVE',
    },
    select: { id: true },
  })

  if (partner) return { type: 'partner', partnerId: partner.id }
  return { type: 'none' }
}

/** Tenant-safe filter for Opportunity queries based on partner data scope. */
export function buildOpportunityPartnerFilter(
  scope: PartnerDataScope,
): Prisma.OpportunityWhereInput | undefined {
  if (scope.type === 'unrestricted') return undefined
  if (scope.type === 'none') return { id: { in: [] } }
  return {
    OR: [
      { partnerId: scope.partnerId },
      { lead: { partnerId: scope.partnerId } },
    ],
  }
}

export function assertOpportunityInPartnerScope(
  scope: PartnerDataScope,
  opportunity: { partnerId: string | null; lead: { partnerId: string | null } },
): boolean {
  if (scope.type === 'unrestricted') return true
  if (scope.type === 'none') return false
  const pid = scope.partnerId
  return opportunity.partnerId === pid || opportunity.lead.partnerId === pid
}
