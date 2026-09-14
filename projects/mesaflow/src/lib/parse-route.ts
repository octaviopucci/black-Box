/** Extrai slug/mesa da URL — funciona com rewrite Vercel (path original preservado). */
export function parseMenuRoute(pathname: string, search = "") {
  const qs = new URLSearchParams(search);
  const fromQuery = { slug: qs.get("slug") || "", table: qs.get("table") || "" };
  if (fromQuery.slug && fromQuery.table) return fromQuery;

  const match = pathname.match(/\/m\/([^/]+)\/([^/]+)\/?$/);
  if (match && match[1] !== "live") {
    return { slug: decodeURIComponent(match[1]), table: decodeURIComponent(match[2]) };
  }
  return { slug: "", table: "" };
}

/** Extrai setor KDS da URL. */
export function parseKdsRoute(pathname: string, search = "") {
  const qs = new URLSearchParams(search);
  const fromQuery = qs.get("sector");
  if (fromQuery) return fromQuery;

  const match = pathname.match(/\/kds\/([^/]+)\/?$/);
  if (match && match[1] !== "live") return decodeURIComponent(match[1]);
  return "";
}
