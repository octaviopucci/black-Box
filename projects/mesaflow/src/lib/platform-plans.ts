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

/** Mesas inclusas no plano (antes de add-ons). Metadata comercial — gates usam platform-entitlements. */
export const PLAN_TABLE_LIMIT: Record<PlatformPlan, number | null> = {
  essencial: 10,
  premium: 35,
  custom: null,
};

export function resolvePlan(plan: PlatformPlan | undefined): PlatformPlan {
  return plan ?? "essencial";
}

export function planAnnualRevenue(plan: PlatformPlan | undefined): number {
  return PLAN_ANNUAL_PRICE[resolvePlan(plan)];
}

export const PLAN_OPTIONS: { value: PlatformPlan; label: string; description: string }[] = [
  {
    value: "essencial",
    label: PLAN_LABELS.essencial,
    description: "Até 10 mesas · ideal para começar",
  },
  {
    value: "premium",
    label: PLAN_LABELS.premium,
    description: "Até 35 mesas · 10 garçons · recursos avançados",
  },
  {
    value: "custom",
    label: PLAN_LABELS.custom,
    description: "Operação sob medida · suporte dedicado",
  },
];

export function parsePlatformPlan(value: unknown): PlatformPlan | null {
  if (value === "essencial" || value === "premium" || value === "custom") return value;
  return null;
}
