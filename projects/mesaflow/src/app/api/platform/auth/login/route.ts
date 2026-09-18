import { loginPlatformUser } from "@/lib/platform-store";
import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";

export async function POST(req: Request) {
  const rl = applyRateLimit("authLogin", rateLimitClientId(req, "platform"));
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const body = (await req.json()) as { email?: string; password?: string };
  const result = loginPlatformUser(String(body.email ?? ""), String(body.password ?? ""));
  if ("error" in result) {
    return withRateLimitHeaders(Response.json({ error: result.error }, { status: 401 }), rl);
  }
  return withRateLimitHeaders(Response.json(result), rl);
}
