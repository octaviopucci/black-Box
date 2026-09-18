import type { PlatformPlan } from "./types";

/** Preços anuais acordados (HANDOFF). */
export const PLAN_ANNUAL_PRICE: Record<PlatformPlan, number> = {
  essencial: 997,
  premium: 1997,
  custom: 2997,
};

export const PLAN_LABELS: Record<PlatformPlan, string> = {
  essencial: "Essencial",
  premium: "Premium",
  custom: "Custom",
};

export const PLAN_TABLE_LIMIT: Record<PlatformPlan, number | null> = {
  essencial: 10,
  premium: null,
  custom: null,
};

export function resolvePlan(plan: PlatformPlan | undefined): PlatformPlan {
  return plan ?? "essencial";
}

export function planAnnualRevenue(plan: PlatformPlan | undefined): number {
  return PLAN_ANNUAL_PRICE[resolvePlan(plan)];
}
