import { resolvePlan } from "./platform-plans";
import type { Establishment, PlatformPlan, User, UserRole } from "./types";

export const PLATFORM_FEATURES = [
  "guest_menu",
  "guest_orders",
  "guest_bill_request",
  "split_bill",
  "rodizio",
  "admin",
  "thermal_print",
  "order_alerts",
  "kds",
  "table_cockpit",
  "catalog_import",
  "product_media",
  "waiter_access",
  "advanced_reports",
  "integrations",
  "multi_unit",
] as const;

export type PlatformFeature = (typeof PLATFORM_FEATURES)[number];

export const PLATFORM_LIMITS = ["waiters", "tables", "staff_users", "establishments"] as const;

export type PlatformLimit = (typeof PLATFORM_LIMITS)[number];

export interface PlanEntitlements {
  features: Record<PlatformFeature, boolean>;
  limits: Record<PlatformLimit, number | null>;
}

const CORE_FEATURES: Record<
  Exclude<
    PlatformFeature,
    "waiter_access" | "advanced_reports" | "integrations" | "multi_unit"
  >,
  true
> = {
  guest_menu: true,
  guest_orders: true,
  guest_bill_request: true,
  split_bill: true,
  rodizio: true,
  admin: true,
  thermal_print: true,
  order_alerts: true,
  kds: true,
  table_cockpit: true,
  catalog_import: true,
  product_media: true,
};

const BASE_ENTITLEMENTS: Record<PlatformPlan, PlanEntitlements> = {
  essencial: {
    features: {
      ...CORE_FEATURES,
      waiter_access: false,
      advanced_reports: false,
      integrations: false,
      multi_unit: false,
    },
    limits: { waiters: 0, tables: 10, staff_users: 3, establishments: 1 },
  },
  premium: {
    features: {
      ...CORE_FEATURES,
      waiter_access: true,
      advanced_reports: true,
      integrations: true,
      multi_unit: false,
    },
    limits: { waiters: 5, tables: null, staff_users: 10, establishments: 1 },
  },
  custom: {
    features: {
      ...CORE_FEATURES,
      waiter_access: true,
      advanced_reports: true,
      integrations: true,
      multi_unit: true,
    },
    limits: { waiters: null, tables: null, staff_users: null, establishments: null },
  },
};

export const FEATURE_LABELS: Record<PlatformFeature, string> = {
  guest_menu: "Cardápio digital + QR",
  guest_orders: "Pedidos na mesa",
  guest_bill_request: "Pedir conta (guest)",
  split_bill: "Fechamento por pessoa",
  rodizio: "Rodízio / rodadas",
  admin: "Admin lojista",
  thermal_print: "Comanda térmica",
  order_alerts: "Alertas de pedido",
  kds: "KDS por setor",
  table_cockpit: "Cockpit de mesa",
  catalog_import: "Import cardápio",
  product_media: "Foto de produto",
  waiter_access: "Acesso garçom",
  advanced_reports: "Relatórios avançados",
  integrations: "Integrações",
  multi_unit: "Multi-unidade",
};

export const LIMIT_LABELS: Record<PlatformLimit, string> = {
  waiters: "Garçons ativos",
  tables: "Mesas",
  staff_users: "Usuários staff",
  establishments: "Estabelecimentos",
};

function isPlatformFeature(key: string): key is PlatformFeature {
  return (PLATFORM_FEATURES as readonly string[]).includes(key);
}

function isPlatformLimit(key: string): key is PlatformLimit {
  return (PLATFORM_LIMITS as readonly string[]).includes(key);
}

