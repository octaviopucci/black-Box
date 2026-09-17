import {
  buildClientCookie,
  clearClientCookieValue,
  CLIENT_COOKIE,
  parseClientCookieHeader,
} from "./guest-cookie-web";

export { CLIENT_COOKIE };

type CookieRequest = { headers: { cookie?: string | string[] } };
type CookieResponse = { setHeader: (name: string, value: string) => void };

export function parseClientCookie(req: CookieRequest): string | undefined {
  const raw = req.headers.cookie;
  if (typeof raw === "string") return parseClientCookieHeader(raw);
  if (Array.isArray(raw)) return parseClientCookieHeader(raw.join("; "));
  return undefined;
}

export function setClientCookie(res: CookieResponse, token: string) {
  res.setHeader("Set-Cookie", buildClientCookie(token));
}

export function clearClientCookie(res: CookieResponse) {
  res.setHeader("Set-Cookie", clearClientCookieValue());
}
