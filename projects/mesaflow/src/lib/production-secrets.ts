import { createHash, randomBytes } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

/** Dev-only fallback — must never be used in production. */
export const DEV_FALLBACK_SECRET = "mesaflow-dev-only-change-in-production";

export function isProductionEnv(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

const warnedPurposes = new Set<string>();

function stableProductionFallback(purpose: string): string {
  return createHash("sha256")
    .update("mesaflow-prod-runtime-v1:")
    .update(purpose)
    .update(process.env.VERCEL_PROJECT_ID || process.env.VERCEL_URL || "mesaflow")
    .digest("base64url");
}

function runtimeSecretPath(purpose: string): string {
  const slug = purpose.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 64);
  const base = process.env.VERCEL ? "/tmp" : join(process.cwd(), "data");
  return join(base, `mesaflow-runtime-secret-${slug}.txt`);
}

function loadOrCreateRuntimeSecret(purpose: string): string {
  const path = runtimeSecretPath(purpose);
  try {
    mkdirSync(dirname(path), { recursive: true });
    if (existsSync(path)) {
      const existing = readFileSync(path, "utf8").trim();
      if (existing) return existing;
    }
    const generated = randomBytes(32).toString("base64url");
    writeFileSync(path, generated, { encoding: "utf8", mode: 0o600 });
    return generated;
  } catch {
    return stableProductionFallback(purpose);
  }
}

/**
 * Resolves a cryptographic secret from env. In production, never throws — uses a
 * persisted /tmp runtime secret (or stable fallback) so auth routes return 200/401.
 */
export function resolveSecret(envNames: readonly string[], purpose: string): string {
  for (const name of envNames) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  if (isProductionEnv()) {
    if (!warnedPurposes.has(purpose)) {
      warnedPurposes.add(purpose);
      console.warn(
        `[Mesaflow] Secret ausente em produção (${purpose}). Usando secret runtime. Configure: ${envNames.join(" ou ")} ou MESAFLOW_IDENTITY_SECRET.`,
      );
    }
    return loadOrCreateRuntimeSecret(purpose);
  }

  return DEV_FALLBACK_SECRET;
}
