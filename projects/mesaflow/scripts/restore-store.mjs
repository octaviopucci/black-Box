#!/usr/bin/env node
/**
 * Restore do store MesaFlow para Blob ou arquivo local (somente dev/staging).
 *
 * Uso:
 *   node scripts/restore-store.mjs --file backups/mesaflow-2026-09-18.json [--dry-run]
 *
 * PRODUÇÃO: exige MESAFLOW_RESTORE_CONFIRM=1 e confirmação interativa omitida aqui —
 * use apenas após validar backup em ambiente de teste.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fileArg = process.argv.find((a) => a.startsWith("--file="))?.slice(7)
  || process.argv[process.argv.indexOf("--file") + 1];
const dryRun = process.argv.includes("--dry-run");

if (!fileArg) {
  console.error("Uso: node scripts/restore-store.mjs --file <backup.json> [--dry-run]");
  process.exit(1);
}

const OPERATIONAL = "mesaflow/operational.json";
const IDENTITY = "mesaflow/identity.json";

function token() {
  return (
    process.env.MESAFLOW_BLOB_READ_WRITE_TOKEN?.trim()
    || process.env.BLOB_READ_WRITE_TOKEN?.trim()
  );
}

function storeId() {
  return process.env.MESAFLOW_BLOB_STORE_ID?.trim() || process.env.BLOB_STORE_ID?.trim();
}

function splitStore(store) {
  const operationalKeys = [
    "establishments", "sectors", "categories", "products", "tables", "commands",
    "orders", "guestParticipations", "rodizios", "rodizioRounds", "notifications",
    "closingRequests", "orderItemSplits", "payments", "integrationConnections",
    "auditEvents", "orderCounter",
  ];
  const identityKeys = [
    "users", "sessions", "platformUsers", "clientSessions", "otpChallenges",
    "guestPhoneSecrets", "revokedGuestTokenHashes",
  ];
  const operational = {};
  const identity = {};
  for (const key of operationalKeys) operational[key] = store[key] ?? {};
  for (const key of identityKeys) identity[key] = store[key] ?? {};
  return { operational, identity };
}

async function main() {
  if (process.env.VERCEL_ENV === "production" && process.env.MESAFLOW_RESTORE_CONFIRM !== "1") {
    throw new Error("Restore em produção bloqueado. Defina MESAFLOW_RESTORE_CONFIRM=1 após teste.");
  }

  const raw = JSON.parse(readFileSync(fileArg, "utf8"));
  const store = raw.store || raw;
  if (dryRun) {
    console.log(`[dry-run] Restauraria store com ${Object.keys(store.establishments || {}).length} estabelecimentos`);
    return;
  }

  const tok = token();
  const sid = storeId();
  if (tok || sid) {
    const auth = tok ? { token: tok } : { storeId: sid };
    const { operational, identity } = splitStore(store);
    await put(OPERATIONAL, JSON.stringify(operational), { access: "private", ...auth });
    await put(IDENTITY, JSON.stringify(identity), { access: "private", ...auth });
    console.log(`✓ Restore Blob: ${OPERATIONAL}, ${IDENTITY}`);
  }

  const dataPath = process.env.MESAFLOW_DATA || join(root, "data", "store.json");
  mkdirSync(dirname(dataPath), { recursive: true });
  writeFileSync(dataPath, JSON.stringify(store, null, 2));
  console.log(`✓ Restore disco: ${dataPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
