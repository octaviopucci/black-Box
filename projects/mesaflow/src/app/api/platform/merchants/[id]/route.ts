import { updateMerchant } from "@/lib/platform-store";
import { parsePlatformPlan } from "@/lib/platform-plans";
import type { PlatformStatus } from "@/lib/types";
import { readJson, requirePlatformOwner } from "../../_shared";

function parseStatus(value: unknown): PlatformStatus | null {
  if (
    value === "pending" ||
    value === "active" ||
    value === "inactive" ||
    value === "suspended" ||
    value === "rejected"
  ) {
    return value;
  }
  return null;
}

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
    reason?: string;
  } | null;

  const platformStatus = body?.platformStatus !== undefined ? parseStatus(body.platformStatus) : undefined;
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

  const result = updateMerchant(id, {
    platformStatus: platformStatus ?? undefined,
    plan: plan ?? undefined,
    reason: body?.reason,
  });
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ merchant: result.value });
}
