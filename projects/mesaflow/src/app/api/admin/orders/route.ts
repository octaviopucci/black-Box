import { getStore, validateActiveSession } from "@/lib/store";
import { readAdminSessionToken } from "@/lib/staff-auth-request";

/** Alias de GET /orders — lista pedidos do estabelecimento autenticado. */
export async function GET(req: Request) {
  const auth = validateActiveSession(readAdminSessionToken(req));
  const allowed = ["OWNER", "MANAGER", "WAITER", "COUNTER"];
  if (!auth || !allowed.includes(auth.user.role)) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  const url = new URL(req.url);
  const commandId = url.searchParams.get("commandId");
  const store = getStore();
  let orders = Object.values(store.orders).filter((o) => o.establishmentId === auth.establishment.id);
  if (commandId) orders = orders.filter((o) => o.commandId === commandId);
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return Response.json({ orders });
}
