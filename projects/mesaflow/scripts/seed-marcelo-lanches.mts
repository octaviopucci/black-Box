#!/usr/bin/env npx tsx
/**
 * Importa cardápio completo Marcelo Lanches no store MesaFlow.
 *
 * Uso:
 *   npx tsx scripts/seed-marcelo-lanches.mts [--create] [--dry-run]
 *
 * Blob (produção NA MESA):
 *   BLOB_READ_WRITE_TOKEN ou MESAFLOW_BLOB_READ_WRITE_TOKEN
 *   BLOB_STORE_ID ou MESAFLOW_BLOB_STORE_ID
 *
 * Local:
 *   MESAFLOW_DATA=./data/store.json npx tsx scripts/seed-marcelo-lanches.mts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { get, put } from "@vercel/blob";
import { applyMarceloLanchesCatalog } from "../src/lib/seed-marcelo-lanches";
import type { MesaFlowStore } from "../src/lib/types";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const createIfMissing = process.argv.includes("--create");
const dryRun = process.argv.includes("--dry-run");

const LEGACY = "mesaflow/store.json";
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

function blobAuth() {
  const tok = token();
  return tok ? { token: tok } : { storeId: storeId()! };
}

async function readBlob(pathname: string) {
  const result = await get(pathname, blobAuth());
  if (!result) return null;
  const res = await fetch(result.url);
  if (!res.ok) throw new Error(`fetch ${pathname}: ${res.status}`);
  return res.json();
}

async function loadStore(): Promise<MesaFlowStore> {
  if (token() || storeId()) {
    const [legacy, operational, identity] = await Promise.all([
      readBlob(LEGACY),
      readBlob(OPERATIONAL),
      readBlob(IDENTITY),
    ]);
    if (legacy) return legacy as MesaFlowStore;
    if (operational || identity) {
      return { ...(operational || {}), ...(identity || {}) } as MesaFlowStore;
    }
  }
  const dataPath = process.env.MESAFLOW_DATA || join(root, "data", "store.json");
  if (!existsSync(dataPath)) {
    return {
      establishments: {},
      sectors: {},
      categories: {},
      products: {},
      tables: {},
      commands: {},
      orders: {},
      guestParticipations: {},
      rodizios: {},
      rodizioRounds: {},
      notifications: {},
      closingRequests: {},
      orderItemSplits: {},
      payments: {},
      integrationConnections: {},
      auditEvents: {},
      orderCounter: {},
      users: {},
      sessions: {},
      platformUsers: {},
      clientSessions: {},
      otpChallenges: {},
      guestPhoneSecrets: {},
      revokedGuestTokenHashes: {},
    };
  }
  return JSON.parse(readFileSync(dataPath, "utf8")) as MesaFlowStore;
}

function splitStore(store: MesaFlowStore) {
  const operationalKeys = [
    "establishments", "sectors", "categories", "products", "tables", "commands",
    "orders", "guestParticipations", "rodizios", "rodizioRounds", "notifications",
    "closingRequests", "orderItemSplits", "payments", "integrationConnections",
    "auditEvents", "orderCounter",
  ] as const;
  const identityKeys = [
    "users", "sessions", "platformUsers", "clientSessions", "otpChallenges",
    "guestPhoneSecrets", "revokedGuestTokenHashes",
  ] as const;
  const operational: Record<string, unknown> = {};
  const identity: Record<string, unknown> = {};
  for (const key of operationalKeys) operational[key] = store[key] ?? {};
  for (const key of identityKeys) identity[key] = store[key] ?? {};
  return { operational, identity };
}

async function saveStore(store: MesaFlowStore) {
  const dataPath = process.env.MESAFLOW_DATA || join(root, "data", "store.json");
  mkdirSync(dirname(dataPath), { recursive: true });
  writeFileSync(dataPath, JSON.stringify(store, null, 2));

  if (token() || storeId()) {
    const auth = blobAuth();
    const { operational, identity } = splitStore(store);
    await put(OPERATIONAL, JSON.stringify(operational), { access: "private", ...auth });
    await put(IDENTITY, JSON.stringify(identity), { access: "private", ...auth });
  }
}

async function main() {
  const store = await loadStore();
  const result = applyMarceloLanchesCatalog(store, { createIfMissing });

  if (!result.ok) {
    console.error(`✗ ${result.error}`);
    process.exit(1);
  }

  console.log(
    `→ Marcelo Lanches (${result.slug}): ${result.categories} categorias, ${result.products} produtos${result.created ? " [estabelecimento criado]" : ""}`,
  );

  if (dryRun) {
    console.log("[dry-run] Nenhuma alteração persistida.");
    return;
  }

  await saveStore(store);
  console.log("✓ Cardápio importado e persistido.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
