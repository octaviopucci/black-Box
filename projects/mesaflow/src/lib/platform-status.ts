import type { Establishment, PlatformStatus } from "./types";

export function resolvePlatformStatus(establishment: Establishment): PlatformStatus {
  return establishment.platformStatus ?? "active";
}

/** Lojista pode operar o painel admin (pedidos, KDS, configurações). */
export function isMerchantAdminOperational(status: PlatformStatus): boolean {
  return status === "active";
}

/** Login permitido — pending entra só na tela de espera; demais bloqueados conforme status. */
export function isMerchantLoginAllowed(status: PlatformStatus): boolean {
  return status === "active" || status === "pending";
}

export function merchantLoginBlockedMessage(status: PlatformStatus): string {
  switch (status) {
    case "pending":
      return "Cadastro aguardando aprovação da plataforma NA MESA.";
    case "rejected":
      return "Cadastro não aprovado. Entre em contato com o suporte NA MESA.";
    case "suspended":
      return "Conta suspensa pela operação NA MESA. Entre em contato com o suporte.";
    case "inactive":
      return "Conta inativa. Entre em contato com o suporte NA MESA.";
    default:
      return "Acesso indisponível. Entre em contato com o suporte NA MESA.";
  }
}

export function adminHomePath(establishment: Establishment): string {
  const status = resolvePlatformStatus(establishment);
  if (status === "pending") return "/admin/pending";
  return "/admin";
}

export const PLATFORM_STATUS_LABELS: Record<PlatformStatus, string> = {
  pending: "Aguardando aprovação",
  active: "Ativo",
  inactive: "Inativo",
  suspended: "Suspenso",
  rejected: "Rejeitado",
};

export function parsePlatformStatusInput(value: unknown): PlatformStatus | null {
  if (
    value === "pending" ||
    value === "active" ||
    value === "inactive" ||
    value === "suspended" ||
    value === "rejected"
  ) {
    return value;
  }
  return null;
}

export function parsePlatformStatusFilterInput(value: string | undefined | null): PlatformStatus | "all" {
  const parsed = parsePlatformStatusInput(value ?? undefined);
  return parsed ?? "all";
}
