import { validateClientSession } from "@/lib/guest";
import { exportGuestSubjectData } from "@/lib/privacy-dsr";

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const guestAuth = validateClientSession(match?.[1]?.trim());
  if (!guestAuth) return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });

  const result = exportGuestSubjectData(guestAuth.participation.id);
  if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
  return Response.json(result);
}
