import { readJson } from "@/app/api/admin/_shared";
import {
  resolveCatalogImportAuth,
  resolveCatalogImportEstablishmentId,
} from "@/lib/catalog-import-marcelo";
import { importMarceloLanchesCatalog } from "@/lib/store";

export async function POST(req: Request) {
  const auth = resolveCatalogImportAuth(req);
  if (!auth) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await readJson(req)) as { createIfMissing?: boolean; establishmentId?: string };
  const establishmentId = resolveCatalogImportEstablishmentId(auth, body);
  if (auth.kind === "admin" && body.establishmentId && !establishmentId) {
    return Response.json({ error: "Não autorizado." }, { status: 403 });
  }

  const result = await importMarceloLanchesCatalog({
    createIfMissing: body.createIfMissing === true,
    establishmentId,
  });

  if (!result.ok) {
    const status = result.error.includes("armazenamento compartilhado") ? 503 : 404;
    return Response.json({ error: result.error }, { status });
  }

  return Response.json(result);
}
