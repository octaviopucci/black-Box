import { readAdminSessionToken } from "@/lib/staff-auth-request";
import { getStore, updateOrderStatus, validateSession } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = validateSession(readAdminSessionToken(req));
  if (
    !auth ||
    !["OWNER", "MANAGER", "KITCHEN", "COUNTER", "WAITER"].includes(auth.user.role)
  ) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const status = body.status as OrderStatus;
  const order = updateOrderStatus(id, status, auth.establishment.id);
  if (!order) return Response.json({ error: "Pedido não encontrado." }, { status: 404 });
  return Response.json({ order });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = validateSession(readAdminSessionToken(req));
  if (!auth || (auth.user.role !== "OWNER" && auth.user.role !== "MANAGER")) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const store = getStore();
  const order = store.orders[id];
  if (!order || order.establishmentId !== auth.establishment.id) {
    return Response.json({ error: "Não encontrado" }, { status: 404 });
  }
  return Response.json({ order });
}
