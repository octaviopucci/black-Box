import {
  buildClientCookie,
  clearClientCookieValue,
  parseClientCookieHeader,
} from "./guest-cookie-web";

export function readClientToken(req: Request): string | undefined {
  return parseClientCookieHeader(req.headers.get("cookie"));
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
