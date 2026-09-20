import { enrichOrderWithGuest } from "@/lib/order-display";
import { resolveOrderLines } from "@/lib/order-resolve";
import { getStore, validateActiveSession } from "@/lib/store";
import { readAdminSessionToken } from "@/lib/staff-auth-request";
import { createStaffOrder, enrichOrderDisplay } from "@/lib/waiter-store";
import { readJson, requireWaiter, mutationResponse } from "../_shared";
import type { OrderLineInput, OrderServiceType } from "@/lib/types";

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
  const enriched = orders.map((order) => {
    const base = enrichOrderWithGuest(store.guestParticipations, order);
    return enrichOrderDisplay(base, store);
  });
  return Response.json({ orders: enriched });
}

/** Pedido staff (garçom) — orderOrigin=WAITER, waiterId derivado do token. */
export async function POST(req: Request) {
  const auth = requireWaiter(req, "order.create");
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const body = (await readJson(req)) as {
    tableId?: string;
    items?: OrderLineInput[];
    notes?: string;
    serviceType?: OrderServiceType;
  };
  if (!body.tableId || !body.items?.length) {
    return Response.json({ error: "Mesa e itens são obrigatórios." }, { status: 400 });
  }

  const store = getStore();
  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((sector) => sector.establishmentId === auth.establishment.id)
      .map((sector) => [sector.id, { name: sector.name }]),
  );
  const resolved = resolveOrderLines(store, auth.establishment.id, sectors, body.items);
  if (!resolved.ok) {
    return Response.json({ error: resolved.error }, { status: resolved.status });
  }

  const result = createStaffOrder({
    establishmentId: auth.establishment.id,
    tableId: body.tableId,
    items: resolved.items,
    notes: body.notes,
    serviceType: body.serviceType,
    actor: auth.user,
  });
  return mutationResponse(result, 201);
}
