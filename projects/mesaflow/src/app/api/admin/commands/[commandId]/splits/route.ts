import { replaceOrderItemSplits } from "@/lib/store-operations";
import { mutationResponse, readJson, requireStaff } from "../../../_shared";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ commandId: string }> },
) {
  const auth = requireStaff(req, ["OWNER", "MANAGER", "COUNTER"]);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { commandId } = await params;
  const body = await readJson(req);
  const result = replaceOrderItemSplits(auth.establishment.id, commandId, body, auth.user.id);
  return mutationResponse(result);
}
