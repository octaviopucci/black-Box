import { loginPlatformUser } from "@/lib/platform-store";
import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";
import { jsonWithPlatformSession } from "@/lib/staff-auth-request";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  const rl = applyRateLimit("authLogin", rateLimitClientId(req, "platform"));
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const body = (await req.json()) as { email?: string; password?: string; turnstileToken?: string };
  const turnstile = await verifyTurnstileToken(body.turnstileToken, rateLimitClientId(req, "platform"));
  if (!turnstile.ok) {
    return withRateLimitHeaders(Response.json({ error: turnstile.error }, { status: 400 }), rl);
  }

  const result = loginPlatformUser(String(body.email ?? ""), String(body.password ?? ""));
  if ("error" in result) {
    return withRateLimitHeaders(Response.json({ error: result.error }, { status: 401 }), rl);
  }
  const { token, user } = result;
  return withRateLimitHeaders(jsonWithPlatformSession({ user, token }, token), rl);
}
