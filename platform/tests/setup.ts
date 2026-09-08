import { setTestEnv } from './helpers/env'

setTestEnv({
  NODE_ENV: 'test',
  LOG_LEVEL: 'error',
  AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public',
  SESSION_MAX_AGE_SECONDS: '3600',
})
