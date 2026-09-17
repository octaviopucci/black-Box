import { registerPayment } from "@/lib/store-operations";
import { mutationResponse, readJson, requireStaff } from "../../../_shared";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ commandId: string }> },
) {
  const auth = requireStaff(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { commandId } = await params;
  const body = await readJson(req);
  const result = registerPayment(auth.establishment.id, commandId, body, auth.user);
  return mutationResponse(result, 201);
}
