import { dashboardAnalytics, type DashboardPeriod } from "@/lib/dashboard-analytics";
import { dashboardStats, getStore, persistStatus } from "@/lib/store";
import { requireAdmin } from "../_shared";

function parsePeriod(value: string | null): DashboardPeriod {
  if (value === "7d" || value === "30d") return value;
  return "today";
}

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const est = auth.establishment;
  const { searchParams } = new URL(req.url);
  const period = parsePeriod(searchParams.get("period"));

  const store = getStore();
  const stats = dashboardStats(est.id);
  const analytics = dashboardAnalytics(est.id, period);
  const analyticsWeek = period === "7d" ? analytics : dashboardAnalytics(est.id, "7d");
  const analyticsMonth = period === "30d" ? analytics : dashboardAnalytics(est.id, "30d");
  const orders = Object.values(store.orders)
    .filter((o) => o.establishmentId === est.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
  const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id && s.active);
  const notifications = Object.values(store.notifications)
    .filter((n) => n.establishmentId === est.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);
  const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
  const categories = Object.values(store.categories).filter((c) => c.establishmentId === est.id);
  const products = Object.values(store.products).filter((p) => p.establishmentId === est.id);
  const activeParticipations = Object.values(store.guestParticipations)
    .filter((gp) => gp.establishmentId === est.id && gp.status !== "CLOSED")
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));

  const recentParticipations = Object.values(store.guestParticipations)
    .filter((gp) => gp.establishmentId === est.id && gp.status === "CLOSED")
    .sort((a, b) => (b.closedAt || "").localeCompare(a.closedAt || ""))
    .slice(0, 20);

  return Response.json({
    establishment: est,
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
  });
}
