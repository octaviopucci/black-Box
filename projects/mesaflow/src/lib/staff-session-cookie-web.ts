export const ADMIN_SESSION_COOKIE = "mf_as";
export const PLATFORM_SESSION_COOKIE = "mf_ps";

const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;

export function staffCookiePath(): string {
  const prefix = process.env.MESAFLOW_API_PREFIX || process.env.NEXT_PUBLIC_API_PREFIX;
  if (prefix) return `/api/${prefix}`;
  if (process.env.VERCEL) return "/api/mesaflow";
  return "/api";
}

function cookieBase(name: string, token: string, maxAgeSec: number): string {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${name}=${encodeURIComponent(token)}; Path=${staffCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`;
}

export function buildAdminSessionCookie(token: string): string {
  return cookieBase(ADMIN_SESSION_COOKIE, token, SESSION_MAX_AGE_SEC);
}

export function buildPlatformSessionCookie(token: string): string {
  return cookieBase(PLATFORM_SESSION_COOKIE, token, SESSION_MAX_AGE_SEC);
}

export function clearAdminSessionCookieValue(): string {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=; Path=${staffCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function clearPlatformSessionCookieValue(): string {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${PLATFORM_SESSION_COOKIE}=; Path=${staffCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function parseStaffCookieHeader(
  cookieHeader: string | null | undefined,
  cookieName: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${cookieName}=`)) {
      return decodeURIComponent(trimmed.slice(cookieName.length + 1));
    }
  }
  return undefined;
}
