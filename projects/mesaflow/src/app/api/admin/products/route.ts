import { createAdminProduct, listAdminProducts } from "@/lib/store";
import { readJson, requireAdmin } from "../_shared";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  return Response.json(listAdminProducts(auth.establishment.id));
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const result = createAdminProduct(auth.establishment.id, await readJson(req));
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ product: result.value }, { status: 201 });
}
