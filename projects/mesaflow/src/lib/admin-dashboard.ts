import { dashboardAnalytics, type DashboardPeriod } from "./dashboard-analytics";
import { dashboardStats, getStore, persistStatus } from "./store";
import type { Establishment } from "./types";

export function parseAdminDashboardPeriod(value: string | null | undefined): DashboardPeriod {
  if (value === "7d" || value === "30d") return value;
  return "today";
}

/** Payload compartilhado: Next route standalone + handler embarcado (light deploy). */
export function buildAdminDashboardPayload(establishment: Establishment, period: DashboardPeriod = "today") {
  const store = getStore();
  const stats = dashboardStats(establishment.id);
  const analytics = dashboardAnalytics(establishment.id, period);
  const analyticsWeek = period === "7d" ? analytics : dashboardAnalytics(establishment.id, "7d");
  const analyticsMonth = period === "30d" ? analytics : dashboardAnalytics(establishment.id, "30d");

  const orders = Object.values(store.orders)
    .filter((o) => o.establishmentId === establishment.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id);
  const sectors = Object.values(store.sectors).filter(
    (s) => s.establishmentId === establishment.id && s.active,
  );
  const notifications = Object.values(store.notifications)
    .filter((n) => n.establishmentId === establishment.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);
  const commands = Object.values(store.commands).filter((c) => c.establishmentId === establishment.id);
  const categories = Object.values(store.categories).filter((c) => c.establishmentId === establishment.id);
  const products = Object.values(store.products).filter((p) => p.establishmentId === establishment.id);
  const activeParticipations = Object.values(store.guestParticipations)
    .filter((gp) => gp.establishmentId === establishment.id && gp.status !== "CLOSED")
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
  const recentParticipations = Object.values(store.guestParticipations)
    .filter((gp) => gp.establishmentId === establishment.id && gp.status === "CLOSED")
    .sort((a, b) => (b.closedAt || "").localeCompare(a.closedAt || ""))
    .slice(0, 20);

  return {
    establishment,
    persist: persistStatus(),
    stats,
    analytics,
    analyticsWeek,
    analyticsMonth,
    activeParticipations,
    recentParticipations,
    orders,
    tables,
    sectors,
    commands,
    notifications,
    categories,
    products,
  };
}
