/** Código fixo até Evolution API estar ativa. Remover quando MESAFLOW_EVOLUTION_* estiver configurado. */
export const DEFAULT_OTP_BYPASS_CODE = "010203";

export function evolutionOtpConfigured(): boolean {
  return Boolean(
    process.env.MESAFLOW_EVOLUTION_URL?.trim() &&
      process.env.MESAFLOW_EVOLUTION_API_KEY?.trim() &&
      process.env.MESAFLOW_EVOLUTION_INSTANCE?.trim(),
  );
}

export function otpBypassCode(): string | null {
  if (evolutionOtpConfigured()) return null;
  const configured = process.env.MESAFLOW_OTP_BYPASS_CODE?.trim();
  if (configured === "0" || configured === "off") return null;
  return configured || DEFAULT_OTP_BYPASS_CODE;
}

export function isOtpBypassCode(code: string): boolean {
  const bypass = otpBypassCode();
  if (!bypass) return false;
  return code.trim() === bypass;
}
