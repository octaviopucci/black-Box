const base = import.meta.env.BASE_URL

export function asset(path: string) {
  return `${base}${path.replace(/^\//, '')}`
}
