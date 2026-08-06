import type { FastifyReply, FastifyRequest } from 'fastify'
import type { AppConfig } from './config.js'

declare module 'fastify' {
  interface FastifyRequest {
    gatewayAuth?: 'api_key'
  }
}

export async function requireApiKey(
  request: FastifyRequest,
  reply: FastifyReply,
  config: AppConfig,
): Promise<void> {
  const header = request.headers['x-api-key']
  const auth = request.headers.authorization
  const bearer = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : undefined
  const key = (typeof header === 'string' ? header : undefined) ?? bearer

  if (!key || key !== config.PIX_GATEWAY_API_KEY) {
    await reply.code(401).send({ error: 'Unauthorized', message: 'API key inválida ou ausente' })
    return
  }

  request.gatewayAuth = 'api_key'
}
