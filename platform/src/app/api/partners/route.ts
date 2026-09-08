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
import {
  createPartner,
  listPartners,
  createPartnerSchema,
} from '@/modules/partners'
import type { PartnerStatus } from '@prisma/client'

const listQuerySchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE']).optional(),
})

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PARTNER_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const parsed = listQuerySchema.safeParse({
      status: url.searchParams.get('status') ?? undefined,
    })

    const filters = parsed.success && parsed.data.status
      ? { status: parsed.data.status as PartnerStatus }
      : undefined

    const partners = await listPartners(ctx, filters)
    return jsonOk({ partners })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PARTNER_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createPartnerSchema)
    const partner = await createPartner(ctx, body)
    return jsonOk({ partner }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
