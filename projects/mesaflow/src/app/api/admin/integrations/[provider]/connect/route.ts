import { connectIntegration, disconnectIntegration } from "@/lib/store-operations";
import { mutationResponse, readJson, requireAdmin } from "../../../_shared";
import type { IntegrationProvider } from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { provider } = await params;
  const body = (await readJson(req)) as { config?: Record<string, string> } | null;
  const result = connectIntegration(
    auth.establishment.id,
    provider as IntegrationProvider,
    body?.config || {},
    auth.user.id,
  );
  return mutationResponse(result);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const { provider } = await params;
  const result = disconnectIntegration(
    auth.establishment.id,
    provider,
    auth.user.id,
  );
  return mutationResponse(result);
}
