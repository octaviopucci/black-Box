import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import {
  createAccount,
  createPixKey,
  listAccounts,
  listPixKeys,
  publicAccount,
  publicPixKey,
} from '../services/accounts.js'

const createAccountSchema = z.object({
  name: z.string().min(1).max(120),
  provider: z.literal('asaas').default('asaas'),
  apiKey: z.string().min(10),
  apiUrl: z.string().url().optional(),
  webhookToken: z.string().min(8).optional(),
  defaultCustomerId: z.string().optional(),
})

const createKeySchema = z.object({
  label: z.string().min(1).max(120),
  keyType: z.enum(['cpf', 'cnpj', 'email', 'phone', 'evp']),
  keyValue: z.string().min(3).max(100),
})

export const accountsRoutes: FastifyPluginAsync = async (app) => {
  app.post('/v1/accounts', async (request, reply) => {
    const body = createAccountSchema.parse(request.body)
    const account = createAccount(app.db, {
      name: body.name,
      provider: body.provider,
      apiKey: body.apiKey,
      apiUrl: body.apiUrl,
      webhookToken: body.webhookToken,
      defaultCustomerId: body.defaultCustomerId,
    })

    return reply.code(201).send({
      account: publicAccount(account),
      webhookUrl: `${app.config.PUBLIC_BASE_URL}/v1/webhooks/asaas/${account.id}`,
      hint: 'No painel Asaas, cadastre esta webhookUrl e use o mesmo webhookToken (se definiu). Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED.',
    })
  })

  app.get('/v1/accounts', async () => {
    return { accounts: listAccounts(app.db).map(publicAccount) }
  })

  app.post('/v1/accounts/:accountId/keys', async (request, reply) => {
    const params = z.object({ accountId: z.string() }).parse(request.params)
    const body = createKeySchema.parse(request.body)
    try {
      const key = createPixKey(app.db, {
        accountId: params.accountId,
        label: body.label,
        keyType: body.keyType,
        keyValue: body.keyValue,
      })
      return reply.code(201).send({ key: publicPixKey(key) })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar chave'
      return reply.code(400).send({ error: message })
    }
  })

  app.get('/v1/accounts/:accountId/keys', async (request, reply) => {
    const params = z.object({ accountId: z.string() }).parse(request.params)
    return reply.send({ keys: listPixKeys(app.db, params.accountId).map(publicPixKey) })
  })

  app.get('/v1/keys', async () => {
    return { keys: listPixKeys(app.db).map(publicPixKey) }
  })
}
