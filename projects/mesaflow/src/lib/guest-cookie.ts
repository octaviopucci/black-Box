import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  buildClientCookie,
  clearClientCookieValue,
  CLIENT_COOKIE,
  parseClientCookieHeader,
} from "./guest-cookie-web";

export { CLIENT_COOKIE };

export function parseClientCookie(req: VercelRequest): string | undefined {
  return parseClientCookieHeader(req.headers.cookie);
}

export function setClientCookie(res: VercelResponse, token: string) {
  res.setHeader("Set-Cookie", buildClientCookie(token));
}

export function clearClientCookie(res: VercelResponse) {
  res.setHeader("Set-Cookie", clearClientCookieValue());
}
