/**
 * Normalizes email for storage and lookup (case-insensitive uniqueness).
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Validates email format after normalization.
 */
export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
}
