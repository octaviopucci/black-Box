import type { PersistResult } from "./store";

export type PublicHealthPayload = {
  ok: true;
  service: "mesaflow";
  shared: boolean;
  blob: boolean;
  establishments: number;
};

export function buildPublicHealthResponse(input: {
  sharedOk: boolean;
  blobOk: boolean;
  establishmentCount: number;
}): PublicHealthPayload {
  return {
    ok: true,
    service: "mesaflow",
    shared: input.sharedOk,
    blob: input.blobOk,
    establishments: input.establishmentCount,
  };
}

export function healthDiagnosticsAuthorized(req: {
  headers: { get(name: string): string | null };
  url?: string;
}): boolean {
  const secret = process.env.MESAFLOW_HEALTH_SECRET?.trim();
  if (!secret) return false;
  const provided =
    req.headers.get("x-mesaflow-health-secret")?.trim() ||
    (req.url ? new URL(req.url).searchParams.get("health_secret")?.trim() : undefined);
  return Boolean(provided && provided === secret);
}

export type DetailedHealthPayload = PublicHealthPayload & {
  storage?: Record<string, unknown>;
  setup?: string;
};

export function buildDetailedHealthResponse(input: {
  sharedOk: boolean;
  blobOk: boolean;
  establishmentCount: number;
  storage: Record<string, unknown>;
  setup?: string;
  persist?: PersistResult;
}): DetailedHealthPayload {
  return {
    ...buildPublicHealthResponse({
      sharedOk: input.sharedOk,
      blobOk: input.blobOk,
      establishmentCount: input.establishmentCount,
    }),
    storage: { ...input.storage, persist: input.persist },
    setup: input.setup,
  };
}
