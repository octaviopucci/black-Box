import {
  getAdminDashboardPayload,
  parseAdminDashboardPeriod,
  parseAdminDashboardScope,
} from "@/lib/admin-dashboard";
import { requireDashboard } from "../_shared";

export async function GET(req: Request) {
  const auth = requireDashboard(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const period = parseAdminDashboardPeriod(searchParams.get("period"));
  const scope = parseAdminDashboardScope(
    searchParams.get("scope"),
    searchParams.has("period"),
  );

  const payload = getAdminDashboardPayload(auth.establishment, period, scope);
  return Response.json(payload, {
    headers: {
      "Cache-Control": scope === "overview" ? "private, max-age=10" : "private, no-cache",
    },
  });
}
