import { randomBytes } from 'node:crypto'

export function slugToOrgId(slug) {
  return `org_${slug.replace(/-/g, '_')}`
}

export function slugToEnvPrefix(slug) {
  return slug.replace(/-/g, '_').toUpperCase()
}

export function slugToApiFolder(slug) {
  return `api/_${slug}`
}

export function validateSlug(slug) {
  if (!slug || !/^[a-z][a-z0-9-]*[a-z0-9]$/.test(slug)) {
    throw new Error('Slug inválido. Use kebab-case (ex.: moda-bella).')
  }
  if (slug === 'iphone-imports') {
    throw new Error('iphone-imports é a loja raiz — use outro slug para loja irmã.')
  }
}

export function generateAdminPassword() {
  return `admin${randomBytes(4).toString('hex')}`
}

export const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.json',
  '.md',
  '.css',
  '.html',
  '.svg',
  '.yml',
  '.yaml',
])

export function shouldProcessFile(filePath) {
  const lower = filePath.toLowerCase()
  if (lower.includes('node_modules') || lower.includes('/out/') || lower.includes('/.next/')) {
    return false
  }
  const dot = lower.lastIndexOf('.')
  if (dot === -1) return false
  return TEXT_EXTENSIONS.has(lower.slice(dot))
}

export function applyReplacements(content, pairs) {
  let result = content
  for (const [from, to] of pairs) {
    result = result.split(from).join(to)
  }
  return result
}
