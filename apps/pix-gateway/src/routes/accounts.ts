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
  provider: z.enum(['native', 'asaas']).default('native'),
  // native (grátis)
  merchantName: z.string().min(1).max(25).optional(),
  merchantCity: z.string().min(1).max(15).optional(),
  webhookToken: z.string().min(8).optional(),
  // asaas (pago — opcional)
  apiKey: z.string().min(10).optional(),
  apiUrl: z.string().url().optional(),
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

    if (body.provider === 'asaas' && !body.apiKey) {
      return reply.code(400).send({ error: 'apiKey é obrigatório para provider asaas' })
    }

    try {
      const account = createAccount(app.db, {
        name: body.name,
        provider: body.provider,
        merchantName: body.merchantName,
        merchantCity: body.merchantCity,
        webhookToken: body.webhookToken,
        apiKey: body.apiKey,
        apiUrl: body.apiUrl,
        defaultCustomerId: body.defaultCustomerId,
      })

      const webhookPath =
        account.provider === 'native'
          ? `${app.config.API_PREFIX}/v1/webhooks/native/${account.id}`
          : `${app.config.API_PREFIX}/v1/webhooks/asaas/${account.id}`

      return reply.code(201).send({
        account: publicAccount(account),
        webhookUrl: `${app.config.PUBLIC_BASE_URL}${webhookPath}`,
        apiBase: `${app.config.PUBLIC_BASE_URL}${app.config.API_PREFIX || ''}`,
        hint:
          account.provider === 'native'
            ? 'Modo grátis: cadastre suas chaves Pix e aponte o webhook de Pix recebido do seu banco (formato Bacen) para webhookUrl. Taxa: R$ 0.'
            : 'Modo Asaas (pago ~R$1,99/Pix). Cadastre webhookUrl no painel Asaas.',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta'
      return reply.code(400).send({ error: message })
    }
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
