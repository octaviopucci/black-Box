import type { Organization, OrganizationMembership, Role, User } from '@prisma/client'
import type { SessionWithRelations } from '@/modules/auth/infrastructure/session-repository'
import type { PartnerDataScope } from '@/lib/authorization/partner-scope'

export type AuthorizationContext = {
  user: User
  organization: Organization
  membership: OrganizationMembership
  session: SessionWithRelations
  roles: Role[]
  permissions: Set<string>
  partnerScope: PartnerDataScope
}

export type AuthorizationContextInput = {
  request?: Request
}
