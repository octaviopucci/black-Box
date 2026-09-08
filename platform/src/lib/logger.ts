import { getEnv } from '@/config/env'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function shouldLog(level: LogLevel): boolean {
  try {
    const configured = getEnv().LOG_LEVEL
    return LEVEL_ORDER[level] >= LEVEL_ORDER[configured]
  } catch {
    return level !== 'debug'
  }
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  })
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta))
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('info')) console.info(formatMessage('info', message, meta))
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta))
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('error')) console.error(formatMessage('error', message, meta))
  },
}
