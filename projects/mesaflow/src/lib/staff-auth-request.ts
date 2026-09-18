import {
  ADMIN_SESSION_COOKIE,
  PLATFORM_SESSION_COOKIE,
  buildAdminSessionCookie,
  buildPlatformSessionCookie,
  clearAdminSessionCookieValue,
  clearPlatformSessionCookieValue,
  parseStaffCookieHeader,
} from "./staff-session-cookie-web";

export function readAdminSessionToken(req: Request): string | undefined {
  const authorization = req.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  return bearer || parseStaffCookieHeader(req.headers.get("cookie"), ADMIN_SESSION_COOKIE);
}

export function readPlatformSessionToken(req: Request): string | undefined {
  const authorization = req.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  return bearer || parseStaffCookieHeader(req.headers.get("cookie"), PLATFORM_SESSION_COOKIE);
}

export function jsonWithAdminSession(body: unknown, token: string, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Set-Cookie": buildAdminSessionCookie(token) },
  });
}

export function jsonWithPlatformSession(body: unknown, token: string, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Set-Cookie": buildPlatformSessionCookie(token) },
  });
}

export function jsonClearAdminSession(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Set-Cookie": clearAdminSessionCookieValue() },
  });
}

export function jsonClearPlatformSession(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Set-Cookie": clearPlatformSessionCookieValue() },
  });
}
