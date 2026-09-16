import {
  createRodizioRound,
  getOrOpenCommand,
  getStore,
} from "@/lib/store";
import { validateClientSession } from "@/lib/guest";
import { resolveOrderLines } from "@/lib/order-resolve";
import { readClientToken } from "@/lib/guest-request";
import type { OrderLineInput } from "@/lib/types";

export async function POST(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) return Response.json({ error: "Sessão de cliente obrigatória." }, { status: 401 });
  if (guestAuth.participation.status !== "OPEN") {
    return Response.json({ error: "Sua participação não permite novos pedidos." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({})) as {
    rodizioId?: string;
    items?: OrderLineInput[];
  };
  const est = guestAuth.establishment;
  if (!est.rodizioEnabled) return Response.json({ error: "Rodízio indisponível." }, { status: 400 });
  const store = getStore();
  const table = store.tables[guestAuth.participation.tableId];
  if (!table) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  const rodizio = store.rodizios[String(body.rodizioId || "")];
  if (!rodizio || rodizio.establishmentId !== est.id) {
    return Response.json({ error: "Rodízio não encontrado." }, { status: 404 });
  }

  const sectors = Object.fromEntries(
    Object.values(store.sectors)
      .filter((sector) => sector.establishmentId === est.id)
      .map((sector) => [sector.id, { name: sector.name }]),
  );
  const resolved = resolveOrderLines(store, est.id, sectors, body.items || [], {
    unitPriceFor: (product) => {
      if (rodizio.premiumProductIds.includes(product.id)) {
        return product.rodizioPremiumPrice ?? product.price;
      }
      if (rodizio.productIds.includes(product.id)) return 0;
      return product.price;
    },
  });
  if (!resolved.ok) return Response.json({ error: resolved.error }, { status: resolved.status });
  if (resolved.items.length > rodizio.maxItemsPerRound) {
    return Response.json({ error: `Máximo ${rodizio.maxItemsPerRound} itens por rodada.` }, { status: 400 });
  }

  const command = getOrOpenCommand(table);
  const round = createRodizioRound({
    establishmentId: est.id,
    table,
    commandId: command.id,
    guestParticipationId: guestAuth.participation.id,
    rodizioId: rodizio.id,
    items: resolved.items,
  });
  return Response.json({ round, message: "Rodada enviada para a cozinha." });
}
