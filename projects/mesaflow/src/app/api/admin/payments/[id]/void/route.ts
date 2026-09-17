import { voidPayment } from "@/lib/store-operations";
import { mutationResponse, requireStaff } from "../../../_shared";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireStaff(req, ["OWNER", "MANAGER", "COUNTER"]);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await params;
  const result = voidPayment(auth.establishment.id, id, auth.user);
  return mutationResponse(result);
}
