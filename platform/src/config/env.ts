import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  SESSION_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7),
  BOOTSTRAP_ORG_NAME: z.string().min(1).optional(),
  BOOTSTRAP_ORG_SLUG: z.string().min(1).optional(),
  BOOTSTRAP_USER_NAME: z.string().min(1).optional(),
  BOOTSTRAP_USER_EMAIL: z.string().email().optional(),
  BOOTSTRAP_USER_PASSWORD: z.string().min(8).optional(),
})

export type Env = z.infer<typeof envSchema>

let cached: Env | null = null

export function getEnv(): Env {
  if (cached) return cached

  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors
    throw new Error(`Invalid environment configuration: ${JSON.stringify(details)}`)
  }

  cached = parsed.data
  return cached
}

export function resetEnvCache(): void {
  cached = null
}

export function getBootstrapConfig() {
  const env = getEnv()
  if (
    !env.BOOTSTRAP_ORG_NAME ||
    !env.BOOTSTRAP_ORG_SLUG ||
    !env.BOOTSTRAP_USER_NAME ||
    !env.BOOTSTRAP_USER_EMAIL ||
    !env.BOOTSTRAP_USER_PASSWORD
  ) {
    return null
  }
  return {
    orgName: env.BOOTSTRAP_ORG_NAME,
    orgSlug: env.BOOTSTRAP_ORG_SLUG,
    userName: env.BOOTSTRAP_USER_NAME,
    userEmail: env.BOOTSTRAP_USER_EMAIL,
    userPassword: env.BOOTSTRAP_USER_PASSWORD,
  }
}
