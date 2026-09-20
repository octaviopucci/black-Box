import { readAdminSessionToken } from "@/lib/staff-auth-request";
import { validateActiveSession, validateSession } from "@/lib/store";
import type { User, UserRole } from "@/lib/types";
import { assertWaiterPermission, type WaiterPermissionKey } from "@/lib/waiter-permissions";

function readAuth(req: Request) {
  return validateActiveSession(readAdminSessionToken(req));
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

/** Garçom ou roles superiores com permissão operacional de salão. */
export function requireWaiter(req: Request, permission?: WaiterPermissionKey) {
  const auth = requireStaff(req);
  if (!auth) return null;
  if (auth.user.role === "OWNER" || auth.user.role === "MANAGER" || auth.user.role === "COUNTER") {
    return auth;
  }
  if (auth.user.role !== "WAITER") return null;
  if (permission) {
    const check = assertWaiterPermission(auth.user, permission);
    if (!check.ok) return null;
  }
  return auth;
}

export function requirePermission(user: User, permission: WaiterPermissionKey): boolean {
  return assertWaiterPermission(user, permission).ok;
}

/** Staff session scoped to a specific establishment (SSE, realtime). */
export function requireDashboardForEstablishment(req: Request, establishmentId: string) {
  const auth = requireDashboard(req);
  if (!auth || auth.establishment.id !== establishmentId) return null;
  return auth;
}

/** Sessão staff válida sem exigir status active (auth/me, pending wall). */
export function readStaffSession(req: Request) {
  return validateSession(readAdminSessionToken(req));
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
