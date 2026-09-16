import { getStore, updateOrderStatus, validateSession } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

function readBearer(req: Request) {
  const auth = req.headers.get("authorization");
  const match = auth?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = validateSession(readBearer(req));
  if (
    !auth ||
    !["OWNER", "MANAGER", "KITCHEN", "COUNTER"].includes(auth.user.role)
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
  const auth = validateSession(readBearer(req));
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
