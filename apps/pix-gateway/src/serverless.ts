import type { FastifyInstance } from 'fastify'
import { buildApp } from './app.js'
import { loadConfig, type AppConfig } from './config.js'
import { JsonDatabase, resolveDatabasePath, type Db } from './db/json-store.js'

type GatewayState = {
  app: FastifyInstance
  config: AppConfig
  db: Db
}

declare global {
  // eslint-disable-next-line no-var
  var __pixGatewayState: GatewayState | undefined
  // eslint-disable-next-line no-var
  var __pixGatewayBoot: Promise<GatewayState> | undefined
}

export async function getGateway(): Promise<GatewayState> {
  if (globalThis.__pixGatewayState) return globalThis.__pixGatewayState
  if (globalThis.__pixGatewayBoot) return globalThis.__pixGatewayBoot

  globalThis.__pixGatewayBoot = (async () => {
    const env = { ...process.env }
    if (!env.PUBLIC_BASE_URL) {
      if (env.VERCEL_ENV === 'production') {
        env.PUBLIC_BASE_URL = 'https://blckbox.vercel.app'
      } else if (env.VERCEL_PROJECT_PRODUCTION_URL) {
        env.PUBLIC_BASE_URL = `https://${env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, '')}`
      } else if (env.VERCEL_URL) {
        env.PUBLIC_BASE_URL = `https://${env.VERCEL_URL.replace(/^https?:\/\//, '')}`
      }
    } else if (env.VERCEL_ENV === 'production' && !env.PUBLIC_BASE_URL_OVERRIDE) {
      // Garante domínio canônico em produção
      env.PUBLIC_BASE_URL = 'https://blckbox.vercel.app'
    }

    if (env.VERCEL && !env.NODE_ENV) env.NODE_ENV = 'production'
    if (env.VERCEL && !env.API_PREFIX) env.API_PREFIX = '/api/pix'

    const config = loadConfig(env)
    const dbPath = resolveDatabasePath(config.DATABASE_PATH)
    const db = await JsonDatabase.open(dbPath)
    const app = await buildApp(config, db)

    app.addHook('onResponse', async (request) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        await db.persist()
      }
    })

    await app.ready()
    const state = { app, config, db }
    globalThis.__pixGatewayState = state
    return state
  })()

  return globalThis.__pixGatewayBoot
}

export async function flushPersist(): Promise<void> {
  const state = globalThis.__pixGatewayState
  if (state) await state.db.persist()
}

export type { AppConfig, Db }
