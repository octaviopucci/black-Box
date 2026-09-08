/**
 * URL-safe organization slug from display name.
 */
export function slugifyOrganizationName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

export function resolveUniqueSlug(baseSlug: string, existingSlugs: Set<string>): string {
  if (!existingSlugs.has(baseSlug)) return baseSlug

  let counter = 2
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1
  }
  return `${baseSlug}-${counter}`
}
