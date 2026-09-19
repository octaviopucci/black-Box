import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { MesaFlowIdentityStore, MesaFlowOperationalStore } from "./types";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-category-persist-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "1";
process.env.BLOB_STORE_ID = "store_test_category";

async function run() {
  const {
    splitStore,
    mergeStore,
    setBlobPersistenceTestHooks,
    clearBlobPersistenceTestHooks,
  } = await import("./blob-persistence");

  let simulatedBlobOperational: MesaFlowOperationalStore | null = null;
  let simulatedBlobIdentity: MesaFlowIdentityStore | null = null;

  setBlobPersistenceTestHooks({
    flushToBlob: async (input) => {
      const { operational, identity } = splitStore(input.store);
      const result: Awaited<ReturnType<typeof import("./blob-persistence").flushToBlob>> = {};
      if (input.flushOperational) {
        simulatedBlobOperational = operational;
        simulatedBlobIdentity = identity;
        result.operational = { ok: true, etag: "simulated-etag" };
      }
      if (input.flushIdentity) {
        simulatedBlobIdentity = identity;
        result.identity = { ok: true, etag: "simulated-identity-etag" };
      }
      return result;
    },
    hydrateFromBlob: async () => {
      if (!simulatedBlobOperational && !simulatedBlobIdentity) return null;
      return {
        store: mergeStore(simulatedBlobOperational || {}, simulatedBlobIdentity || {}),
        etags: { operational: "simulated-etag", identity: "simulated-identity-etag" },
        migratedFromLegacy: false,
      };
    },
  });

  const {
    getStore,
    hydratePersistentStore,
    resetPersistedStoreCacheForTests,
    createAdminCategoryPersisted,
    listAdminCategories,
  } = await import("./store");

  const store = getStore();
  const establishment = Object.values(store.establishments)[0];
  assert.ok(establishment, "demo establishment must exist");

  const created = await createAdminCategoryPersisted(establishment.id, {
    name: "Categoria Persistida",
    emoji: "🍕",
  });
  assert.ok("value" in created, "error" in created ? created.error : "missing category");
  assert.equal(created.value.name, "Categoria Persistida");

  resetPersistedStoreCacheForTests();
  await hydratePersistentStore();

  const reloaded = getStore();
  const categories = listAdminCategories(establishment.id);
  assert.ok(
    reloaded.categories[created.value.id],
    "category must exist in store after hydrate",
  );
  assert.ok(
    categories.some((category) => category.id === created.value.id),
    "category must appear in admin list after hydrate",
  );

  clearBlobPersistenceTestHooks();
  resetPersistedStoreCacheForTests();

  setBlobPersistenceTestHooks({
    flushToBlob: async () => ({
      operational: { ok: false, error: "This store has been suspended" },
    }),
    hydrateFromBlob: async () => null,
  });

  const beforeCount = Object.keys(getStore().categories).length;
  const failed = await createAdminCategoryPersisted(establishment.id, { name: "Não Deve Gravar" });
  assert.ok("error" in failed, "blob failure must surface as mutation error");
  assert.equal(failed.status, 503);
  assert.equal(
    Object.keys(getStore().categories).length,
    beforeCount,
    "failed create must roll back in-memory category",
  );

  clearBlobPersistenceTestHooks();
  console.log("✓ category create persists through hydrate and surfaces blob failures");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
