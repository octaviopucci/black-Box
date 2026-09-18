import { publicParticipation, validateClientSession } from "@/lib/guest";
import { cancelGuestClosing } from "@/lib/guest-closing";
import { readClientToken } from "@/lib/guest-request";

export async function POST(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) {
    return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });
  }

  const result = cancelGuestClosing(guestAuth.participation.id);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({
    cancelled: result.value.cancelled,
    participation: publicParticipation(result.value.participation),
  });
}
