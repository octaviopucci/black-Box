import { id } from "./crypto-utils";
import type { AuditEvent, MesaFlowStore } from "./types";

const PII_KEYS = new Set([
  "phone",
  "phoneE164",
  "phoneDisplay",
  "phoneCiphertext",
  "email",
  "password",
  "token",
  "name",
]);

function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!metadata) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (PII_KEYS.has(key)) continue;
    if (typeof value === "string" && value.includes("@")) continue;
    out[key] = value;
  }
  return out;
}

export function appendAuditEvent(
  store: MesaFlowStore,
  input: Omit<AuditEvent, "id" | "createdAt" | "metadata"> & {
    metadata?: Record<string, unknown>;
  },
): AuditEvent {
  store.auditEvents ||= {};
  const event: AuditEvent = {
    id: id("aud_"),
    createdAt: new Date().toISOString(),
    ...input,
    metadata: sanitizeMetadata(input.metadata),
  };
  store.auditEvents[event.id] = event;
  return event;
}
