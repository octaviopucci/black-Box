import { getStore } from "@/lib/store";
import type { Order, Sector } from "@/lib/types";

export function getKdsQueue(establishmentId: string, sectorId: string) {
  const store = getStore();
  const sectors = Object.values(store.sectors).filter(
    (sector) => sector.establishmentId === establishmentId && sector.active,
  );
  const sector = sectors.find((entry) => entry.id === sectorId) || null;
  if (!sector) return null;

  const orders = Object.values(store.orders)
    .filter(
      (order) =>
        order.establishmentId === establishmentId &&
        !["ENTREGUE", "CANCELADO"].includes(order.status) &&
        order.items.some((item) => item.sectorId === sectorId),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const participations = Object.fromEntries(
    Object.values(store.guestParticipations)
      .filter((gp) => gp.establishmentId === establishmentId)
      .map((gp) => [
        gp.id,
        gp.displayName?.trim() || `Participante ${gp.participantIndex}`,
      ]),
  );

  const tickets = orders.flatMap((order) => {
    const items = order.items.filter((item) => item.sectorId === sectorId);
    if (!items.length) return [];
    const participantName = participations[order.guestParticipationId] || "Cliente";
    return [{ order, items, participantName }];
  });

  const establishment = Object.values(store.establishments).find(
    (entry) => entry.id === establishmentId,
  );

  return {
    sector,
    sectors,
    tickets,
    orderCount: orders.length,
    soundNotifications: establishment?.settings.soundNotifications ?? true,
  };
}

export type KdsTicket = {
  order: Order;
  items: Order["items"];
  participantName: string;
};

export type KdsSector = Sector;
