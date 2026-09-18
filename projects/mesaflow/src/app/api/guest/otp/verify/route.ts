import { verifyOtpChallenge } from "@/lib/guest";
import { consentRequiredMessage, validatePrivacyConsent } from "@/lib/privacy-policy";
import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    challengeId?: string;
    code?: string;
    displayName?: string;
    slug?: string;
    tableToken?: string;
    phone?: string;
    comandaNumber?: string;
    privacyConsent?: unknown;
    turnstileToken?: string;
  };

  const rl = applyRateLimit(
    "otpVerify",
    rateLimitClientId(req, String(body.challengeId || "")),
  );
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const turnstile = await verifyTurnstileToken(body.turnstileToken, rateLimitClientId(req));
  if (!turnstile.ok) {
    return withRateLimitHeaders(Response.json({ error: turnstile.error }, { status: 400 }), rl);
  }

  const consent = validatePrivacyConsent(body.privacyConsent);
  if (!consent) {
    return withRateLimitHeaders(
      Response.json({ error: consentRequiredMessage() }, { status: 400 }),
      rl,
    );
  }

  const result = verifyOtpChallenge({
    challengeId: String(body.challengeId || ""),
    code: String(body.code || ""),
    displayName: body.displayName,
    slug: body.slug,
    tableToken: body.tableToken,
    phoneRaw: body.phone,
    comandaNumber: body.comandaNumber,
    privacyConsent: consent,
  });
  if ("error" in result) {
    return withRateLimitHeaders(Response.json({ error: result.error }, { status: 400 }), rl);
  }
  return withRateLimitHeaders(Response.json(result), rl);
}
