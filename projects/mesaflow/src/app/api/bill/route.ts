import { findEstablishmentBySlug, findTableByQr, requestBill } from "@/lib/store";

export async function POST(req: Request) {
  const { slug, tableToken } = await req.json();
  const est = findEstablishmentBySlug(slug);
  if (!est) return Response.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
  const table = findTableByQr(est.id, tableToken);
  if (!table) return Response.json({ error: "Mesa inválida." }, { status: 404 });
  const cmd = requestBill(table.id);
  return Response.json({ ok: true, command: cmd });
}
