import {
  getAuthContextFromRequest,
  toSafeOrganization,
  toSafeUser,
} from '@/lib/auth/context'
import { getActiveMemberships } from '@/modules/auth/infrastructure/session-repository'
import { getCurrentOrganizationForUser } from '@/modules/organization/application/organization-service'
import { jsonOk, handleRouteError, getRequestId } from '@/lib/http/response'
import { unauthenticatedError } from '@/lib/errors'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    const ctx = await getAuthContextFromRequest(request)
    if (!ctx) throw unauthenticatedError()

    const organization = await getCurrentOrganizationForUser(ctx.user, ctx.session)
    const memberships = await getActiveMemberships(ctx.user.id)

    return jsonOk({
      user: toSafeUser(ctx.user),
      organization: organization ? toSafeOrganization(organization) : null,
      requiresOrganizationSelection: !organization && memberships.length > 1,
      availableOrganizations:
        !organization && memberships.length > 1
          ? memberships.map((m) => toSafeOrganization(m.organization))
          : [],
    })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
