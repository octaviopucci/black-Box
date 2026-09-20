import { cancelStaffOrder } from "@/lib/waiter-store";
import { readJson, requireWaiter, mutationResponse } from "../../../_shared";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireWaiter(req, "order.cancel");
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await readJson(req)) as { reason?: string };
  const result = cancelStaffOrder(auth.establishment.id, id, auth.user, body.reason);
  return mutationResponse(result);
}
