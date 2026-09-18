import { requireKds } from "@/app/api/admin/_shared";
import { getKdsQueue } from "@/lib/kds-queue";

export async function GET(req: Request) {
  const auth = requireKds(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sectorId = searchParams.get("sector") || searchParams.get("sectorId") || "";
  if (!sectorId) {
    return Response.json({ error: "Setor obrigatório." }, { status: 400 });
  }

  const queue = getKdsQueue(auth.establishment.id, sectorId);
  if (!queue) return Response.json({ error: "Setor não encontrado." }, { status: 404 });

  return Response.json(queue);
}
