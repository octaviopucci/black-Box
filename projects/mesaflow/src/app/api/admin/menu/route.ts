import { listGuestMenuCatalog } from "@/lib/store";
import { requireWaiter } from "../_shared";

/** Cardápio operacional — mesmo payload de visibilidade do guest (categorias/produtos ativos). */
export async function GET(req: Request) {
  const auth = requireWaiter(req, "order.view");
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const catalog = listGuestMenuCatalog(auth.establishment.id);
  return Response.json({
    establishment: auth.establishment,
    ...catalog,
  });
}
