import { regenerateAdminTableQr } from "@/lib/store";
import { requireAdmin } from "../../../_shared";

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: Context) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await context.params;
  const result = regenerateAdminTableQr(auth.establishment.id, id);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ table: result.value });
}
