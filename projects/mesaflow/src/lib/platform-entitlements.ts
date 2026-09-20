import { resolvePlan } from "./platform-plans";
import type { Establishment, PlatformPlan, User } from "./types";

export type PlatformFeature = "waiter_access";

export type PlatformLimit = "waiters" | "tables";

export interface PlanEntitlements {
  features: Record<PlatformFeature, boolean>;
  limits: Record<PlatformLimit, number | null>;
}

const BASE_ENTITLEMENTS: Record<PlatformPlan, PlanEntitlements> = {
  essencial: {
    features: { waiter_access: false },
    limits: { waiters: 0, tables: 10 },
  },
  premium: {
    features: { waiter_access: true },
    limits: { waiters: 5, tables: null },
  },
  custom: {
    features: { waiter_access: true },
    limits: { waiters: null, tables: null },
  },
};

export function resolveEntitlements(establishment: Establishment): PlanEntitlements {
  const plan = resolvePlan(establishment.plan);
  const base = BASE_ENTITLEMENTS[plan];
  const overrides = establishment.planOverrides;

  const features = { ...base.features };
  const limits = { ...base.limits };

  if (overrides?.features) {
    for (const [key, value] of Object.entries(overrides.features)) {
      if (key === "waiter_access" && typeof value === "boolean") {
        features.waiter_access = value;
      }
    }
  }
  if (overrides?.limits) {
    for (const [key, value] of Object.entries(overrides.limits)) {
      if ((key === "waiters" || key === "tables") && (typeof value === "number" || value === null)) {
        limits[key] = value;
      }
    }
  }

  return { features, limits };
}

export function hasFeature(establishment: Establishment, feature: PlatformFeature): boolean {
  return resolveEntitlements(establishment).features[feature];
}

export function getLimit(establishment: Establishment, limit: PlatformLimit): number | null {
  return resolveEntitlements(establishment).limits[limit];
}

export function countActiveWaiters(store: { users: Record<string, User> }, establishmentId: string): number {
  return Object.values(store.users).filter(
    (user) => user.establishmentId === establishmentId && user.role === "WAITER" && user.active,
  ).length;
}

export function canCreateWaiter(
  establishment: Establishment,
  store: { users: Record<string, User> },
): { ok: true } | { ok: false; error: string } {
  if (!hasFeature(establishment, "waiter_access")) {
    return { ok: false, error: "Plano atual não inclui acesso de garçons." };
  }
  const limit = getLimit(establishment, "waiters");
  if (limit === null) return { ok: true };
  const used = countActiveWaiters(store, establishment.id);
  if (used >= limit) {
    return { ok: false, error: `Limite de garçons atingido (${used}/${limit}).` };
  }
  return { ok: true };
}

export function entitlementSummary(establishment: Establishment, waiterCount: number) {
  const ent = resolveEntitlements(establishment);
  return {
    plan: resolvePlan(establishment.plan),
    waiterAccess: ent.features.waiter_access,
    waitersLimit: ent.limits.waiters,
    waitersUsed: waiterCount,
    tablesLimit: ent.limits.tables,
  };
}
