import { confirmGuestPayment } from "@/lib/store-operations";
import { mutationResponse, requireStaff } from "../../../_shared";

type Context = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: Context) {
  const auth = requireStaff(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await context.params;
  const result = confirmGuestPayment(auth.establishment.id, id, auth.user);
  return mutationResponse(result);
}
