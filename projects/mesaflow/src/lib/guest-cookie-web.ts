export const CLIENT_COOKIE = "mf_cs";

export function parseClientCookieHeader(cookieHeader: string | null | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${CLIENT_COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(CLIENT_COOKIE.length + 1));
    }
  }
  return undefined;
}

function clientCookiePath(): string {
  const prefix = process.env.MESAFLOW_API_PREFIX || process.env.NEXT_PUBLIC_API_PREFIX;
  if (prefix) return `/api/${prefix}`;
  if (process.env.VERCEL) return "/api/mesaflow";
  return "/api";
}

export function buildClientCookie(token: string): string {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${CLIENT_COOKIE}=${encodeURIComponent(token)}; Path=${clientCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`;
}

export function clearClientCookieValue(): string {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${CLIENT_COOKIE}=; Path=${clientCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
