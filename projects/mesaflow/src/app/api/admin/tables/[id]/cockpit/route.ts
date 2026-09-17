import { getTableCockpit } from "@/lib/store-operations";
import { requireStaff } from "../../../_shared";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireStaff(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { id } = await params;
  const cockpit = getTableCockpit(auth.establishment.id, id);
  if (!cockpit) return Response.json({ error: "Mesa não encontrada." }, { status: 404 });
  return Response.json(cockpit);
}
