import assert from "node:assert/strict";

process.env.VERCEL = "1";

async function run() {
  const store = await import("./store");
  const blobPersistence = await import("./blob-persistence");

  store.resetPersistedStoreCacheForTests();
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token";

  const coldStart = store.persistStatus();
  assert.equal(coldStart.blobConfigured, true);
  assert.equal(coldStart.warning, undefined, "blob configured + no error → no banner on cold start");

  store.resetPersistedStoreCacheForTests();
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BLOB_STORE_ID;
  delete process.env.UPSTASH_REDIS_REST_URL;

  const unconfigured = store.persistStatus();
  assert.ok(unconfigured.warning?.includes("compartilhados"), "missing blob/redis → setup warning");

  store.resetPersistedStoreCacheForTests();
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test_token";

  const originalFlush = blobPersistence.flushToBlob;
  (blobPersistence as { flushToBlob: typeof originalFlush }).flushToBlob = async () => {
    throw new Error("This store has been suspended");
  };

  try {
    const cache = store.getStore();
    cache.establishments.est_test = {
      id: "est_test",
      slug: "test",
      name: "Test",
      open: true,
      rodizioEnabled: false,
      settings: {
        currency: "BRL",
        allowEditAfterPrep: false,
        soundNotifications: true,
        minIntervalRodizioSec: 120,
      },
      createdAt: new Date().toISOString(),
    };
    store.saveStore(cache);
    await store.flushPersistentStore();
    const failed = store.persistStatus();
    assert.equal(failed.blobConfigured, true);
    assert.ok(failed.warning?.includes("Falha ao persistir"), "configured blob + persist error → operational warning");
    assert.ok(!failed.warning?.includes("Conecte Upstash"), "must not suggest setup when blob is configured");
  } finally {
    (blobPersistence as { flushToBlob: typeof originalFlush }).flushToBlob = originalFlush;
  }

  console.log("✓ persist-status: banner only when unconfigured or persist failed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
