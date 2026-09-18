import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";
import { jsonWithAdminSession } from "@/lib/staff-auth-request";
import { loginUser, publicUser } from "@/lib/store";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  const rl = applyRateLimit("authLogin", rateLimitClientId(req));
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const body = await req.json();
  const turnstile = await verifyTurnstileToken(body.turnstileToken, rateLimitClientId(req));
  if (!turnstile.ok) {
    return withRateLimitHeaders(Response.json({ error: turnstile.error }, { status: 400 }), rl);
  }

  const { email, password } = body;
  const result = loginUser(String(email), String(password));
  if (result.error) {
    return withRateLimitHeaders(
      Response.json({ error: result.error }, { status: 401 }),
      rl,
    );
  }
  const payload = {
    user: publicUser(result.user!),
    establishment: result.establishment,
  };
  return withRateLimitHeaders(jsonWithAdminSession(payload, result.session!.token), rl);
}
