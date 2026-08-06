import { z } from 'zod'

const envSchema = z.object({
  PIX_GATEWAY_API_KEY: z.string().min(8).default('dev-local-api-key-change-me'),
  PORT: z.coerce.number().int().positive().default(8787),
  DATABASE_PATH: z.string().default('./data/pix-gateway.db'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PUBLIC_BASE_URL: z.string().url().default('http://localhost:8787'),
})

export type AppConfig = z.infer<typeof envSchema>

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(env)
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`Config inválida: ${details}`)
  }
  return parsed.data
}
