import { isOperationMode } from "@/lib/operation-modes";
import {
  applyRateLimit,
  rateLimitClientId,
  rateLimitedJsonResponse,
  withRateLimitHeaders,
} from "@/lib/rate-limit-http";
import { jsonWithAdminSession } from "@/lib/staff-auth-request";
import { publicUser, registerEstablishment } from "@/lib/store";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { OperationMode } from "@/lib/types";

export async function POST(req: Request) {
  const rl = applyRateLimit("authRegister", rateLimitClientId(req));
  if (!rl.allowed) return rateLimitedJsonResponse(rl);

  const body = await req.json();
  const turnstile = await verifyTurnstileToken(body.turnstileToken, rateLimitClientId(req));
  if (!turnstile.ok) {
    return withRateLimitHeaders(Response.json({ error: turnstile.error }, { status: 400 }), rl);
  }

  const operationMode = isOperationMode(body.operationMode)
    ? (body.operationMode as OperationMode)
    : undefined;
  const result = registerEstablishment({
    businessName: String(body.businessName || ""),
    ownerName: String(body.ownerName || ""),
    email: String(body.email || ""),
    password: String(body.password || ""),
    businessType: body.businessType || "restaurante",
    operationMode,
    tableCount: Number(body.tableCount) || 5,
    privacyConsent: body.privacyConsent,
    inviteCode: body.inviteCode,
  });
  if (result.error) {
    return withRateLimitHeaders(Response.json({ error: result.error }, { status: 400 }), rl);
  }
  const payload = {
    user: publicUser(result.user!),
    establishment: result.establishment,
  };
  return withRateLimitHeaders(
    jsonWithAdminSession(payload, result.session!.token, 201),
    rl,
  );
}