export function resolveEntitlements(establishment: Establishment): PlanEntitlements {
  const plan = resolvePlan(establishment.plan);
  const base = BASE_ENTITLEMENTS[plan];
  const overrides = establishment.planOverrides;

  const features = { ...base.features };
  const limits = { ...base.limits };

  if (overrides?.features) {
    for (const [key, value] of Object.entries(overrides.features)) {
      if (isPlatformFeature(key) && typeof value === "boolean") {
        features[key] = value;
      }
    }
  }
  if (overrides?.limits) {
    for (const [key, value] of Object.entries(overrides.limits)) {
      if (isPlatformLimit(key) && (typeof value === "number" || value === null)) {
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

export function featureDeniedMessage(feature: PlatformFeature): string {
  return `Plano atual não inclui ${FEATURE_LABELS[feature]}.`;
}

export function limitReachedMessage(limit: PlatformLimit, used: number, max: number): string {
  return `Limite de ${LIMIT_LABELS[limit].toLowerCase()} atingido (${used}/${max}).`;
}

const STAFF_ROLES: UserRole[] = ["OWNER", "MANAGER", "KITCHEN", "COUNTER"];

export function countActiveWaiters(store: { users: Record<string, User> }, establishmentId: string): number {
  return Object.values(store.users).filter(
    (user) => user.establishmentId === establishmentId && user.role === "WAITER" && user.active,
  ).length;
}

export function countTables(store: { tables: Record<string, { establishmentId: string }> }, establishmentId: string): number {
  return Object.values(store.tables).filter((table) => table.establishmentId === establishmentId).length;
}

export function countStaffUsers(store: { users: Record<string, User> }, establishmentId: string): number {
  return Object.values(store.users).filter(
    (user) =>
      user.establishmentId === establishmentId &&
      user.active &&
      STAFF_ROLES.includes(user.role),
  ).length;
}

export function canCreateWaiter(
  establishment: Establishment,
  store: { users: Record<string, User> },
): { ok: true } | { ok: false; error: string } {
  if (!hasFeature(establishment, "waiter_access")) {
    return { ok: false, error: featureDeniedMessage("waiter_access") };
  }
  const limit = getLimit(establishment, "waiters");
  if (limit === null) return { ok: true };
  const used = countActiveWaiters(store, establishment.id);
  if (used >= limit) {
    return { ok: false, error: limitReachedMessage("waiters", used, limit) };
  }
  return { ok: true };
}

export function canCreateTable(
  establishment: Establishment,
  store: { tables: Record<string, { establishmentId: string }> },
): { ok: true } | { ok: false; error: string } {
  const limit = getLimit(establishment, "tables");
  if (limit === null) return { ok: true };
  const used = countTables(store, establishment.id);
  if (used >= limit) {
    return { ok: false, error: limitReachedMessage("tables", used, limit) };
  }
  return { ok: true };
}

export function canCreateStaffUser(
  establishment: Establishment,
  store: { users: Record<string, User> },
): { ok: true } | { ok: false; error: string } {
  const limit = getLimit(establishment, "staff_users");
  if (limit === null) return { ok: true };
  const used = countStaffUsers(store, establishment.id);
  if (used >= limit) {
    return { ok: false, error: limitReachedMessage("staff_users", used, limit) };
  }
  return { ok: true };
}

export function requireFeature(
  establishment: Establishment,
  feature: PlatformFeature,
): { ok: true } | { ok: false; error: string } {
  if (!hasFeature(establishment, feature)) {
    return { ok: false, error: featureDeniedMessage(feature) };
  }
  return { ok: true };
}

export interface EntitlementSummary {
  plan: PlatformPlan;
  features: Record<PlatformFeature, boolean>;
  limits: Record<PlatformLimit, number | null>;
  usage: {
    waiters: number;
    tables: number;
    staffUsers: number;
  };
  /** Campos legados — mantidos para compatibilidade */
  waiterAccess: boolean;
  waitersLimit: number | null;
  waitersUsed: number;
  tablesLimit: number | null;
  tablesUsed: number;
  staffUsersLimit: number | null;
  staffUsersUsed: number;
}

export function entitlementSummary(
  establishment: Establishment,
  store: {
    users: Record<string, User>;
    tables: Record<string, { establishmentId: string }>;
  },
): EntitlementSummary {
  const ent = resolveEntitlements(establishment);
  const waitersUsed = countActiveWaiters(store, establishment.id);
  const tablesUsed = countTables(store, establishment.id);
  const staffUsersUsed = countStaffUsers(store, establishment.id);

  return {
    plan: resolvePlan(establishment.plan),
    features: ent.features,
    limits: ent.limits,
    usage: {
      waiters: waitersUsed,
      tables: tablesUsed,
      staffUsers: staffUsersUsed,
    },
    waiterAccess: ent.features.waiter_access,
    waitersLimit: ent.limits.waiters,
    waitersUsed,
    tablesLimit: ent.limits.tables,
    tablesUsed,
    staffUsersLimit: ent.limits.staff_users,
    staffUsersUsed,
  };
}
