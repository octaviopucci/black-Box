import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import path from 'node:path'

const platformRoot = path.resolve(__dirname, '../..')

describe('migration flow', () => {
  it('applies migrations on a fresh database schema', () => {
    const databaseUrl =
      process.env.DATABASE_URL ??
      'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public'

    execSync('npx prisma migrate deploy', {
      cwd: platformRoot,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
    })

    const status = execSync('npx prisma migrate status', {
      cwd: platformRoot,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
    }).toString()

    expect(status).toMatch(/Database schema is up to date|Following migration/)
  })
})
