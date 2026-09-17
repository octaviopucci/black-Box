import { dashboardStats, getStore, persistStatus } from "@/lib/store";
import { requireAdmin } from "../_shared";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const est = auth.establishment;

  const store = getStore();
  const stats = dashboardStats(est.id);
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
  return Response.json({
    establishment: est,
    persist: persistStatus(),
    stats,
    orders,
    tables,
    sectors,
    commands,
    notifications,
    categories,
    products,
  });
}
