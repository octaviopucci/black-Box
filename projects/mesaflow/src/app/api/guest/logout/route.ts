import { revokeClientSession } from "@/lib/guest";
import { jsonClearClientCookie, readClientToken } from "../_shared";

export async function POST(req: Request) {
  revokeClientSession(readClientToken(req));
  return jsonClearClientCookie({ ok: true });
}
