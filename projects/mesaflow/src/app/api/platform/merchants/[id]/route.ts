import { updateMerchant } from "@/lib/platform-store";
import { parsePlatformPlan } from "@/lib/platform-plans";
import { parsePlatformStatusInput } from "@/lib/platform-status";
import { readJson, requirePlatformOwner } from "../../_shared";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const { getMerchantDetail } = await import("@/lib/platform-store");
  const merchant = getMerchantDetail(id);
  if (!merchant) return Response.json({ error: "Lojista não encontrado." }, { status: 404 });
  return Response.json({ merchant });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await readJson(req)) as {
    platformStatus?: unknown;
    plan?: unknown;
    planOverrides?: unknown;
    reason?: string;
  } | null;

  const platformStatus =
    body?.platformStatus !== undefined ? parsePlatformStatusInput(body.platformStatus) : undefined;
  if (body?.platformStatus !== undefined && !platformStatus) {
    return Response.json(
      { error: "platformStatus inválido (pending, active, inactive, suspended, rejected)." },
      { status: 400 },
    );
  }

  const plan = body?.plan !== undefined ? parsePlatformPlan(body.plan) : undefined;
  if (body?.plan !== undefined && !plan) {
    return Response.json({ error: "Plano inválido (essencial, premium, custom)." }, { status: 400 });
  }

  const planOverrides =
    body?.planOverrides !== undefined
      ? (body.planOverrides as import("@/lib/types").PlanOverrides | null)
      : undefined;

  const result = await updateMerchant(id, {
    platformStatus: platformStatus ?? undefined,
    plan: plan ?? undefined,
    planOverrides,
    reason: body?.reason,
  });
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ merchant: result.value });
}
