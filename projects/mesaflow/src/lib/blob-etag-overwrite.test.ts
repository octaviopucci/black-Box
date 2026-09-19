import assert from "node:assert/strict";
import type { MesaFlowOperationalStore } from "./types";

const BLOB_TOKEN = "vercel_blob_rw_test_etag_overwrite";

process.env.BLOB_READ_WRITE_TOKEN = BLOB_TOKEN;
process.env.VERCEL = "1";

function jsonStream(value: unknown): ReadableStream<Uint8Array> {
  const text = JSON.stringify(value);
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

async function run() {
  const {
    OPERATIONAL_BLOB_PATH,
    flushToBlob,
    splitStore,
    setBlobIoTestHooks,
    clearBlobPersistenceTestHooks,
  } = await import("./blob-persistence");
  const { mergeOperationalFromDiskForTests } = await import("./store");

  const establishmentId = "est_etag_overwrite";
  const baseOperational: MesaFlowOperationalStore = {
    establishments: {
      [establishmentId]: {
        id: establishmentId,
        businessName: "Bar Overwrite",
        platformStatus: "pending",
        plan: "essencial",
        planStartedAt: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        operationMode: "table_service",
      },
    },
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
  };

  let remoteOperational = structuredClone(baseOperational);
  let remoteEtag = "etag-v1";
  let ifMatchPutAttempts = 0;
  let unconditionalPutUsed = false;

  setBlobIoTestHooks({
    get: async (pathname) => {
      if (pathname !== OPERATIONAL_BLOB_PATH) return null;
      return {
        stream: jsonStream(remoteOperational),
        blob: { etag: remoteEtag, pathname, url: "https://example.test/blob" },
      } as Awaited<ReturnType<typeof import("@vercel/blob").get>>;
    },
    put: async (pathname, body, options) => {
      assert.equal(pathname, OPERATIONAL_BLOB_PATH);

      if (options?.ifMatch) {
        ifMatchPutAttempts += 1;
        remoteEtag = `etag-v${ifMatchPutAttempts + 1}`;
        throw new Error("Vercel Blob: Precondition failed: ETag mismatch.");
      }

      unconditionalPutUsed = true;
      remoteOperational = JSON.parse(String(body)) as MesaFlowOperationalStore;
      remoteEtag = "etag-final";
      return {
        etag: remoteEtag,
        pathname,
        url: "https://example.test/blob",
      } as Awaited<ReturnType<typeof import("@vercel/blob").put>>;
    },
  });

  const localOperational: MesaFlowOperationalStore = {
    ...structuredClone(baseOperational),
    establishments: {
      [establishmentId]: {
        ...baseOperational.establishments[establishmentId],
        platformStatus: "active",
      },
    },
    auditEvents: {
      audit_approve: {
        id: "audit_approve",
        establishmentId,
        type: "platform.merchant_status",
        actorType: "PLATFORM",
        actorUserId: "plat_test",
        targetType: "establishment",
        targetId: establishmentId,
        metadata: { status: "active" },
        createdAt: "2026-01-02T12:00:00.000Z",
      },
    },
  };

  const localStore = {
    ...localOperational,
    users: {},
    sessions: {},
    platformUsers: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {},
  };

  const remoteStore = {
    ...remoteOperational,
    users: {},
    sessions: {},
    platformUsers: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {},
  };

  const mergeOperational = (remote: MesaFlowOperationalStore, local: MesaFlowOperationalStore) => {
    const merged = mergeOperationalFromDiskForTests(
      { ...remoteStore, ...remote },
      { ...localStore, ...local },
    );
    return splitStore(merged.store).operational;
  };

  const result = await flushToBlob({
    store: { ...localStore, ...localOperational },
    etags: { operational: "etag-v1" },
    flushOperational: true,
    flushIdentity: false,
    mergeOperational,
    allowUnconditionalOverwrite: true,
  });

  assert.ok(ifMatchPutAttempts >= 1, "must attempt If-Match puts before fallback");
  assert.equal(unconditionalPutUsed, true, "must fall back to PUT without If-Match");
  assert.equal(result.operational?.ok, true, "approve path must succeed despite persistent ETag mismatch");
  assert.equal(result.operational?.unconditionalOverwrite, true);
  assert.equal(
    remoteOperational.establishments[establishmentId].platformStatus,
    "active",
    "merged approval must land in blob",
  );

  clearBlobPersistenceTestHooks();
  console.log("blob-etag-overwrite.test.ts — all assertions passed");
}

run()
  .then(async () => {
    const { clearBlobPersistenceTestHooks } = await import("./blob-persistence");
    clearBlobPersistenceTestHooks();
  })
  .catch(async (error) => {
    const { clearBlobPersistenceTestHooks } = await import("./blob-persistence");
    clearBlobPersistenceTestHooks();
    console.error(error);
    process.exit(1);
  });
