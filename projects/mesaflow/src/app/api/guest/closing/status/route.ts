import { validateClientSession } from "@/lib/guest";
import { getGuestClosingStatus } from "@/lib/guest-closing";
import { readClientToken } from "@/lib/guest-request";

export async function GET(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) {
    return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });
  }

  const status = getGuestClosingStatus(guestAuth.participation.id);
  if (!status) {
    return Response.json({ error: "Participação não encontrada." }, { status: 404 });
  }

  return Response.json(status);
}
