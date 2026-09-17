import { settleCommand } from "@/lib/store-operations";
import { mutationResponse, requireStaff } from "../../../_shared";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ commandId: string }> },
) {
  const auth = requireStaff(req, ["OWNER", "MANAGER", "COUNTER"]);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { commandId } = await params;
  const result = settleCommand(auth.establishment.id, commandId, auth.user);
  return mutationResponse(result);
}
