import { buildClosingSummary } from "@/lib/closing";
import { resolveOperationMode } from "@/lib/operation-modes";
import { sumRegisteredPayments } from "@/lib/payments";
import { getStore } from "@/lib/store";
import type { Establishment, GuestParticipation, OperationMode } from "@/lib/types";

const MS_HOUR = 60 * 60 * 1000;
const STALE_PARTICIPATION_MS = 12 * MS_HOUR;

export type DashboardPeriod = "today" | "7d" | "30d";

function periodStart(period: DashboardPeriod): string {
  const now = new Date();
  if (period === "today") {
    return now.toISOString().slice(0, 10);
  }
  const days = period === "7d" ? 7 : 30;
  const start = new Date(now.getTime() - days * 24 * MS_HOUR);
  return start.toISOString();
}

function inPeriod(iso: string, period: DashboardPeriod): boolean {
  const start = periodStart(period);
  if (period === "today") return iso.startsWith(start);
  return iso >= start;
}

function durationMinutes(from: string, to: string): number {
  return Math.max(0, (new Date(to).getTime() - new Date(from).getTime()) / 60000);
}

export function dashboardAnalytics(establishmentId: string, period: DashboardPeriod = "today") {
  const store = getStore();
  const establishment = store.establishments[establishmentId] as Establishment | undefined;
  const operationMode = resolveOperationMode(establishment);

  const orders = Object.values(store.orders).filter(
    (o) => o.establishmentId === establishmentId && o.status !== "CANCELADO" && inPeriod(o.createdAt, period),
  );
  const deliveredOrders = orders.filter((o) => o.status === "ENTREGUE");
  const salesRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const ticketAvg = deliveredOrders.length ? salesRevenue / deliveredOrders.length : 0;

  const payments = Object.values(store.payments || {}).filter(
    (p) => p.establishmentId === establishmentId && p.status === "registered" && inPeriod(p.registeredAt, period),
  );
  const paymentsCollected = sumRegisteredPayments(payments);

  const salesByTable: Record<string, { tableNumber: string; revenue: number; orders: number }> = {};
  for (const order of deliveredOrders) {
    if (!salesByTable[order.tableId]) {
      salesByTable[order.tableId] = { tableNumber: order.tableNumber, revenue: 0, orders: 0 };
    }
    salesByTable[order.tableId].revenue += order.total;
    salesByTable[order.tableId].orders += 1;
  }

  const salesByMode: Record<OperationMode, number> = {
    a_la_carte: 0,
    rodizio: 0,
    buffet: 0,
    self_service: 0,
    peso_kg: 0,
    comanda: 0,
    personalizado: 0,
    outros: 0,
  };
  salesByMode[operationMode] = salesRevenue;

  const participations = Object.values(store.guestParticipations).filter(
    (gp) => gp.establishmentId === establishmentId,
  );
  const activeSessions = participations.filter((gp) => gp.status !== "CLOSED");
  const historicalSessions = participations.filter(
    (gp) => gp.status === "CLOSED" && gp.closedAt && inPeriod(gp.closedAt, period),
  );

  const abandonedSessions = historicalSessions.filter(
    (gp) => !gp.paymentConfirmedAt && gp.orderCount > 0 && gp.closedByUserId,
  );
  const abandonmentTimes = abandonedSessions.map((gp) =>
    durationMinutes(gp.joinedAt, gp.closedAt || gp.joinedAt),
  );
  const avgAbandonmentMinutes =
    abandonmentTimes.length > 0
      ? abandonmentTimes.reduce((a, b) => a + b, 0) / abandonmentTimes.length
      : 0;

  const closedWithDuration = historicalSessions.filter((gp) => gp.closedAt);
  const permanenceMinutes = closedWithDuration.map((gp) =>
    durationMinutes(gp.joinedAt, gp.closedAt!),
  );
  const avgPermanenceMinutes =
    permanenceMinutes.length > 0
      ? permanenceMinutes.reduce((a, b) => a + b, 0) / permanenceMinutes.length
      : 0;

  const permanenceDistribution = [
    { label: "< 30 min", max: 30, count: 0 },
    { label: "30–60 min", max: 60, count: 0 },
    { label: "1–2 h", max: 120, count: 0 },
    { label: "> 2 h", max: Infinity, count: 0 },
  ];
  for (const minutes of permanenceMinutes) {
    if (minutes < 30) permanenceDistribution[0].count += 1;
    else if (minutes < 60) permanenceDistribution[1].count += 1;
    else if (minutes < 120) permanenceDistribution[2].count += 1;
    else permanenceDistribution[3].count += 1;
  }

  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishmentId);
  const tablesOccupied = tables.filter((t) => t.status === "OCUPADA").length;
  const tablesAwaitingPayment = tables.filter((t) => t.status === "AGUARDANDO_PAGAMENTO").length;
  const tablesFree = tables.filter((t) => t.status === "LIVRE").length;

  const commands = Object.values(store.commands).filter((c) => c.establishmentId === establishmentId);
  const openCommands = commands.filter((c) => c.status !== "FECHADA").length;
  const closedCommandsPeriod = commands.filter(
    (c) => c.status === "FECHADA" && c.closedAt && inPeriod(c.closedAt, period),
  ).length;

  let paymentsConfirmed = 0;
  let paymentsPending = 0;
  for (const gp of activeSessions) {
    if (gp.paymentConfirmedAt) {
      paymentsConfirmed += 1;
      continue;
    }
    const gpOrders = Object.values(store.orders).filter(
      (o) => o.guestParticipationId === gp.id && o.status !== "CANCELADO",
    );
    const gpSplits = Object.values(store.orderItemSplits || {}).filter((s) => s.guestParticipationId === gp.id);
    const gpPayments = Object.values(store.payments || {}).filter(
      (p) => p.guestParticipationId === gp.id && p.status === "registered",
    );
    const summary = buildClosingSummary(gpOrders, [gp], gpSplits, gpPayments);
    const participant = summary.participants[0];
    if ((participant?.itemTotal ?? 0) > 0.009) {
      paymentsPending += 1;
    }
  }

  const alerts: Array<{ level: "warning" | "danger" | "info"; title: string; body: string; href?: string }> = [];
  const now = Date.now();

  for (const table of tables) {
    if (table.status !== "AGUARDANDO_PAGAMENTO" || !table.commandId) continue;
    const command = store.commands[table.commandId];
    if (!command?.closingRequestedAt) continue;
    const waitMin = durationMinutes(command.closingRequestedAt, new Date().toISOString());
    if (waitMin >= 15) {
      alerts.push({
        level: "warning",
        title: `Mesa ${table.number} aguardando pagamento`,
        body: `Conta solicitada há ${Math.round(waitMin)} min`,
        href: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`,
      });
    }
  }

  for (const gp of activeSessions) {
    if (gp.orderCount === 0) continue;
    if (gp.paymentConfirmedAt) continue;
    const age = now - new Date(gp.joinedAt).getTime();
    if (age > STALE_PARTICIPATION_MS) {
      alerts.push({
        level: "danger",
        title: "Sessão longa sem confirmação",
        body: `${gp.displayName || "Cliente"} · mesa aberta há ${Math.round(age / MS_HOUR)} h`,
        href: `/admin/tables/cockpit?table=${encodeURIComponent(gp.tableId)}`,
      });
    }
  }

  const pendingOrders = orders.filter((o) => o.status === "NOVO").length;
  if (pendingOrders >= 5) {
    alerts.push({
      level: "info",
      title: "Fila de pedidos",
      body: `${pendingOrders} pedidos aguardando aceite`,
      href: "/admin/orders",
    });
  }

  if (paymentsPending > 0) {
    alerts.push({
      level: "warning",
      title: "Pagamentos pendentes de confirmação",
      body: `${paymentsPending} cliente(s) com consumo aguardando OK do restaurante`,
      href: "/admin/operations",
    });
  }

  const productSales: Record<string, { name: string; qty: number }> = {};
  for (const o of orders) {
    for (const item of o.items) {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, qty: 0 };
      productSales[item.productId].qty += item.qty;
    }
  }
  const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return {
    period,
    operationMode,
    sales: {
      revenue: salesRevenue,
      ordersCount: orders.length,
      deliveredCount: deliveredOrders.length,
      ticketAvg,
      paymentsCollected,
      byTable: Object.values(salesByTable).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      byOperationMode: Object.entries(salesByMode)
        .filter(([, revenue]) => revenue > 0)
        .map(([mode, revenue]) => ({ mode, revenue })),
    },
    sessions: {
      active: activeSessions.length,
      historical: historicalSessions.length,
      abandoned: abandonedSessions.length,
      avgAbandonmentMinutes,
    },
    permanence: {
      avgMinutes: avgPermanenceMinutes,
      distribution: permanenceDistribution,
    },
    occupancy: {
      tablesTotal: tables.length,
      occupied: tablesOccupied,
      awaitingPayment: tablesAwaitingPayment,
      free: tablesFree,
      openCommands,
      closedCommandsPeriod,
    },
    payments: {
      confirmed: paymentsConfirmed,
      pending: paymentsPending,
    },
    alerts,
    topProducts,
    inPrep: orders.filter((o) => ["ACEITO", "EM_PREPARO"].includes(o.status)).length,
    pendingOrders,
  };
}

export function summarizeParticipation(gp: GuestParticipation) {
  return {
    id: gp.id,
    displayName: gp.displayName,
    status: gp.status,
    joinedAt: gp.joinedAt,
    closedAt: gp.closedAt,
    paymentConfirmedAt: gp.paymentConfirmedAt,
    orderCount: gp.orderCount,
    tableId: gp.tableId,
    commandId: gp.commandId,
  };
}
