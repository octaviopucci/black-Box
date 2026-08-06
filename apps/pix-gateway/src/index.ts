import { loadConfig } from './config.js'
import { JsonDatabase, resolveDatabasePath } from './db/json-store.js'
import { buildApp } from './app.js'
import { startReconciler } from './reconciler.js'

async function main() {
  const config = loadConfig()
  const dbPath = resolveDatabasePath(config.DATABASE_PATH)
  const db = await JsonDatabase.open(dbPath)
  const app = await buildApp(config, db)

  app.addHook('onResponse', async (request) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      await db.persist()
    }
  })

  const reconciler = startReconciler(db, {
    intervalMs: 30_000,
    log: (msg) => app.log.info(msg),
  })

  const shutdown = async () => {
    reconciler.stop()
    await db.persist()
    await app.close()
    process.exit(0)
  }
  process.on('SIGINT', () => void shutdown())
  process.on('SIGTERM', () => void shutdown())

  await app.listen({ port: config.PORT, host: '0.0.0.0' })
  app.log.info(`PIX Gateway em http://0.0.0.0:${config.PORT}`)
  app.log.info(`Confirmação automática: webhook native (Bacen) / Asaas + expiração pending`)
  app.log.info(`Webhook grátis: ${config.PUBLIC_BASE_URL}/v1/webhooks/native/:accountId`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
