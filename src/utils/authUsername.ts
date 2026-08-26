/** Normaliza login/cadastro: sem acento, minúsculas, espaços viram ponto. */
export function normalizeUsername(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 32)
}

export function isValidUsername(raw: string): boolean {
  return normalizeUsername(raw).length >= 3
}
