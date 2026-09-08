type AttemptRecord = {
  count: number
  resetAt: number
}

const attempts = new Map<string, AttemptRecord>()

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now()
  const record = attempts.get(key)

  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxAttempts) {
    return false
  }

  record.count += 1
  return true
}

export function resetRateLimit(key: string): void {
  attempts.delete(key)
}

export function clearRateLimitsForTests(): void {
  attempts.clear()
}
