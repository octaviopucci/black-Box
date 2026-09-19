import { catalogSeedForEstablishment } from "@/lib/catalog-seeds";
import { getStore } from "@/lib/store";
import { requirePlatformOwner } from "../../../_shared";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }

  const { id: establishmentId } = await ctx.params;
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) {
    return Response.json({ error: "Lojista não encontrado." }, { status: 404 });
  }

  const seed = catalogSeedForEstablishment(establishment);
  if (!seed) {
    return Response.json(
      { error: "Nenhum cardápio seed registrado para este lojista." },
      { status: 404 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { createIfMissing?: boolean };
  const result = await seed.importCatalog({
    establishmentId,
    createIfMissing: body.createIfMissing === true,
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result);
}
