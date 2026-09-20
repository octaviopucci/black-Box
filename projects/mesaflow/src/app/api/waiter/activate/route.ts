import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";
import { activateWaiterWithToken } from "@/lib/waiter-store";

export async function POST(req: Request) {
  const rl = applyRateLimit("authLogin", rateLimitClientId(req));
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const body = await req.json().catch(() => ({})) as {
    token?: string;
    password?: string;
    pin?: string;
  };
  const result = activateWaiterWithToken(
    String(body.token || ""),
    String(body.password || ""),
    body.pin,
  );
  if ("error" in result) {
    return withRateLimitHeaders(
      Response.json({ error: result.error }, { status: result.status }),
      rl,
    );
  }
  return withRateLimitHeaders(Response.json(result.value), rl);
}
