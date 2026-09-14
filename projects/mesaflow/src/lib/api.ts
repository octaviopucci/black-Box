/** API base: `/api` em dev standalone, `/api/mesaflow` no deploy unificado. */
export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX;
  const base = prefix ? `/api/${prefix}` : "/api";
  return `${base}${normalized}`;
}
