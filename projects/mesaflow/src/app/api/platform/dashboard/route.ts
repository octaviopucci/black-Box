import { platformDashboard } from "@/lib/platform-store";
import type { DashboardPeriod } from "@/lib/dashboard-analytics";
import { requirePlatformOwner } from "../_shared";

function parsePeriod(value: string | null): DashboardPeriod {
  if (value === "today" || value === "7d" || value === "30d") return value;
  return "30d";
}

export async function GET(req: Request) {
  if (!requirePlatformOwner(req)) {
    return Response.json({ error: "Acesso negado." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const period = parsePeriod(searchParams.get("period"));
  return Response.json(platformDashboard(period));
}
