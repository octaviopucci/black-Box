import { getGuestPaymentStatus } from "@/lib/guest-payment";
import { publicParticipation, validateClientSession } from "@/lib/guest";
import { getStore } from "@/lib/store";
import { readClientToken } from "../_shared";

export async function GET(req: Request) {
  const guestAuth = validateClientSession(readClientToken(req));
  if (!guestAuth) return Response.json({ error: "Sessão de cliente inválida." }, { status: 401 });
  const store = getStore();
  const participation = store.guestParticipations[guestAuth.participation.id] ?? guestAuth.participation;
  const orders = Object.values(store.orders)
    .filter((o) => o.guestParticipationId === participation.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const consumptionTotal = orders
    .filter((o) => o.status !== "CANCELADO")
    .reduce((sum, order) => sum + order.total, 0);
  const payment = getGuestPaymentStatus(participation);
  return Response.json({
    participation: {
      ...publicParticipation(participation, { includePhone: true }),
      canLeave: payment.canLeave,
      itemTotal: payment.itemTotal,
      paidTotal: payment.paidTotal,
      remainingTotal: payment.remainingTotal,
      isSettled: payment.isSettled,
    },
    orders,
    consumptionTotal,
    payment,
  });
}
