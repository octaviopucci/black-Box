const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${base}${path}`;
}
