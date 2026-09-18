import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-persist-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "1";
process.env.BLOB_STORE_ID = "store_test_suspended";

async function run() {
  const blobPersistence = await import("./blob-persistence");
  const originalFlush = blobPersistence.flushToBlob;

  (blobPersistence as { flushToBlob: typeof originalFlush }).flushToBlob = async () => {
    throw new Error("This store has been suspended");
  };

  try {
    const { getStore, createAdminTable, flushPersistentStore } = await import("./store");
    const store = getStore();
    const establishment = Object.values(store.establishments)[0];
    assert.ok(establishment, "demo establishment must exist");

    const tableResult = createAdminTable(establishment.id, { number: "77", capacity: 2 });
    assert.ok("value" in tableResult, "error" in tableResult ? tableResult.error : "missing value");

    let flush;
    let threw = false;
    try {
      flush = await flushPersistentStore();
    } catch {
      threw = true;
    }
    assert.equal(threw, false, "flushPersistentStore must not throw when blob fails");
    assert.ok(flush, "flush result expected");
    assert.equal(flush!.disk, true, "disk cache must remain after blob failure");
    assert.equal(flush!.blob, false, "blob must report failure");
    assert.ok(flush!.blobError, "blob error must be surfaced without throwing");

    const reloaded = getStore();
    assert.ok(reloaded.tables[tableResult.value.id], "mutation must survive in memory/disk cache");
  } finally {
    (blobPersistence as { flushToBlob: typeof originalFlush }).flushToBlob = originalFlush;
  }

  console.log("✓ persist soft-fail: blob errors never throw, disk cache kept");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
