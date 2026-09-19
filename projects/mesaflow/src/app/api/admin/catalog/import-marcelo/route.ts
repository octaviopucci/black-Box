import { importMarceloLanchesCatalog } from "@/lib/store";

function catalogImportAuthorized(req: Request) {
  const secret = process.env.MESAFLOW_CATALOG_IMPORT_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get("x-mesaflow-import-secret");
  return header === secret;
}

export async function POST(req: Request) {
  if (!catalogImportAuthorized(req)) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { createIfMissing?: boolean };
  const result = await importMarceloLanchesCatalog({
    createIfMissing: body.createIfMissing === true,
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 404 });
  }

  return Response.json(result);
}
