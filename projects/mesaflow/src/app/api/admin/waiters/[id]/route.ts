import { deleteWaiter, updateWaiter } from "@/lib/waiter-store";
import { readJson, requireAdmin, mutationResponse } from "../../_shared";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await readJson(req)) as {
    name?: string;
    email?: string;
    active?: boolean;
    permissions?: Record<string, boolean>;
    assignedTableIds?: string[];
  };
  const result = updateWaiter(auth.establishment.id, id, auth.user.id, body);
  return mutationResponse(result);
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const result = deleteWaiter(auth.establishment.id, id, auth.user.id);
  return mutationResponse(result);
}
