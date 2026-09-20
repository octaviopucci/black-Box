import { resetWaiterPassword } from "@/lib/waiter-store";
import { readJson, requireAdmin, mutationResponse } from "../../../_shared";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await readJson(req)) as { password?: string };
  const result = resetWaiterPassword(
    auth.establishment.id,
    id,
    auth.user.id,
    String(body.password || ""),
  );
  return mutationResponse(result);
}
