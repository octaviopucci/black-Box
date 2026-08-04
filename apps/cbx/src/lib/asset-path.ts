/** Public asset path helper — respects Next.js basePath (/cbx in production). */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
