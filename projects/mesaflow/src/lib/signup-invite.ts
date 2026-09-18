import { timingSafeEqual } from "crypto";
import { isProductionEnv } from "./production-secrets";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Em dev signup aberto; em prod fechado salvo MESAFLOW_SIGNUP_OPEN=1 ou invite válido. */
export function signupOpenWithoutInvite(): boolean {
  if (!isProductionEnv()) return true;
  return process.env.MESAFLOW_SIGNUP_OPEN === "1";
}

export function signupRequiresInvite(): boolean {
  return !signupOpenWithoutInvite();
}

export function validateSignupInvite(code: string | undefined | null): boolean {
  if (signupOpenWithoutInvite()) return true;
  const expected = process.env.MESAFLOW_SIGNUP_INVITE_CODE?.trim();
  if (!expected) return false;
  const provided = String(code ?? "").trim();
  if (!provided) return false;
  return safeEqual(provided, expected);
}

export function signupInviteRequiredMessage(): string {
  return "Cadastro disponível somente por convite. Solicite um código à equipe NA MESA.";
}
