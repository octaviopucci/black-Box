import { resolvePlan } from "./platform-plans";
import type { Establishment, PlatformPlan, Product, Sector, User, UserRole } from "./types";

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

export const PLATFORM_LIMITS = [
  "waiters",
  "tables",
  "staff_users",
  "establishments",
  "kds_sectors",
  "products",
] as const;

export type PlatformLimit = (typeof PLATFORM_LIMITS)[number];

/** Limites inclusos no plano (antes de add-ons). */
export type PlanLimitsIncluded = Record<PlatformLimit, number | null>;

export interface PlanAddonPrices {
  table: number | null;
  waiter: number | null;
}

export interface PlanEntitlements {
  features: Record<PlatformFeature, boolean>;
  /** Inclusos no plano (+ override manual de `limits`). */
  included: PlanLimitsIncluded;
  /** Teto efetivo para enforcement (= included + addon em waiters/tables). */
  limits: PlanLimitsIncluded;
  addons: { waiters: number; tables: number };
  addonPrices: PlanAddonPrices;
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

const BASE_INCLUDED: Record<PlatformPlan, PlanLimitsIncluded> = {
  essencial: {
    waiters: 1,
    tables: 10,
    staff_users: 3,
    establishments: 1,
    kds_sectors: 3,
    products: 150,
  },
  premium: {
    waiters: 10,
    tables: 35,
    staff_users: 15,
    establishments: 1,
    kds_sectors: 8,
    products: 500,
  },
  custom: {
    waiters: null,
    tables: null,
    staff_users: null,
    establishments: null,
    kds_sectors: null,
    products: null,
  },
};

const ADDON_PRICES_ANNUAL: Record<PlatformPlan, PlanAddonPrices> = {
  essencial: { table: 70, waiter: 50 },
  premium: { table: 50, waiter: 30 },
  custom: { table: null, waiter: null },
};

const BASE_FEATURES: Record<PlatformPlan, PlanEntitlements["features"]> = {
  essencial: {
    ...CORE_FEATURES,
    waiter_access: true,
    advanced_reports: false,
    integrations: false,
    multi_unit: false,
  },
  premium: {
    ...CORE_FEATURES,
    waiter_access: true,
    advanced_reports: true,
    integrations: true,
    multi_unit: false,
  },
  custom: {
    ...CORE_FEATURES,
    waiter_access: true,
    advanced_reports: true,
    integrations: true,
    multi_unit: true,
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
  kds_sectors: "Setores KDS",
  products: "Produtos no cardápio",
};

function isPlatformFeature(key: string): key is PlatformFeature {
  return (PLATFORM_FEATURES as readonly string[]).includes(key);
}

function isPlatformLimit(key: string): key is PlatformLimit {
  return (PLATFORM_LIMITS as readonly string[]).includes(key);
}

export function resolvePlanAddons(establishment: Establishment): { waiters: number; tables: number } {
  const plan = resolvePlan(establishment.plan);
  if (plan === "custom") return { waiters: 0, tables: 0 };
  const overrides = establishment.planOverrides;
  const waiters = Math.max(
    0,
    overrides?.addonWaiters ?? overrides?.addons?.waiters ?? 0,
  );
  const tables = Math.max(
    0,
    overrides?.addonTables ?? overrides?.addons?.tables ?? 0,
  );
  return { waiters, tables };
}

function effectiveLimit(included: number | null, addon: number): number | null {
  if (included === null) return null;
  return included + addon;
}

export function resolveEntitlements(establishment: Establishment): PlanEntitlements {
  const plan = resolvePlan(establishment.plan);
  const overrides = establishment.planOverrides;

  const features = { ...BASE_FEATURES[plan] };
  const included: PlanLimitsIncluded = { ...BASE_INCLUDED[plan] };

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
        included[key] = value;
      }
    }
  }

  const addons = resolvePlanAddons(establishment);
  const limits: PlanLimitsIncluded = { ...included };
  limits.waiters = effectiveLimit(included.waiters, addons.waiters);
  limits.tables = effectiveLimit(included.tables, addons.tables);

  return {
    features,
    included,
    limits,
    addons,
    addonPrices: ADDON_PRICES_ANNUAL[plan],
  };
}

