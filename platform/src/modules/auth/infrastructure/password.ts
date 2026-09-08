import argon2 from 'argon2'
import { PASSWORD_MIN_LENGTH } from '@/lib/auth/constants'
import { validationError } from '@/lib/errors'

export function validatePasswordPolicy(password: string): void {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    throw validationError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  }
}

export async function hashPassword(password: string): Promise<string> {
  validatePasswordPolicy(password)
  return argon2.hash(password, { type: argon2.argon2id })
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await argon2.verify(passwordHash, password)
  } catch {
    return false
  }
}
