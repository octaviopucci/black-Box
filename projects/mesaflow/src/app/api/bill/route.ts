import { validateClientSession } from "@/lib/guest";
import { requestGuestClosing } from "@/lib/guest-closing";
import { readClientToken } from "@/lib/guest-request";

/** @deprecated Prefer POST /guest/closing/request with scope TABLE */
export async function POST(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) {
    return Response.json({ error: "Sessão de cliente obrigatória." }, { status: 401 });
  }

  const result = requestGuestClosing(guestAuth.participation.id, "TABLE");
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({
    ok: true,
    closingRequest: result.value.closingRequest,
    scope: "TABLE",
  });
}
