import {
  dashboardAnalyticsBundle,
  invalidateDashboardAnalyticsCache,
  type DashboardAnalyticsSnapshot,
  type DashboardPeriod,
} from "./dashboard-analytics";
import { getStore, persistStatus } from "./store";
import type { Establishment } from "./types";

export function parseAdminDashboardPeriod(value: string | null | undefined): DashboardPeriod {
  if (value === "7d" || value === "30d") return value;
  return "today";
}

export type AdminDashboardScope = "full" | "overview" | "nav";

export function parseAdminDashboardScope(
  value: string | null | undefined,
  hasPeriod: boolean,
): AdminDashboardScope {
  if (value === "nav" || value === "overview" || value === "full") return value;
  return hasPeriod ? "overview" : "full";
}

const DASHBOARD_CACHE_TTL_MS = 15_000;
const payloadCache = new Map<string, { expires: number; payload: unknown }>();

export function resetAdminDashboardCacheForTests() {
  payloadCache.clear();
}

/** Limpa cache da Visão geral após mutações operacionais (pedidos, pagamentos). */
export function invalidateAdminDashboardCache(establishmentId: string) {
  invalidateDashboardAnalyticsCache(establishmentId);
  for (const key of payloadCache.keys()) {
    if (key.startsWith(`${establishmentId}:`)) payloadCache.delete(key);
  }
}

function statsFromAnalytics(analytics: DashboardAnalyticsSnapshot) {
  return {
    revenue: analytics.sales.revenue,
    ordersToday: analytics.sales.ordersCount,
    ticketAvg: analytics.sales.ticketAvg,
    tablesOccupied: analytics.occupancy.occupied,
    tablesTotal: analytics.occupancy.tablesTotal,
    inPrep: analytics.inPrep,
    pending: analytics.pendingOrders,
    topProducts: analytics.topProducts,
    paymentsCollected: analytics.sales.paymentsCollected,
    activeSessions: analytics.sessions.active,
    paymentsPending: analytics.payments.pending,
    paymentsConfirmed: analytics.payments.confirmed,
  };
}

function slimEstablishment(establishment: Establishment) {
  return {
    id: establishment.id,
    name: establishment.name,
    slug: establishment.slug,
    businessType: establishment.businessType,
    operationMode: establishment.operationMode,
  };
}

/** Payload compartilhado: Next route standalone + handler embarcado (light deploy). */
export function buildAdminDashboardPayload(
  establishment: Establishment,
  period: DashboardPeriod = "today",
  scope: AdminDashboardScope = "full",
) {
  const store = getStore();

  if (scope === "nav") {
    const sectors = Object.values(store.sectors).filter(
      (sector) => sector.establishmentId === establishment.id && sector.active,
    );
    return {
      persist: persistStatus(),
      sectors,
    };
  }

  const bundle = dashboardAnalyticsBundle(establishment.id);
  const analytics = bundle[period];
  const analyticsWeek = bundle["7d"];
  const analyticsMonth = bundle["30d"];
  const notifications = Object.values(store.notifications)
    .filter((notification) => notification.establishmentId === establishment.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10);

  const overview = {
    establishment: slimEstablishment(establishment),
    persist: persistStatus(),
    stats: statsFromAnalytics(bundle.today),
    analytics,
    analyticsWeek,
    analyticsMonth,
    notifications,
  };

  if (scope === "overview") return overview;

  const orders = Object.values(store.orders)
    .filter((order) => order.establishmentId === establishment.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const tables = Object.values(store.tables).filter((table) => table.establishmentId === establishment.id);
  const sectors = Object.values(store.sectors).filter(
    (sector) => sector.establishmentId === establishment.id && sector.active,
  );
  const commands = Object.values(store.commands).filter(
    (command) => command.establishmentId === establishment.id,
  );
  const categories = Object.values(store.categories).filter(
    (category) => category.establishmentId === establishment.id,
  );
  const products = Object.values(store.products).filter(
    (product) => product.establishmentId === establishment.id,
  );
  const activeParticipations = Object.values(store.guestParticipations)
    .filter(
      (participation) =>
        participation.establishmentId === establishment.id && participation.status !== "CLOSED",
    )
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
  const recentParticipations = Object.values(store.guestParticipations)
    .filter(
      (participation) =>
        participation.establishmentId === establishment.id && participation.status === "CLOSED",
    )
    .sort((a, b) => (b.closedAt || "").localeCompare(a.closedAt || ""))
    .slice(0, 20);

  return {
    ...overview,
    establishment,
    activeParticipations,
    recentParticipations,
    orders,
    tables,
    sectors,
    commands,
    categories,
    products,
  };
}

/** Cache curto por lojista — Visão geral atinge warm path em trocas de período. */
export function getAdminDashboardPayload(
  establishment: Establishment,
  period: DashboardPeriod = "today",
  scope: AdminDashboardScope = "full",
) {
  if (scope === "full") {
    return buildAdminDashboardPayload(establishment, period, scope);
  }

  const key = `${establishment.id}:${scope}:${period}`;
  const now = Date.now();
  const hit = payloadCache.get(key);
  if (hit && hit.expires > now) return hit.payload;

  const payload = buildAdminDashboardPayload(establishment, period, scope);
  payloadCache.set(key, { expires: now + DASHBOARD_CACHE_TTL_MS, payload });
  return payload;
}
