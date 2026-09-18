import { resolveGuestTableContext } from "@/lib/guest-table-context";
import { readClientToken } from "../_shared";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") || "";
  const tableToken = url.searchParams.get("tableToken") || "";
  const result = resolveGuestTableContext(slug, tableToken, readClientToken(req));
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result.data);
}
