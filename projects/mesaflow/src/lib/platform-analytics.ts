import { dashboardAnalytics, type DashboardPeriod } from "@/lib/dashboard-analytics";
import { entitlementSummary } from "@/lib/platform-entitlements";
import { planAnnualRevenue, resolvePlan } from "@/lib/platform-plans";
import { getStore } from "@/lib/store";
import { resolvePlatformStatus } from "@/lib/platform-status";
import type { Establishment, PlatformPlan, PlatformStatus, User } from "@/lib/types";

const MS_DAY = 24 * 60 * 60 * 1000;
const INACTIVE_DAYS_THRESHOLD = 14;

export type MerchantListFilters = {
  q?: string;
  status?: PlatformStatus | "all";
  plan?: PlatformPlan | "all";
};

function establishmentOwner(establishmentId: string): User | undefined {
  const store = getStore();
  return Object.values(store.users).find(
    (user) => user.establishmentId === establishmentId && user.role === "OWNER",
  );
}

function lastActivityAt(establishmentId: string): string | null {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return null;

  let latest = establishment.createdAt;

  for (const order of Object.values(store.orders)) {
    if (order.establishmentId !== establishmentId) continue;
    if (order.updatedAt > latest) latest = order.updatedAt;
  }

  for (const gp of Object.values(store.guestParticipations)) {
    if (gp.establishmentId !== establishmentId) continue;
    const candidate = gp.lastOrderAt || gp.joinedAt;
    if (candidate > latest) latest = candidate;
  }

  for (const user of Object.values(store.users)) {
    if (user.establishmentId !== establishmentId || !user.lastLoginAt) continue;
    if (user.lastLoginAt > latest) latest = user.lastLoginAt;
  }

  return latest;
}

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / MS_DAY);
}

export function merchantSummary(establishment: Establishment) {
  const store = getStore();
  const owner = establishmentOwner(establishment.id);
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id);
  const orders = Object.values(store.orders).filter((o) => o.establishmentId === establishment.id);
  const sessions = Object.values(store.guestParticipations).filter(
    (gp) => gp.establishmentId === establishment.id,
  );
  const activity = lastActivityAt(establishment.id);
  const inactiveDays = daysSince(activity);
  const plan = resolvePlan(establishment.plan);
  const status = resolvePlatformStatus(establishment);
  const analytics30d = dashboardAnalytics(establishment.id, "30d");

  return {
    id: establishment.id,
    slug: establishment.slug,
    name: establishment.name,
    businessType: establishment.businessType,
    operationMode: establishment.operationMode,
    plan,
    planStartedAt: establishment.planStartedAt ?? establishment.createdAt,
    platformStatus: status,
    suspendedAt: establishment.suspendedAt,
    suspendedReason: establishment.suspendedReason,
    createdAt: establishment.createdAt,
    open: establishment.open,
    owner: owner
      ? {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          lastLoginAt: owner.lastLoginAt,
        }
      : null,
    tablesCount: tables.length,
    ordersTotal: orders.filter((o) => o.status !== "CANCELADO").length,
    sessionsTotal: sessions.length,
    activeSessions: sessions.filter((gp) => gp.status !== "CLOSED").length,
    lastActivityAt: activity,
    inactiveDays,
    isDormant: inactiveDays !== null && inactiveDays >= INACTIVE_DAYS_THRESHOLD,
    revenue30d: analytics30d.sales.revenue,
    orders30d: analytics30d.sales.ordersCount,
    paymentsCollected30d: analytics30d.sales.paymentsCollected,
    adminUrl: `/admin`,
    customerUrl: `/m/${establishment.slug}`,
  };
}

export function listMerchants(filters: MerchantListFilters = {}) {
  const store = getStore();
  const q = filters.q?.trim().toLowerCase();
  let merchants = Object.values(store.establishments).map(merchantSummary);

  if (q) {
    merchants = merchants.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q) ||
        m.owner?.email.toLowerCase().includes(q) ||
        m.owner?.name.toLowerCase().includes(q),
    );
  }

  if (filters.status && filters.status !== "all") {
    merchants = merchants.filter((m) => m.platformStatus === filters.status);
  }

  if (filters.plan && filters.plan !== "all") {
    merchants = merchants.filter((m) => m.plan === filters.plan);
  }

  merchants.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return merchants;
}

