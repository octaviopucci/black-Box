import {
  createOrder,
  findEstablishmentBySlug,
  findTableByQr,
  getOrOpenCommand,
  getStore,
  validateSession,
} from "@/lib/store";
import { resolveOrderLines } from "@/lib/order-resolve";
import type { OrderLineInput } from "@/lib/types";

function readBearer(req: Request) {
  const auth = req.headers.get("authorization");
  const match = auth?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

export async function GET(req: Request) {
  const auth = validateSession(readBearer(req));
  if (!auth || (auth.user.role !== "OWNER" && auth.user.role !== "MANAGER")) {
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

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, tableToken, items, notes } = body as {
    slug: string;
    tableToken: string;
    items: OrderLineInput[];
    notes?: string;
  };

  const est = findEstablishmentBySlug(slug);
  if (!est?.open) return Response.json({ error: "Estabelecimento indisponível." }, { status: 400 });
  const tbl = findTableByQr(est.id, tableToken);
  if (!tbl) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  if (!items?.length) return Response.json({ error: "Carrinho vazio." }, { status: 400 });

  const store = getStore();
  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((sector) => sector.establishmentId === est.id)
      .map((sector) => [sector.id, { name: sector.name }]),
  );
  const resolved = resolveOrderLines(store, est.id, sectors, items);
  if (!resolved.ok) return Response.json({ error: resolved.error }, { status: resolved.status });

  const command = getOrOpenCommand(tbl);
  const order = createOrder({
    establishmentId: est.id,
    table: tbl,
    commandId: command.id,
    items: resolved.items,
    notes,
    source: "MESA",
  });

  return Response.json({ order, total: order.total });
}
