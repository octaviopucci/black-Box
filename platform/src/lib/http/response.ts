import { NextResponse } from 'next/server'
import type { ZodSchema } from 'zod'
import { AppError, mapUnknownError, sanitizeForClient, toPublicErrorBody } from '@/lib/errors'
import { logger } from '@/lib/logger'

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(sanitizeForClient(data) as T, { status: 200, ...init })
}

export function handleRouteError(error: unknown, requestId?: string) {
  const appError = mapUnknownError(error)

  logger.error(appError.message, {
    code: appError.code,
    status: appError.status,
    requestId,
    ...(appError.expose ? {} : { internal: true }),
  })

  const body = appError.expose
    ? toPublicErrorBody(appError)
    : toPublicErrorBody(
        new AppError({
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          status: 500,
          expose: false,
        }),
      )

  return NextResponse.json(body, { status: appError.status })
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Invalid JSON body',
      status: 400,
    })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request',
      status: 400,
      details: { issues: parsed.error.flatten() },
    })
  }

  return parsed.data
}

export function getRequestId(request: Request): string | undefined {
  return request.headers.get('x-request-id') ?? undefined
}
