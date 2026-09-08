export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'

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

export function notFoundError(message = 'Resource not found') {
  return new AppError({ code: 'NOT_FOUND', message, status: 404 })
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
