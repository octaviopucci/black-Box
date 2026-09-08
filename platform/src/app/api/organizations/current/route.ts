import { requireAuthenticatedUserFromRequest, toSafeOrganization } from '@/lib/auth/context'
import { getCurrentOrganizationForUser } from '@/modules/organization/application/organization-service'
import { getAuthContextFromRequest } from '@/lib/auth/context'
import { jsonOk, handleRouteError, getRequestId } from '@/lib/http/response'
import { organizationNotFoundError } from '@/lib/errors'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    const ctx = await getAuthContextFromRequest(request)
    if (!ctx) {
      throw organizationNotFoundError('No active organization in session')
    }

    await requireAuthenticatedUserFromRequest(request)
    const organization = await getCurrentOrganizationForUser(ctx.user, ctx.session)

    if (!organization) {
      throw organizationNotFoundError('No active organization in session')
    }

    return jsonOk({ organization: toSafeOrganization(organization) })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
