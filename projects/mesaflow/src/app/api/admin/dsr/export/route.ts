import { requireAdmin } from "../../_shared";
import { exportMerchantSubjectData } from "@/lib/privacy-dsr";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  if (auth.user.role !== "OWNER") {
    return Response.json({ error: "Somente o titular OWNER pode exportar dados." }, { status: 403 });
  }

  const result = exportMerchantSubjectData(auth.user.id, auth.establishment.id);
  if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
  return Response.json(result);
}
