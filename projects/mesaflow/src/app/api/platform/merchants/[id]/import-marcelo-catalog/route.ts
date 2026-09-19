import { requirePlatformOwner } from "../../../_shared";
import { importMarceloLanchesCatalog } from "@/lib/store";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }

  const { id: establishmentId } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { createIfMissing?: boolean };

  const result = await importMarceloLanchesCatalog({
    establishmentId,
    createIfMissing: body.createIfMissing === true,
  });

  if (!result.ok) {
    const status = result.error.includes("armazenamento compartilhado") ? 503 : 404;
    return Response.json({ error: result.error }, { status });
  }

  return Response.json(result);
}
