import { findEstablishmentBySlug, findTableByQr } from "@/lib/store";
import { requestOtpChallenge } from "@/lib/guest";
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
    slug?: string;
    tableToken?: string;
    phone?: string;
    privacyConsent?: unknown;
    turnstileToken?: string;
  };

  const rl = applyRateLimit(
    "otpRequest",
    rateLimitClientId(req, String(body.phone || "").replace(/\D/g, "").slice(-8)),
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

  const est = findEstablishmentBySlug(String(body.slug || ""));
  if (!est) return withRateLimitHeaders(Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 }), rl);
  const tbl = findTableByQr(est.id, String(body.tableToken || ""));
  if (!tbl) return withRateLimitHeaders(Response.json({ error: "Mesa inválida." }, { status: 404 }), rl);

  const result = requestOtpChallenge({
    establishment: est,
    table: tbl,
    phoneRaw: String(body.phone || ""),
    purpose: "JOIN",
  });
  if ("error" in result) {
    return withRateLimitHeaders(Response.json({ error: result.error }, { status: 400 }), rl);
  }
  return withRateLimitHeaders(
    Response.json({
      challengeId: result.challengeId,
      mockCode: result.mockCode,
      message: "Código enviado.",
    }),
    rl,
  );
}
