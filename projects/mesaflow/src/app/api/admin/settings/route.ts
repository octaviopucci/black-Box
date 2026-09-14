import { getAdminSettings, updateAdminSettings } from "@/lib/store";
import { mutationResponse, readJson, requireAdmin } from "../_shared";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const establishment = getAdminSettings(auth.establishment.id);
  if (!establishment) {
    return Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
  }
  return Response.json({ establishment });
}

export async function PATCH(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const result = updateAdminSettings(auth.establishment.id, await readJson(req));
  if ("error" in result) return mutationResponse(result);
  return Response.json({ establishment: result.value });
}
