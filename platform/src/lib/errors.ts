export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'UNAUTHENTICATED'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'INACTIVE_USER'
  | 'INACTIVE_MEMBERSHIP'
  | 'NOT_FOUND'
  | 'ORGANIZATION_NOT_FOUND'
  | 'CONFLICT'
  | 'EMAIL_ALREADY_EXISTS'
  | 'SLUG_ALREADY_EXISTS'
  | 'MEMBERSHIP_ALREADY_EXISTS'
  | 'UNPROCESSABLE_ENTITY'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'TOO_MANY_REQUESTS'

export class AppError extends Error {
  readonly code: ErrorCode
  readonly status: number
  readonly details?: Record<string, unknown>
  readonly expose: boolean

  constructor(options: {
    code: ErrorCode
    message: string
    status: number
    details?: Record<string, unknown>
    expose?: boolean
    cause?: unknown
  }) {
    super(options.message, { cause: options.cause })
    this.name = 'AppError'
    this.code = options.code
    this.status = options.status
    this.details = options.details
    this.expose = options.expose ?? true
  }
}

export function validationError(message: string, details?: Record<string, unknown>) {
  return new AppError({
    code: 'VALIDATION_ERROR',
    message,
    status: 400,
    details,
  })
}

export function invalidCredentialsError(message = 'Invalid credentials') {
  return new AppError({
    code: 'INVALID_CREDENTIALS',
    message,
    status: 401,
  })
}

export function unauthenticatedError(message = 'Authentication required') {
  return new AppError({
    code: 'UNAUTHENTICATED',
    message,
    status: 401,
  })
}

export function inactiveUserError(message = 'User account is inactive') {
  return new AppError({
    code: 'INACTIVE_USER',
    message,
    status: 403,
  })
}

export function inactiveMembershipError(message = 'Organization membership is inactive') {
  return new AppError({
    code: 'INACTIVE_MEMBERSHIP',
    message,
    status: 403,
  })
}

export function notFoundError(message = 'Resource not found') {
  return new AppError({ code: 'NOT_FOUND', message, status: 404 })
}

export function organizationNotFoundError(message = 'Organization not found') {
  return new AppError({ code: 'ORGANIZATION_NOT_FOUND', message, status: 404 })
}

export function forbiddenError(message = 'Forbidden') {
  return new AppError({ code: 'FORBIDDEN', message, status: 403 })
}

export function conflictError(code: Extract<ErrorCode, 'EMAIL_ALREADY_EXISTS' | 'SLUG_ALREADY_EXISTS' | 'MEMBERSHIP_ALREADY_EXISTS'>, message: string) {
  return new AppError({ code, message, status: 409 })
}

export function tooManyRequestsError(message = 'Too many attempts. Try again later.') {
  return new AppError({ code: 'TOO_MANY_REQUESTS', message, status: 429 })
}

export function internalError(message = 'Internal server error', cause?: unknown) {
  return new AppError({
    code: 'INTERNAL_ERROR',
    message,
    status: 500,
    expose: false,
    cause,
  })
}

export function serviceUnavailableError(message = 'Service unavailable') {
  return new AppError({
    code: 'SERVICE_UNAVAILABLE',
    message,
    status: 503,
  })
}

export type PublicErrorBody = {
  error: {
    code: ErrorCode
    message: string
    details?: Record<string, unknown>
  }
}

export function toPublicErrorBody(error: AppError): PublicErrorBody {
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    },
  }
}

export function mapUnknownError(error: unknown): AppError {
  if (error instanceof AppError) return error
  return internalError(undefined, error)
}

const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /DATABASE_URL/i,
  /api[_-]?key/i,
  /passwordHash/i,
  /password_hash/i,
]

export function sanitizeForClient(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (typeof value === 'string') {
    if (value.includes('postgresql://')) return '[redacted]'
    return value
  }
  if (Array.isArray(value)) return value.map(sanitizeForClient)
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_PATTERNS.some((p) => p.test(key))) {
        result[key] = '[redacted]'
      } else {
        result[key] = sanitizeForClient(val)
      }
    }
    return result
  }
  return value
}