export function getMerchantDetail(establishmentId: string) {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return null;

  const summary = merchantSummary(establishment);
  const tables = Object.values(store.tables)
    .filter((t) => t.establishmentId === establishmentId)
    .map((t) => ({
      id: t.id,
      number: t.number,
      name: t.name,
      status: t.status,
      capacity: t.capacity,
    }));

  const staff = Object.values(store.users)
    .filter((u) => u.establishmentId === establishmentId)
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
      lastLoginAt: u.lastLoginAt,
    }));

  return {
    ...summary,
    tables,
    staff,
    planOverrides: establishment.planOverrides,
    entitlements: entitlementSummary(establishment, store),
    analyticsToday: dashboardAnalytics(establishmentId, "today"),
    analytics7d: dashboardAnalytics(establishmentId, "7d"),
    analytics30d: dashboardAnalytics(establishmentId, "30d"),
    annualPlanValue: planAnnualRevenue(establishment.plan),
  };
}

function periodStartIso(days: number): string {
  return new Date(Date.now() - days * MS_DAY).toISOString();
}

export function platformDashboard(period: DashboardPeriod = "30d") {
  const store = getStore();
  const merchants = listMerchants();
  const periodDays = period === "today" ? 1 : period === "7d" ? 7 : 30;
  const periodStart = periodStartIso(periodDays);

  const active = merchants.filter((m) => m.platformStatus === "active").length;
  const inactive = merchants.filter((m) => m.platformStatus === "inactive").length;
  const suspended = merchants.filter((m) => m.platformStatus === "suspended").length;
  const dormant = merchants.filter((m) => m.isDormant && m.platformStatus === "active").length;
  const newInPeriod = merchants.filter((m) => m.createdAt >= periodStart).length;

  const byPlan: Record<PlatformPlan, number> = { essencial: 0, premium: 0, custom: 0 };
  for (const m of merchants) byPlan[m.plan] += 1;

  let totalOrdersPeriod = 0;
  let totalRevenuePeriod = 0;
  let totalSessionsPeriod = 0;
  let totalTables = 0;

  for (const m of merchants) {
    totalTables += m.tablesCount;
    const analytics = dashboardAnalytics(m.id, period);
    totalOrdersPeriod += analytics.sales.ordersCount;
    totalRevenuePeriod += analytics.sales.revenue;
    totalSessionsPeriod += analytics.sessions.historical + analytics.sessions.active;
  }

  const arrEstimate = merchants
    .filter((m) => m.platformStatus === "active")
    .reduce((sum, m) => sum + planAnnualRevenue(m.plan), 0);

  const recentSignups = merchants
    .filter((m) => m.createdAt >= periodStart)
    .slice(0, 10)
    .map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      plan: m.plan,
      createdAt: m.createdAt,
      ownerEmail: m.owner?.email,
    }));

  const dormantMerchants = merchants
    .filter((m) => m.isDormant)
    .sort((a, b) => (b.inactiveDays ?? 0) - (a.inactiveDays ?? 0))
    .slice(0, 10);

  return {
    period,
    totals: {
      merchants: merchants.length,
      active,
      inactive,
      suspended,
      dormant,
      newInPeriod,
      totalTables,
      totalOrdersPeriod,
      totalRevenuePeriod,
      totalSessionsPeriod,
      arrEstimate,
    },
    byPlan,
    recentSignups,
    dormantMerchants,
    topMerchantsByRevenue: merchants
      .slice()
      .sort((a, b) => b.revenue30d - a.revenue30d)
      .slice(0, 5)
      .map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        revenue30d: m.revenue30d,
        plan: m.plan,
      })),
  };
}
