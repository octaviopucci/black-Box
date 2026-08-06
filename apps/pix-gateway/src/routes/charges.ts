import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import {
  createCharge,
  getCharge,
  listCharges,
  publicCharge,
  syncChargeFromProvider,
} from '../services/charges.js'

const createChargeSchema = z.object({
  amountCents: z.number().int().positive(),
  description: z.string().max(200).optional(),
  expiresInSeconds: z.number().int().positive().max(60 * 60 * 24 * 7).optional(),
  accountId: z.string().optional(),
  pixKeyId: z.string().optional(),
  routing: z.enum(['explicit', 'round_robin', 'least_used_today']).optional(),
  externalRef: z.string().max(120).optional(),
  customerName: z.string().max(120).optional(),
  customerCpfCnpj: z.string().min(11).max(18).optional(),
  customerEmail: z.string().email().optional(),
})

export const chargesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/v1/charges', async (request, reply) => {
    const body = createChargeSchema.parse(request.body)
    const idempotencyKey =
      typeof request.headers['idempotency-key'] === 'string'
        ? request.headers['idempotency-key']
        : undefined

    try {
      const charge = await createCharge(app.db, body, idempotencyKey)
      return reply.code(201).send({ charge: publicCharge(charge) })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar cobrança'
      const status = message.includes('Nenhuma conta') ? 400 : 502
      return reply.code(status).send({ error: message })
    }
  })

  app.get('/v1/charges', async (request) => {
    const query = z
      .object({ limit: z.coerce.number().int().positive().max(200).optional() })
      .parse(request.query)
    return { charges: listCharges(app.db, query.limit ?? 50).map(publicCharge) }
  })

  app.get('/v1/charges/:id', async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params)
    const charge = getCharge(app.db, params.id)
    if (!charge) return reply.code(404).send({ error: 'Cobrança não encontrada' })
    return { charge: publicCharge(charge) }
  })

  /** Reconsulta o PSP e atualiza status (fallback automático se webhook atrasar). */
  app.post('/v1/charges/:id/sync', async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params)
    try {
      const charge = await syncChargeFromProvider(app.db, params.id)
      return { charge: publicCharge(charge) }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sincronizar'
      const code = message.includes('não encontrada') ? 404 : 502
      return reply.code(code).send({ error: message })
    }
  })
}
