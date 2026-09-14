import { getStore, updateOrderStatus } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const status = body.status as OrderStatus;
  const order = updateOrderStatus(id, status);
  if (!order) return Response.json({ error: "Pedido não encontrado." }, { status: 404 });
  return Response.json({ order });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const store = getStore();
  const order = store.orders[id];
  if (!order) return Response.json({ error: "Não encontrado" }, { status: 404 });
  return Response.json({ order });
}
