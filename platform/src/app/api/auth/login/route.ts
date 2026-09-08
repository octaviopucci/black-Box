import { NextResponse } from 'next/server'
import { loginUser, loginSchema } from '@/modules/auth/application/login-service'
import { handleRouteError, getRequestId, parseJsonBody } from '@/lib/http/response'
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants'
import { getEnv } from '@/config/env'

function getClientKey(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    const body = await parseJsonBody(request, loginSchema)
    const result = await loginUser(body, getClientKey(request))
    const env = getEnv()

    const response = NextResponse.json({
      ok: true,
      requiresOrganizationSelection: result.requiresOrganizationSelection,
    })

    response.cookies.set(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: result.expiresAt,
    })

    return response
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
