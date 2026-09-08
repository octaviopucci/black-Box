import { z } from 'zod'
import {
  parseJsonBody,
  jsonOk,
  handleRouteError,
  getRequestId,
} from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import { createRole, listRoles } from '@/modules/authorization/application/role-service'

const createRoleSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(64).optional(),
  description: z.string().max(500).optional(),
})

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const roles = await listRoles(ctx)
    return jsonOk({ roles })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createRoleSchema)
    const role = await createRole(ctx, body)
    return jsonOk({ role }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
