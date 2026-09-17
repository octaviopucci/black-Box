import assert from "node:assert/strict";
import { buildClosingSummary } from "./closing";
import type { GuestParticipation, Order, OrderItemSplit } from "./types";

const participationA: GuestParticipation = {
  id: "gp_a",
  establishmentId: "est_1",
  commandId: "cmd_1",
  tableId: "tbl_1",
  phoneLookupHash: "hash_a",
  phoneDisplay: "+55 ** *****-1111",
  displayName: "Ana",
  participantIndex: 1,
  status: "OPEN",
  joinedAt: "2026-01-01T00:00:00.000Z",
  verifiedAt: "2026-01-01T00:00:00.000Z",
  orderCount: 1,
};

const participationB: GuestParticipation = {
  ...participationA,
  id: "gp_b",
  phoneLookupHash: "hash_b",
  phoneDisplay: "+55 ** *****-2222",
  displayName: "Bruno",
  participantIndex: 2,
};

const orders: Order[] = [
  {
    id: "ord_1",
    establishmentId: "est_1",
    tableId: "tbl_1",
    tableNumber: "01",
    commandId: "cmd_1",
    guestParticipationId: "gp_a",
    number: 1,
    status: "ENTREGUE",
    items: [
      {
        id: "oi_1",
        productId: "p_1",
        productName: "Burger",
        sectorId: "sec_1",
        sectorName: "Cozinha",
        qty: 2,
        unitPrice: 30,
        variantDelta: 0,
        addons: [],
        status: "ENTREGUE",
      },
    ],
    total: 60,
    source: "MESA",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const splits: OrderItemSplit[] = [
  {
    id: "ois_1",
    orderItemId: "oi_1",
    orderId: "ord_1",
    commandId: "cmd_1",
    guestParticipationId: "gp_a",
    quantity: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ois_2",
    orderItemId: "oi_1",
    orderId: "ord_1",
    commandId: "cmd_1",
    guestParticipationId: "gp_b",
    quantity: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const summary = buildClosingSummary(orders, [participationA, participationB], splits, []);
assert.equal(summary.commandTotal, 60);
assert.equal(summary.participants.length, 2);
assert.equal(summary.participants[0].itemTotal, 30);
assert.equal(summary.participants[1].itemTotal, 30);
assert.equal(summary.canSettle, false);

const paidSummary = buildClosingSummary(orders, [participationA, participationB], splits, [
  { guestParticipationId: "gp_a", amount: 30, status: "registered" },
  { guestParticipationId: "gp_b", amount: 30, status: "registered" },
]);
assert.equal(paidSummary.canSettle, true);

console.log("closing.test.ts ok");
