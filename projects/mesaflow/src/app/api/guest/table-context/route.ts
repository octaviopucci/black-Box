import {
  findEstablishmentBySlug,
  findTableByQr,
  getActiveCommand,
} from "@/lib/store";
import {
  guestTableSummary,
  otpRequiredForEstablishment,
  validateClientSession,
} from "@/lib/guest";
import { publicOtpBypassHint } from "@/lib/otp-bypass";
import { readClientToken } from "../_shared";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") || "";
  const tableToken = url.searchParams.get("tableToken") || "";
  const est = findEstablishmentBySlug(slug);
  if (!est) return Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
  const tbl = findTableByQr(est.id, tableToken);
  if (!tbl) return Response.json({ error: "Mesa inválida ou QR expirado." }, { status: 404 });
  const command = getActiveCommand(tbl);
  const summary = guestTableSummary(est.id, command?.id);
  const guestAuth = validateClientSession(readClientToken(req));
  return Response.json({
    establishment: {
      id: est.id,
      slug: est.slug,
      name: est.name,
      open: est.open,
      rodizioEnabled: est.rodizioEnabled,
    },
    table: { id: tbl.id, number: tbl.number, name: tbl.name, status: tbl.status },
    command,
    otpRequired: otpRequiredForEstablishment(est),
    otpBypass: publicOtpBypassHint(),
    hasSession: Boolean(guestAuth),
    ...summary,
  });
}
