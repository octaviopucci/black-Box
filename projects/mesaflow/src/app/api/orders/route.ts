import {
  createOrder,
  getOrOpenCommand,
  getStore,
  saveStore,
  validateActiveSession,
} from "@/lib/store";
import { validateClientSession } from "@/lib/guest";
import { resolveOrderLines } from "@/lib/order-resolve";
import { readClientToken } from "@/lib/guest-request";
import { readAdminSessionToken } from "@/lib/staff-auth-request";
import type { OrderLineInput, OrderServiceType } from "@/lib/types";

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

export async function POST(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) return Response.json({ error: "Sessão de cliente obrigatória." }, { status: 401 });
  if (guestAuth.participation.status !== "OPEN") {
    return Response.json({ error: "Sua participação não permite novos pedidos." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({})) as {
    items?: OrderLineInput[];
    notes?: string;
    serviceType?: OrderServiceType;
  };
  if (!body.items?.length) return Response.json({ error: "Carrinho vazio." }, { status: 400 });
  if (body.serviceType && body.serviceType !== "COMER_AQUI" && body.serviceType !== "PARA_VIAGEM") {
    return Response.json({ error: "Modalidade inválida." }, { status: 400 });
  }

  const est = guestAuth.establishment;
  if (!est.open) return Response.json({ error: "Estabelecimento indisponível." }, { status: 400 });
  const store = getStore();
  const tbl = store.tables[guestAuth.participation.tableId];
  if (!tbl) return Response.json({ error: "Mesa inválida." }, { status: 404 });

  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((sector) => sector.establishmentId === est.id)
      .map((sector) => [sector.id, { name: sector.name }]),
  );
  const resolved = resolveOrderLines(store, est.id, sectors, body.items);
  if (!resolved.ok) return Response.json({ error: resolved.error }, { status: resolved.status });

  const command = getOrOpenCommand(tbl);
  const participation = store.guestParticipations[guestAuth.participation.id] || guestAuth.participation;
  if (participation.commandId !== command.id) {
    participation.commandId = command.id;
    store.guestParticipations[participation.id] = participation;
    saveStore(store);
  }

  try {
    const order = createOrder({
      establishmentId: est.id,
      table: tbl,
      commandId: command.id,
      guestParticipationId: guestAuth.participation.id,
      items: resolved.items,
      notes: body.notes,
      source: "MESA",
      serviceType: body.serviceType || "COMER_AQUI",
    });
    return Response.json({ order, total: order.total });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o pedido.";
    return Response.json({ error: message }, { status: 403 });
  }
}
