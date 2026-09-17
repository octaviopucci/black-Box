import { deleteAdminCategory, updateAdminCategory } from "@/lib/store";
import { readJson, requireAdmin } from "../../_shared";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: Context) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await context.params;
  const result = updateAdminCategory(auth.establishment.id, id, await readJson(req));
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ category: result.value });
}

export async function DELETE(req: Request, context: Context) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await context.params;
  const result = deleteAdminCategory(auth.establishment.id, id);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ category: result.value });
}
