import { createAdminTable, listAdminTables } from "@/lib/store";
import { listOperationalTables } from "@/lib/waiter-store";
import { readJson, requireAdmin, requireStaff } from "../_shared";

export async function GET(req: Request) {
  const auth = requireStaff(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const url = new URL(req.url);
  const operational = url.searchParams.get("operational") === "1";
  if (operational) {
    const filter = url.searchParams.get("filter") === "mine" ? "mine" : "all";
    return Response.json({
      tables: listOperationalTables(auth.establishment.id, auth.user, filter),
    });
  }
  if (auth.user.role !== "OWNER" && auth.user.role !== "MANAGER") {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }
  return Response.json({ tables: listAdminTables(auth.establishment.id) });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const result = createAdminTable(auth.establishment.id, await readJson(req));
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ table: result.value }, { status: 201 });
}
