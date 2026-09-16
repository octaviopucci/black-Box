import { getStore } from "@/lib/store";
import { publicParticipation, validateClientSession } from "@/lib/guest";
import { readClientToken } from "../_shared";

export async function GET(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });
  const store = getStore();
  const orders = Object.values(store.orders)
    .filter((o) => o.guestParticipationId === guestAuth.participation.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const consumptionTotal = orders
    .filter((o) => o.status !== "CANCELADO")
    .reduce((sum, order) => sum + order.total, 0);
  return Response.json({
    participation: publicParticipation(guestAuth.participation),
    orders,
    consumptionTotal,
  });
}
