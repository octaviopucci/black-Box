/** Dev-only fallback — must never be used in production. */
export const DEV_FALLBACK_SECRET = "mesaflow-dev-only-change-in-production";

export function isProductionEnv(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

/**
 * Resolves a cryptographic secret from env. In production, throws if none is configured
 * (fail-closed instead of using the public dev fallback).
 */
export function resolveSecret(envNames: readonly string[], purpose: string): string {
  for (const name of envNames) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  if (isProductionEnv()) {
    throw new Error(
      `[Mesaflow] Secret ausente em produção (${purpose}). Configure: ${envNames.join(" ou ")} ou MESAFLOW_IDENTITY_SECRET.`,
    );
  }
  return DEV_FALLBACK_SECRET;
}
