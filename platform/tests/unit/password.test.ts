import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '@/modules/auth/infrastructure/password'

describe('password hashing', () => {
  it('hashes and verifies password with argon2id', async () => {
    const hash = await hashPassword('SecurePass123!')
    expect(hash).not.toContain('SecurePass123!')
    expect(await verifyPassword('SecurePass123!', hash)).toBe(true)
    expect(await verifyPassword('wrong-password', hash)).toBe(false)
  })

  it('rejects short passwords', async () => {
    await expect(hashPassword('short')).rejects.toThrow(/at least/)
  })
})
