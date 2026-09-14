import { dashboardStats, getStore, resolveAdminEstablishment } from "@/lib/store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") || "";
  const est = resolveAdminEstablishment(slug, req.headers.get("authorization") || undefined);
  if (!est) return Response.json({ error: "Não autorizado." }, { status: 401 });

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
  return Response.json({ establishment: est, stats, orders, tables, sectors, commands, notifications });
}
