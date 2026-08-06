import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { processProviderWebhook } from '../services/webhooks.js'

function extractToken(request: {
  headers: Record<string, unknown>
  query: unknown
}): string | undefined {
  const query = request.query as Record<string, unknown>
  const q =
    typeof query.access_token === 'string'
      ? query.access_token
      : typeof query.token === 'string'
        ? query.token
        : undefined
  const header = request.headers['asaas-access-token']
  const h = typeof header === 'string' ? header : undefined
  const auth = request.headers.authorization
  const bearer = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : undefined
  return q ?? h ?? bearer
}

export const webhooksRoutes: FastifyPluginAsync = async (app) => {
  // Webhook por conta (recomendado com várias contas)
  app.post('/v1/webhooks/asaas/:accountId', async (request, reply) => {
    const params = z.object({ accountId: z.string() }).parse(request.params)
    try {
      const result = processProviderWebhook(app.db, {
        provider: 'asaas',
        payload: request.body,
        token: extractToken(request),
        accountId: params.accountId,
      })
      return reply.code(200).send(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook inválido'
      return reply.code(401).send({ error: message })
    }
  })

  // Webhook global (útil com 1 conta ou token único)
  app.post('/v1/webhooks/asaas', async (request, reply) => {
    try {
      const result = processProviderWebhook(app.db, {
        provider: 'asaas',
        payload: request.body,
        token: extractToken(request),
      })
      return reply.code(200).send(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook inválido'
      return reply.code(401).send({ error: message })
    }
  })
}
