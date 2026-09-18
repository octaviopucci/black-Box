import { validateSession } from "@/lib/store";
import type { UserRole } from "@/lib/types";

function readAuth(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return validateSession(match?.[1]?.trim());
}

export function requireAdmin(req: Request) {
  const auth = readAuth(req);
  return auth && (auth.user.role === "OWNER" || auth.user.role === "MANAGER") ? auth : null;
}

export function requireDashboard(req: Request) {
  const auth = readAuth(req);
  const allowed: UserRole[] = ["OWNER", "MANAGER", "COUNTER", "WAITER", "KITCHEN"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}

export function requireKds(req: Request) {
  const auth = readAuth(req);
  const allowed: UserRole[] = ["OWNER", "MANAGER", "KITCHEN", "COUNTER"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}

export function requireStaff(req: Request, roles?: UserRole[]) {
  const auth = readAuth(req);
  const allowed = roles ?? ["OWNER", "MANAGER", "COUNTER", "WAITER"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function mutationResponse<T>(
  result: { value: T } | { error: string; status: number },
  successStatus = 200,
) {
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result.value, { status: successStatus });
}
