import { listMerchants } from "@/lib/platform-store";
import type { PlatformPlan, PlatformStatus } from "@/lib/types";
import { requirePlatformOwner } from "../_shared";

function parseStatus(value: string | null): PlatformStatus | "all" {
  if (value === "active" || value === "inactive" || value === "suspended") return value;
  return "all";
}

function parsePlan(value: string | null): PlatformPlan | "all" {
  if (value === "essencial" || value === "premium" || value === "custom") return value;
  return "all";
}

export async function GET(req: Request) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const merchants = listMerchants({
    q: searchParams.get("q") || undefined,
    status: parseStatus(searchParams.get("status")),
    plan: parsePlan(searchParams.get("plan")),
  });
  return Response.json({ merchants });
}
