import {
  generateWaiterActivationToken,
  revokeWaiterActivationToken,
} from "@/lib/waiter-store";
import { requireAdmin, mutationResponse } from "../../../_shared";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const result = generateWaiterActivationToken(auth.establishment.id, id, auth.user.id);
  return mutationResponse(result, 201);
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const result = revokeWaiterActivationToken(auth.establishment.id, id, auth.user.id);
  return mutationResponse(result);
}
