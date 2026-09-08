export function normalizeCustomerName(value: string): string {
  return value.trim()
}

export function normalizeOptionalText(value: string | undefined | null): string | undefined {
  if (value === undefined || value === null) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function normalizeEmail(value: string | undefined | null): string | undefined {
  const trimmed = normalizeOptionalText(value)
  return trimmed ? trimmed.toLowerCase() : undefined
}

export function normalizeDocument(value: string | undefined | null): string | undefined {
  const trimmed = normalizeOptionalText(value)
  if (!trimmed) return undefined
  return trimmed.replace(/\s+/g, '')
}

export function normalizePhone(value: string | undefined | null): string | undefined {
  const trimmed = normalizeOptionalText(value)
  if (!trimmed) return undefined
  return trimmed.replace(/\s+/g, '')
}
