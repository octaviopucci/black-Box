import { requestAccountByStaff } from "@/lib/waiter-store";
import { readJson, requireWaiter, mutationResponse } from "../../../_shared";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireWaiter(req, "account.request");
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await readJson(req)) as { scope?: "TABLE" | "SELF" };
  const result = requestAccountByStaff(
    auth.establishment.id,
    id,
    auth.user,
    body.scope === "SELF" ? "SELF" : "TABLE",
  );
  return mutationResponse(result);
}
