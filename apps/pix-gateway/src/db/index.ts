import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type Db = DatabaseSync

export function openDatabase(databasePath: string): Db {
  mkdirSync(dirname(databasePath), { recursive: true })
  const db = new DatabaseSync(databasePath)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA foreign_keys = ON;')
  migrate(db)
  return db
}

function migrate(db: Db): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      credentials_json TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pix_keys (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      key_type TEXT NOT NULL,
      key_value TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS charges (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id),
      pix_key_id TEXT REFERENCES pix_keys(id),
      provider TEXT NOT NULL,
      provider_charge_id TEXT,
      txid TEXT NOT NULL UNIQUE,
      amount_cents INTEGER NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      copy_paste TEXT,
      qr_code_base64 TEXT,
      expires_at TEXT,
      paid_at TEXT,
      external_ref TEXT,
      idempotency_key TEXT UNIQUE,
      raw_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_charges_status ON charges(status);
    CREATE INDEX IF NOT EXISTS idx_charges_provider_charge ON charges(provider, provider_charge_id);
    CREATE INDEX IF NOT EXISTS idx_charges_account_created ON charges(account_id, created_at);

    CREATE TABLE IF NOT EXISTS webhook_events (
      id TEXT PRIMARY KEY,
      account_id TEXT,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      provider_charge_id TEXT,
      payload_json TEXT NOT NULL,
      processed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routing_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)
}
