/** Prefixa caminhos de public/ com BASE_URL (ex.: /heitor-da-gelsa/). */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}
