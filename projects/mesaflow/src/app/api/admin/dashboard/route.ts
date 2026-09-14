import { dashboardStats, findEstablishmentBySlug, getStore } from "@/lib/store";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return Response.json({ error: "slug required" }, { status: 400 });
  const est = findEstablishmentBySlug(slug);
  if (!est) return Response.json({ error: "not found" }, { status: 404 });
  const store = getStore();
  const stats = dashboardStats(est.id);
  const orders = Object.values(store.orders)
    .filter((o) => o.establishmentId === est.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
  const notifications = Object.values(store.notifications)
    .filter((n) => n.establishmentId === est.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);
  const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
  return Response.json({ establishment: est, stats, orders, tables, commands, notifications });
}
