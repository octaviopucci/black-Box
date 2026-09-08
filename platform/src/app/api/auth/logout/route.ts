import { NextResponse } from 'next/server'
import { logoutUser } from '@/modules/auth/application/login-service'
import { getSessionTokenFromRequest } from '@/lib/auth/cookies'
import { handleRouteError, getRequestId } from '@/lib/http/response'
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants'

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    const token = getSessionTokenFromRequest(request)
    await logoutUser(token)

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
