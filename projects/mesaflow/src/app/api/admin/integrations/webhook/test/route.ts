import { testWebhookStub } from "@/lib/store-operations";
import { mutationResponse, requireAdmin } from "../../../_shared";

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const result = await testWebhookStub(auth.establishment.id);
  return mutationResponse(result);
}
