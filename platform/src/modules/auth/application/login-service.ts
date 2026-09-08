import { z } from 'zod'
import { normalizeEmail, isValidEmail } from '@/modules/auth/domain/email'
import { verifyPassword } from '@/modules/auth/infrastructure/password'
import {
  checkRateLimit,
  resetRateLimit,
} from '@/modules/auth/infrastructure/rate-limit'
import {
  createSession,
  deleteSessionByToken,
  getActiveMemberships,
} from '@/modules/auth/infrastructure/session-repository'
import { LOGIN_RATE_LIMIT } from '@/lib/auth/constants'
import {
  inactiveUserError,
  invalidCredentialsError,
  tooManyRequestsError,
  validationError,
} from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import { PASSWORD_MIN_LENGTH } from '@/lib/auth/constants'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

function resolveInitialOrganizationId(
  memberships: Awaited<ReturnType<typeof getActiveMemberships>>,
): string | null {
  if (memberships.length === 1) {
    return memberships[0].organizationId
  }
  return null
}

export async function loginUser(
  input: LoginInput,
  clientKey: string,
): Promise<{ token: string; expiresAt: Date; requiresOrganizationSelection: boolean }> {
  const email = normalizeEmail(input.email)

  if (!isValidEmail(email)) {
    throw validationError('Invalid email format')
  }

  if (!input.password || input.password.length < PASSWORD_MIN_LENGTH) {
    throw validationError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  }

  const rateLimitKey = `login:${clientKey}:${email}`
  if (!checkRateLimit(rateLimitKey, LOGIN_RATE_LIMIT.maxAttempts, LOGIN_RATE_LIMIT.windowMs)) {
    logger.warn('Login rate limit exceeded', { email })
    throw tooManyRequestsError()
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    logger.warn('Login failed', { email })
    throw invalidCredentialsError()
  }

  if (user.status !== 'ACTIVE') {
    throw inactiveUserError()
  }

  resetRateLimit(rateLimitKey)

  const memberships = await getActiveMemberships(user.id)
  const activeOrganizationId = resolveInitialOrganizationId(memberships)

  const { token, expiresAt } = await createSession(user.id, activeOrganizationId)

  logger.info('Login success', { userId: user.id, email })

  return {
    token,
    expiresAt,
    requiresOrganizationSelection: memberships.length > 1 && !activeOrganizationId,
  }
}

export async function logoutUser(token: string | undefined): Promise<void> {
  if (!token) return
  await deleteSessionByToken(token)
  logger.info('Logout success')
}
