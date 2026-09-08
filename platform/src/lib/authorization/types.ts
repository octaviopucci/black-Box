import type { Organization, OrganizationMembership, Role, User } from '@prisma/client'
import type { SessionWithRelations } from '@/modules/auth/infrastructure/session-repository'

export type AuthorizationContext = {
  user: User
  organization: Organization
  membership: OrganizationMembership
  session: SessionWithRelations
  roles: Role[]
  permissions: Set<string>
}

export type AuthorizationContextInput = {
  request?: Request
}
