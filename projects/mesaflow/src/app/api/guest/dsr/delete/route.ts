import { validateClientSession } from "@/lib/guest";
import { deleteGuestSubjectData } from "@/lib/privacy-dsr";

export async function POST(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const guestAuth = validateClientSession(match?.[1]?.trim());
  if (!guestAuth) return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { confirm?: boolean };
  if (body.confirm !== true) {
    return Response.json({ error: "Confirme com { \"confirm\": true }." }, { status: 400 });
  }

  const result = deleteGuestSubjectData(guestAuth.participation.id);
  if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
  return Response.json(result);
}
