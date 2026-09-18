import { ensureProductionSeed } from "@/lib/production-seed";
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

  ensureProductionSeed();
  let result: ReturnType<typeof loginPlatformUser>;
  try {
    result = loginPlatformUser(String(body.email ?? ""), String(body.password ?? ""));
  } catch {
    ensureProductionSeed();
    result = loginPlatformUser(String(body.email ?? ""), String(body.password ?? ""));
  }
  if ("error" in result) {
    const status = result.status && result.status !== 401 ? result.status : 401;
    return withRateLimitHeaders(Response.json({ error: result.error }, { status }), rl);
  }
  const { token, user } = result;
  return withRateLimitHeaders(jsonWithPlatformSession({ user, token }, token), rl);
}
