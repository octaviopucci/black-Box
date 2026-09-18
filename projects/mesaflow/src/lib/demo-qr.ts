import { isProductionEnv } from "./production-secrets";

/** QR tokens previsíveis do seed demo (`mesa-1`, `mesa-2`, …). */
export function isPredictableDemoQrToken(token: string): boolean {
  return /^mesa-\d+$/i.test(token.trim());
}

/** Em produção, rejeita QRs previsíveis salvo seed demo explícito. */
export function rejectPredictableDemoQrInProduction(token: string): boolean {
  if (!isProductionEnv()) return false;
  if (process.env.MESAFLOW_ALLOW_DEMO_SEED === "1") return false;
  return isPredictableDemoQrToken(token);
}
