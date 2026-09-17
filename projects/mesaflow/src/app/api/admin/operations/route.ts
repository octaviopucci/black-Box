import { listAdminOperations } from "@/lib/store-operations";
import { requireAdmin } from "../_shared";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  return Response.json(listAdminOperations(auth.establishment.id));
}
