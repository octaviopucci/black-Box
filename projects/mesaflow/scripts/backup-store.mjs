#!/usr/bin/env node
/**
 * Backup do store MesaFlow (Blob ou arquivo local).
 *
 * Uso:
 *   node scripts/backup-store.mjs [--out backups/mesaflow-2026-09-18.json]
 *
 * Env (Blob — produção):
 *   BLOB_READ_WRITE_TOKEN ou MESAFLOW_BLOB_READ_WRITE_TOKEN
 *   BLOB_STORE_ID ou MESAFLOW_BLOB_STORE_ID
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { get, list } from "@vercel/blob";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outArg = process.argv.find((a) => a.startsWith("--out="))?.slice(6)
  || process.argv[process.argv.indexOf("--out") + 1];
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outPath = outArg || join(root, "backups", `mesaflow-${stamp}.json`);

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

async function readBlob(pathname) {
  const auth = token() ? { token: token() } : { storeId: storeId() };
  const result = await get(pathname, auth);
  if (!result) return null;
  const res = await fetch(result.url);
  if (!res.ok) throw new Error(`fetch ${pathname}: ${res.status}`);
  return res.json();
}

async function backupFromBlob() {
  const auth = token() ? { token: token() } : { storeId: storeId() };
  await list({ prefix: "mesaflow/", ...auth });
  const [legacy, operational, identity] = await Promise.all([
    readBlob(LEGACY),
    readBlob(OPERATIONAL),
    readBlob(IDENTITY),
  ]);
  if (legacy) return { source: "blob-legacy", store: legacy };
  if (operational || identity) {
    return {
      source: "blob-split",
      store: { ...(operational || {}), ...(identity || {}) },
      operational,
      identity,
    };
  }
  throw new Error("Nenhum blob mesaflow/* encontrado.");
}

async function backupFromDisk() {
  const dataPath = process.env.MESAFLOW_DATA || join(root, "data", "store.json");
  const { readFileSync, existsSync } = await import("node:fs");
  if (!existsSync(dataPath)) throw new Error(`Arquivo não encontrado: ${dataPath}`);
  return { source: "disk", store: JSON.parse(readFileSync(dataPath, "utf8")) };
}

async function main() {
  mkdirSync(dirname(outPath), { recursive: true });
  let payload;
  if (token() || storeId()) {
    try {
      payload = await backupFromBlob();
    } catch (error) {
      console.warn("[backup] Blob falhou, tentando disco:", error.message);
      payload = await backupFromDisk();
    }
  } else {
    payload = await backupFromDisk();
  }
  payload.backedUpAt = new Date().toISOString();
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`✓ Backup salvo em ${outPath} (${payload.source})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
