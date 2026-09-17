import { ensureIntegrationCatalog, listIntegrations } from "@/lib/store-operations";
import { requireAdmin } from "../_shared";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  ensureIntegrationCatalog(auth.establishment.id);
  return Response.json(listIntegrations(auth.establishment.id));
}