export function hasFeature(establishment: Establishment, feature: PlatformFeature): boolean {
  return resolveEntitlements(establishment).features[feature];
}

/** Retorna o teto efetivo (inclusos + add-ons quando aplicável). */
export function getLimit(establishment: Establishment, limit: PlatformLimit): number | null {
  return resolveEntitlements(establishment).limits[limit];
}

export function getIncludedLimit(establishment: Establishment, limit: PlatformLimit): number | null {
  return resolveEntitlements(establishment).included[limit];
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

export function countTables(
  store: { tables: Record<string, { establishmentId: string }> },
  establishmentId: string,
): number {
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

export function countKdsSectors(
  store: { sectors: Record<string, Sector> },
  establishmentId: string,
): number {
  return Object.values(store.sectors).filter(
    (sector) => sector.establishmentId === establishmentId && sector.active,
  ).length;
}

export function countProducts(
  store: { products: Record<string, Product> },
  establishmentId: string,
): number {
  return Object.values(store.products).filter(
    (product) => product.establishmentId === establishmentId,
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

export function canCreateProduct(
  establishment: Establishment,
  store: { products: Record<string, Product> },
): { ok: true } | { ok: false; error: string } {
  const limit = getLimit(establishment, "products");
  if (limit === null) return { ok: true };
  const used = countProducts(store, establishment.id);
  if (used >= limit) {
    return { ok: false, error: limitReachedMessage("products", used, limit) };
  }
  return { ok: true };
}

export function canCreateKdsSector(
  establishment: Establishment,
  store: { sectors: Record<string, Sector> },
): { ok: true } | { ok: false; error: string } {
  const limit = getLimit(establishment, "kds_sectors");
  if (limit === null) return { ok: true };
  const used = countKdsSectors(store, establishment.id);
  if (used >= limit) {
    return { ok: false, error: limitReachedMessage("kds_sectors", used, limit) };
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
  /** Teto efetivo (inclusos + add-ons). */
  limits: PlanLimitsIncluded;
  included: PlanLimitsIncluded;
  addons: { waiters: number; tables: number };
  addonPrices: PlanAddonPrices;
  usage: {
    waiters: number;
    tables: number;
    staffUsers: number;
    kdsSectors: number;
    products: number;
  };
  /** Campos legados — mantidos para compatibilidade */
  waiterAccess: boolean;
  waitersLimit: number | null;
  waitersUsed: number;
  waitersIncluded: number | null;
  waitersAddon: number;
  tablesLimit: number | null;
  tablesUsed: number;
  tablesIncluded: number | null;
  tablesAddon: number;
  staffUsersLimit: number | null;
  staffUsersUsed: number;
}

export function entitlementSummary(
  establishment: Establishment,
  store: {
    users: Record<string, User>;
    tables: Record<string, { establishmentId: string }>;
    sectors?: Record<string, Sector>;
    products?: Record<string, Product>;
  },
): EntitlementSummary {
  const ent = resolveEntitlements(establishment);
  const waitersUsed = countActiveWaiters(store, establishment.id);
  const tablesUsed = countTables(store, establishment.id);
  const staffUsersUsed = countStaffUsers(store, establishment.id);
  const kdsSectorsUsed = store.sectors
    ? countKdsSectors({ sectors: store.sectors }, establishment.id)
    : 0;
  const productsUsed = store.products
    ? countProducts({ products: store.products }, establishment.id)
    : 0;

  return {
    plan: resolvePlan(establishment.plan),
    features: ent.features,
    limits: ent.limits,
    included: ent.included,
    addons: ent.addons,
    addonPrices: ent.addonPrices,
    usage: {
      waiters: waitersUsed,
      tables: tablesUsed,
      staffUsers: staffUsersUsed,
      kdsSectors: kdsSectorsUsed,
      products: productsUsed,
    },
    waiterAccess: ent.features.waiter_access,
    waitersLimit: ent.limits.waiters,
    waitersUsed,
    waitersIncluded: ent.included.waiters,
    waitersAddon: ent.addons.waiters,
    tablesLimit: ent.limits.tables,
    tablesUsed,
    tablesIncluded: ent.included.tables,
    tablesAddon: ent.addons.tables,
    staffUsersLimit: ent.limits.staff_users,
    staffUsersUsed,
  };
}
