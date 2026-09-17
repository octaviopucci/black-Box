import { markNotificationRead } from "@/lib/store-operations";
import { mutationResponse, requireStaff } from "../../../_shared";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireStaff(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await params;
  const result = markNotificationRead(auth.establishment.id, id);
  return mutationResponse(result);
}
