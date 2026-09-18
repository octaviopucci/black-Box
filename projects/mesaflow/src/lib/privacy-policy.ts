import type { PrivacyConsent } from "./types";

/** Bump when policy content changes materially. */
export const PRIVACY_POLICY_VERSION = "2026-09-18";

export const PRIVACY_POLICY_PATH = "/privacidade";

export type { PrivacyConsent };

export function validatePrivacyConsent(input: unknown): PrivacyConsent | null {
  if (!input || typeof input !== "object") return null;
  const body = input as { acceptedAt?: unknown; policyVersion?: unknown; accepted?: unknown };
  if (body.accepted === false) return null;
  if (typeof body.acceptedAt !== "string" || !body.acceptedAt.trim()) return null;
  if (body.policyVersion !== PRIVACY_POLICY_VERSION) return null;
  const acceptedAt = new Date(body.acceptedAt);
  if (Number.isNaN(acceptedAt.getTime())) return null;
  return { acceptedAt: acceptedAt.toISOString(), policyVersion: PRIVACY_POLICY_VERSION };
}

export function consentRequiredMessage(): string {
  return "É necessário aceitar a Política de Privacidade antes de continuar.";
}
