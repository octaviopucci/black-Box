import { loadConfig } from './config.js'
import { openDatabase } from './db/index.js'
import { buildApp } from './app.js'
import { startReconciler } from './reconciler.js'

async function main() {
  const config = loadConfig()
  const db = openDatabase(config.DATABASE_PATH)
  const app = await buildApp(config, db)

  const reconciler = startReconciler(db, {
    intervalMs: 30_000,
    log: (msg) => app.log.info(msg),
  })

  const shutdown = async () => {
    reconciler.stop()
    await app.close()
    process.exit(0)
  }
  process.on('SIGINT', () => void shutdown())
  process.on('SIGTERM', () => void shutdown())

  await app.listen({ port: config.PORT, host: '0.0.0.0' })
  app.log.info(`PIX Gateway em http://0.0.0.0:${config.PORT}`)
  app.log.info(`Confirmação automática: webhook Asaas + reconciliação a cada 30s`)
  app.log.info(`Webhook: ${config.PUBLIC_BASE_URL}/v1/webhooks/asaas/:accountId`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
