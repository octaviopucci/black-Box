import { requireAdmin } from "../../_shared";
import { deleteMerchantSubjectData } from "@/lib/privacy-dsr";

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { confirm?: boolean };
  if (body.confirm !== true) {
    return Response.json({ error: "Confirme com { \"confirm\": true }." }, { status: 400 });
  }

  const result = deleteMerchantSubjectData(auth.user.id, auth.establishment.id);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result);
}
