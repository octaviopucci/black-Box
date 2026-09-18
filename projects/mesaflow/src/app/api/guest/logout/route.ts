import { leaveGuestTable } from "@/lib/guest-payment";
import { revokeClientSession } from "@/lib/guest";
import { jsonClearClientCookie, readClientToken } from "../_shared";

export async function POST(req: Request) {
  const token = readClientToken(req);
  if (!token) {
    return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });
  }
  const result = leaveGuestTable(token);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  revokeClientSession(token);
  return jsonClearClientCookie({ ok: true });
}
