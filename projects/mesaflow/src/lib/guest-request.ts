import {
  buildClientCookie,
  clearClientCookieValue,
  parseClientCookieHeader,
} from "./guest-cookie-web";

export function readClientToken(req: Request): string | undefined {
  const authorization = req.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  return bearer || parseClientCookieHeader(req.headers.get("cookie"));
}

export function jsonWithClientCookie(body: unknown, token: string, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Set-Cookie": buildClientCookie(token) },
  });
}

export function jsonClearClientCookie(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Set-Cookie": clearClientCookieValue() },
  });
}
