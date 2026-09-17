import { forceClearTable } from "@/lib/store-operations";
import { requireAdmin } from "../../../_shared";

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: Context) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await context.params;
  const result = forceClearTable(auth.establishment.id, id, auth.user.id);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result.value);
}
