import { publicParticipation, validateClientSession } from "@/lib/guest";
import { cancelGuestClosing, requestGuestClosing } from "@/lib/guest-closing";
import { readClientToken } from "@/lib/guest-request";
import type { ClosingScope } from "@/lib/types";

export async function POST(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) {
    return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    scope?: ClosingScope;
    targetGuestParticipationIds?: string[];
  };
  const scope = body.scope || "TABLE";
  if (!["SELF", "SELECTED", "TABLE"].includes(scope)) {
    return Response.json({ error: "Escopo inválido." }, { status: 400 });
  }

  const result = requestGuestClosing(
    guestAuth.participation.id,
    scope,
    body.targetGuestParticipationIds || [],
  );
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({
    closingRequest: result.value.closingRequest,
    participation: publicParticipation(result.value.participation),
  });
}
