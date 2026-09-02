const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixa paths de /public quando o site roda sob subpath (ex.: /dra-barbara-alencar). */
export function asset(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path}`;
}
