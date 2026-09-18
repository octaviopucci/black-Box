/** API base: `/api` em dev standalone, `/api/mesaflow` no deploy unificado. */
export function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX;
  const base = prefix ? `/api/${prefix}` : "/api";
  return `${base}${normalized}`;
}

/** Fetch autenticado staff (admin/platform): envia cookie HttpOnly + Bearer se houver. */
export function staffFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(apiUrl(path), { credentials: "include", ...init });
}
