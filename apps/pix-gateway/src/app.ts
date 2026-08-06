import cors from '@fastify/cors'
import Fastify, { type FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { requireApiKey } from './auth.js'
import type { AppConfig } from './config.js'
import type { Db } from './db/index.js'
import { accountsRoutes } from './routes/accounts.js'
import { chargesRoutes } from './routes/charges.js'
import { webhooksRoutes } from './routes/webhooks.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: Db
    config: AppConfig
  }
}

export async function buildApp(config: AppConfig, db: Db): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.NODE_ENV !== 'test',
  })

  app.decorate('db', db)
  app.decorate('config', config)

  await app.register(cors, { origin: false })

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: 'ValidationError',
        details: error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      })
    }
    app.log.error(error)
    const message = error instanceof Error ? error.message : 'Erro interno'
    return reply.code(500).send({ error: message })
  })

  app.get('/health', async () => ({
    ok: true,
    service: 'pix-gateway',
    automaticConfirmation: true,
    defaultProvider: 'native',
    fee: 0,
    note: 'Modo native: Pix grátis na sua chave. Confirmação automática via webhook Bacen/Pix recebido.',
  }))

  // Webhooks públicos (auth própria via token Asaas)
  await app.register(webhooksRoutes)

  // API autenticada
  await app.register(async (scoped) => {
    scoped.addHook('preHandler', async (request, reply) => {
      await requireApiKey(request, reply, config)
    })
    await scoped.register(accountsRoutes)
    await scoped.register(chargesRoutes)
  })

  return app
}
