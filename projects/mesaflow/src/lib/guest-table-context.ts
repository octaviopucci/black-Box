import { findEstablishmentBySlug, findTableByQr, getActiveCommand } from "./store";
import { guestTableSummary, otpRequiredForEstablishment, validateClientSession } from "./guest";
import { publicOtpBypassHint } from "./otp-bypass";

export type GuestTableContextResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; error: string };

export function resolveGuestTableContext(
  slug: string,
  tableToken: string,
  guestToken: string | null | undefined,
): GuestTableContextResult {
  const est = findEstablishmentBySlug(slug);
  if (!est) return { ok: false, status: 404, error: "Estabelecimento não encontrado." };

  const tbl = findTableByQr(est.id, tableToken);
  if (!tbl) return { ok: false, status: 404, error: "Mesa inválida ou QR expirado." };

  const guestAuth = validateClientSession(guestToken);
  if (guestAuth) {
    if (
      guestAuth.establishment.id !== est.id ||
      guestAuth.participation.tableId !== tbl.id
    ) {
      return { ok: false, status: 403, error: "Sessão não corresponde a esta mesa." };
    }
  }

  const command = getActiveCommand(tbl);
  const summary = guestTableSummary(est.id, command?.id);

  return {
    ok: true,
    data: {
      establishment: {
        id: est.id,
        slug: est.slug,
        name: est.name,
        open: est.open,
        rodizioEnabled: est.rodizioEnabled,
        operationMode: est.operationMode || "a_la_carte",
      },
      table: { id: tbl.id, number: tbl.number, name: tbl.name, status: tbl.status },
      command,
      otpRequired: otpRequiredForEstablishment(est),
      otpBypass: publicOtpBypassHint(),
      hasSession: Boolean(guestAuth),
      operationMode: est.operationMode || "a_la_carte",
      ...summary,
    },
  };
}
