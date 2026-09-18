import { loginUser, publicUser } from "@/lib/store";
import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";

export async function POST(req: Request) {
  const rl = applyRateLimit("authLogin", rateLimitClientId(req));
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const { email, password } = await req.json();
  const result = loginUser(String(email), String(password));
  if (result.error) {
    return withRateLimitHeaders(
      Response.json({ error: result.error }, { status: 401 }),
      rl,
    );
  }
  return withRateLimitHeaders(
    Response.json({
      token: result.session!.token,
      user: publicUser(result.user!),
      establishment: result.establishment,
    }),
    rl,
  );
}
