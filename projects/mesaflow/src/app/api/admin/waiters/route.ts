import {
  createWaiter,
  listWaiters,
} from "@/lib/waiter-store";
import { readJson, requireAdmin, mutationResponse } from "../_shared";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  return Response.json({ waiters: listWaiters(auth.establishment.id) });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth) return Response.json({ error: "Não autorizado." }, { status: 401 });
  const body = (await readJson(req)) as {
    name?: string;
    email?: string;
    password?: string;
    permissions?: Record<string, boolean>;
    waiterKind?: "FIXED" | "TEMPORARY";
  };
  const result = createWaiter(auth.establishment, auth.user.id, {
    name: String(body.name || ""),
    email: String(body.email || ""),
    password: body.password,
    permissions: body.permissions,
    waiterKind: body.waiterKind === "FIXED" ? "FIXED" : "TEMPORARY",
  });
  return mutationResponse(result, 201);
}
