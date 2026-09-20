import type { User, UserRole, WaiterPermissions } from "./types";

export type WaiterPermissionKey = keyof WaiterPermissions;

export const WAITER_PERMISSION_KEYS: WaiterPermissionKey[] = [
  "table.view",
  "table.view_session",
  "table.add_note",
  "order.create",
  "order.view",
  "order.edit",
  "order.cancel",
  "account.view",
  "account.request",
  "account.close",
  "account.partial_close",
  "notification.view",
  "notification.action",
];

/** Defaults: view+request conta ✅; close ❌ */
export const DEFAULT_WAITER_PERMISSIONS: WaiterPermissions = {
  "table.view": true,
  "table.view_session": true,
  "table.add_note": true,
  "order.create": true,
  "order.view": true,
  "order.edit": true,
  "order.cancel": true,
  "account.view": true,
  "account.request": true,
  "account.close": false,
  "account.partial_close": false,
  "notification.view": true,
  "notification.action": true,
};

export function resolveWaiterPermissions(user: User): WaiterPermissions {
  if (user.role !== "WAITER") {
    return { ...DEFAULT_WAITER_PERMISSIONS, "account.close": true, "account.partial_close": true };
  }
  const merged = { ...DEFAULT_WAITER_PERMISSIONS };
  if (user.permissions) {
    for (const key of WAITER_PERMISSION_KEYS) {
      if (user.permissions[key] !== undefined) {
        merged[key] = user.permissions[key]!;
      }
    }
  }
  return merged;
}

export function hasWaiterPermission(user: User, permission: WaiterPermissionKey): boolean {
  if (user.role === "OWNER" || user.role === "MANAGER") return true;
  if (user.role === "COUNTER") {
    return permission !== "account.partial_close" || true;
  }
  if (user.role !== "WAITER") {
    return ["order.view", "notification.view"].includes(permission);
  }
  return resolveWaiterPermissions(user)[permission];
}

export function assertWaiterPermission(
  user: User,
  permission: WaiterPermissionKey,
): { ok: true } | { ok: false; error: string } {
  if (!hasWaiterPermission(user, permission)) {
    return { ok: false, error: `Permissão negada: ${permission}` };
  }
  return { ok: true };
}

export function publicWaiterPermissions(user: User): WaiterPermissions {
  return resolveWaiterPermissions(user);
}

export function isWaiterRole(role: UserRole): boolean {
  return role === "WAITER";
}
