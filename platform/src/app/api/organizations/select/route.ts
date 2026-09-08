import { z } from 'zod'
import { getAuthContextFromRequest } from '@/lib/auth/context'
import { selectOrganizationForSession } from '@/modules/organization/application/organization-service'
import { toSafeOrganization } from '@/lib/auth/context'
import {
  parseJsonBody,
  jsonOk,
  handleRouteError,
  getRequestId,
} from '@/lib/http/response'
import { unauthenticatedError } from '@/lib/errors'

const selectOrganizationSchema = z.object({
  organizationId: z.string().uuid('Invalid organization id'),
})

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    const ctx = await getAuthContextFromRequest(request)
    if (!ctx) throw unauthenticatedError()

    const body = await parseJsonBody(request, selectOrganizationSchema)
    const organization = await selectOrganizationForSession(ctx.session, body.organizationId)

    return jsonOk({ organization: toSafeOrganization(organization) })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
