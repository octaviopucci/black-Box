import { getMerchantDetail, updateMerchantStatus } from "@/lib/platform-store";
import type { PlatformStatus } from "@/lib/types";
import { readJson, requirePlatformOwner } from "../../_shared";

function parseStatus(value: unknown): PlatformStatus | null {
  if (value === "active" || value === "inactive" || value === "suspended") return value;
  return null;
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const merchant = getMerchantDetail(id);
  if (!merchant) return Response.json({ error: "Lojista não encontrado." }, { status: 404 });
  return Response.json({ merchant });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await readJson(req)) as { platformStatus?: unknown; reason?: string } | null;
  const status = parseStatus(body?.platformStatus);
  if (!status) {
    return Response.json({ error: "platformStatus inválido (active, inactive, suspended)." }, { status: 400 });
  }
  const result = updateMerchantStatus(id, status, body?.reason);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ merchant: result.value });
}
