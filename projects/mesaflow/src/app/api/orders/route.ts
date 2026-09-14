import { lineTotal } from "@/lib/order-math";
import {
  createOrder,
  findEstablishmentBySlug,
  findTableByQr,
  getOrOpenCommand,
  getStore,
} from "@/lib/store";
import type { OrderItem } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const establishmentId = url.searchParams.get("establishmentId");
  const commandId = url.searchParams.get("commandId");
  const store = getStore();
  let orders = Object.values(store.orders);
  if (establishmentId) orders = orders.filter((o) => o.establishmentId === establishmentId);
  if (commandId) orders = orders.filter((o) => o.commandId === commandId);
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return Response.json({ orders });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, tableToken, items, notes } = body as {
    slug: string;
    tableToken: string;
    items: OrderItem[];
    notes?: string;
  };

  const est = findEstablishmentBySlug(slug);
  if (!est?.open) return Response.json({ error: "Estabelecimento indisponível." }, { status: 400 });
  const tbl = findTableByQr(est.id, tableToken);
  if (!tbl) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  if (!items?.length) return Response.json({ error: "Carrinho vazio." }, { status: 400 });

  const command = getOrOpenCommand(tbl);
  const order = createOrder({
    establishmentId: est.id,
    table: tbl,
    commandId: command.id,
    items: items.map((i) => ({ ...i, id: i.id || `oi_${Date.now()}` })),
    notes,
    source: "MESA",
  });

  return Response.json({ order, total: order.total });
}
