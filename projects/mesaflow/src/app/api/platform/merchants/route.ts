import { listMerchants } from "@/lib/platform-store";
import { parsePlatformStatusFilterInput } from "@/lib/platform-status";
import type { PlatformPlan } from "@/lib/types";
import { requirePlatformOwner } from "../_shared";

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
    status: parsePlatformStatusFilterInput(searchParams.get("status")),
    plan: parsePlan(searchParams.get("plan")),
  });
  return Response.json({ merchants });
}
