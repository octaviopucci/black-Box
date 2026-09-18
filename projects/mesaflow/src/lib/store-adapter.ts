import type { MesaFlowStore } from "./types";

/**
 * Future transactional backend (Postgres/Drizzle). Current JSON store implements
 * this interface implicitly via store.ts — migration path in ADR-001.
 */
export interface MesaFlowStoreAdapter {
  hydrate(): Promise<MesaFlowStore>;
  flush(store: MesaFlowStore): Promise<void>;
  withTransaction<T>(establishmentId: string, fn: (store: MesaFlowStore) => Promise<T>): Promise<T>;
}

/** Stub — throws until DB migration lands. */
export class JsonStoreAdapter implements MesaFlowStoreAdapter {
  async hydrate(): Promise<MesaFlowStore> {
    const { getStore } = await import("./store");
    return getStore();
  }

  async flush(store: MesaFlowStore): Promise<void> {
    const { saveStore, flushPersistentStore } = await import("./store");
    saveStore(store);
    await flushPersistentStore();
  }

  async withTransaction<T>(
    _establishmentId: string,
    fn: (store: MesaFlowStore) => Promise<T>,
  ): Promise<T> {
    const store = await this.hydrate();
    return fn(store);
  }
}

export const jsonStoreAdapter = new JsonStoreAdapter();
