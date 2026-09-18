import { findEstablishmentBySlug, findTableByQr } from "@/lib/store";
import { joinGuestAtTable, otpRequiredForEstablishment, publicParticipation } from "@/lib/guest";
import { normalizePhoneE164 } from "@/lib/identity-crypto";
import { consentRequiredMessage, validatePrivacyConsent } from "@/lib/privacy-policy";
import { jsonWithClientCookie } from "../../_shared";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as {
    slug?: string;
    tableToken?: string;
    phone?: string;
    displayName?: string;
    comandaNumber?: string;
    privacyConsent?: unknown;
  };
  const consent = validatePrivacyConsent(body.privacyConsent);
  if (!consent) {
    return Response.json({ error: consentRequiredMessage() }, { status: 400 });
  }
  const est = findEstablishmentBySlug(String(body.slug || ""));
  if (!est) return Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
  if (otpRequiredForEstablishment(est)) {
    return Response.json({ error: "OTP obrigatório para este estabelecimento." }, { status: 403 });
  }
  const tbl = findTableByQr(est.id, String(body.tableToken || ""));
  if (!tbl) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  const phoneE164 = normalizePhoneE164(body.phone || "+5511999999999");
  if (!phoneE164) return Response.json({ error: "Telefone inválido." }, { status: 400 });
  const result = joinGuestAtTable({
    establishment: est,
    table: tbl,
    phoneE164,
    displayName: body.displayName,
    comandaNumber: body.comandaNumber,
    privacyConsent: consent,
  });
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return jsonWithClientCookie(
    {
      token: result.token,
      participation: publicParticipation(result.participation),
      message: result.message,
    },
    result.token,
  );
}
