import { listAdminOperations } from "@/lib/store-operations";
import { requireStaff } from "../_shared";

export async function GET(req: Request) {
  const auth = requireStaff(req, ["OWNER", "MANAGER", "COUNTER", "WAITER"]);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  return Response.json(listAdminOperations(auth.establishment.id));
}
