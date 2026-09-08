import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants'
import { getEnv } from '@/config/env'

export async function getSessionTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const env = getEnv()
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function getSessionTokenFromRequest(request: Request): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined

  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))

  if (!match) return undefined
  return decodeURIComponent(match.slice(SESSION_COOKIE_NAME.length + 1))
}

export function appendSessionCookie(
  response: Response,
  token: string,
  expiresAt: Date,
): Response {
  const env = getEnv()
  const secure = env.NODE_ENV === 'production' ? '; Secure' : ''
  const cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${secure}`

  const headers = new Headers(response.headers)
  headers.append('Set-Cookie', cookie)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export function clearSessionCookieOnResponse(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  )
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
