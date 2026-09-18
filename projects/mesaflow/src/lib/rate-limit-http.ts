import {
  clientIpFromHeaders,
  enforceRateLimit,
  rateLimitHeaders,
  type RateLimitResult,
  RATE_LIMIT_POLICIES,
} from "./rate-limit";

export function rateLimitClientId(req: Request, suffix = ""): string {
  const ip = clientIpFromHeaders(req.headers);
  return suffix ? `${ip}:${suffix}` : ip;
}

export function applyRateLimit(
  namespace: keyof typeof RATE_LIMIT_POLICIES,
  clientId: string,
): RateLimitResult {
  return enforceRateLimit(namespace, clientId);
}

export function rateLimitedJsonResponse(
  result: Extract<RateLimitResult, { allowed: false }>,
  message = "Muitas tentativas. Aguarde e tente novamente.",
): Response {
  return Response.json({ error: message }, { status: 429, headers: rateLimitHeaders(result) });
}

export function withRateLimitHeaders(response: Response, result: RateLimitResult): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(rateLimitHeaders(result))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
