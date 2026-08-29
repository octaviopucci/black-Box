export const V2_BASE = '/v2'
/** Bump para forçar redeploy Vercel quando necessário */
export const V2_DEPLOY_VERSION = '2026-08-29-cursos'

export function v2Path(href: string) {
  if (href.startsWith('#')) return { pathname: V2_BASE, hash: href.slice(1) } as const
  if (href.startsWith('/servicos')) return `${V2_BASE}${href}`
  return href
}
