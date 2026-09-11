import { createHmac, timingSafeEqual } from 'node:crypto'
import type { CloudSession } from './store'

const SECRET =
  process.env.W_TUBE_JWT_SECRET ||
  process.env.JWT_SECRET ||
  'w-tube-loja-iphoneimports-session-v1'

const TTL_MS = 30 * 24 * 60 * 60 * 1000

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url')
}

/** Token assinado — não depende do mapa `tokens` no JSON (sobrevive a re-seed). */
export function issueSessionToken(session: CloudSession): string {
  const payload = Buffer.from(
    JSON.stringify({ ...session, exp: Date.now() + TTL_MS }),
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string): CloudSession | null {
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as CloudSession & {
      exp?: number
    }
    if (!data.exp || data.exp < Date.now()) return null
    return {
      userId: data.userId,
      username: data.username,
      nome: data.nome,
      role: data.role,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      organizationSlug: data.organizationSlug,
    }
  } catch {
    return null
  }
}
