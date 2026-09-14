import { findEstablishmentBySlug, findTableByQr, getOrOpenCommand, getStore } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; table: string }> },
) {
  const { slug, table } = await params;
  const est = findEstablishmentBySlug(slug);
  if (!est) return Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
  if (!est.open) return Response.json({ error: "Estabelecimento fechado no momento." }, { status: 403 });

  const tbl = findTableByQr(est.id, table);
  if (!tbl) return Response.json({ error: "Mesa inválida ou QR expirado." }, { status: 404 });

  const store = getStore();
  const command = getOrOpenCommand(tbl);
  const categories = Object.values(store.categories)
    .filter((c) => c.establishmentId === est.id && c.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const products = Object.values(store.products).filter((p) => p.establishmentId === est.id && p.active);
  const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id);
  const orders = Object.values(store.orders)
    .filter((o) => o.commandId === command.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rodizio = est.rodizioEnabled
    ? Object.values(store.rodizios).find((r) => r.establishmentId === est.id && r.active)
    : null;

  return Response.json({
    establishment: est,
    table: tbl,
    command,
    categories,
    products,
    sectors,
    orders,
    rodizio,
  });
}
