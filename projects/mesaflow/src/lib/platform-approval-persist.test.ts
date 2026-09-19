import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { MesaFlowIdentityStore, MesaFlowOperationalStore } from "./types";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-approval-persist-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "1";
process.env.BLOB_STORE_ID = "store_test_approval";

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
    registerEstablishment,
    hydratePersistentStore,
    getStore,
    validateActiveSession,
    validateSession,
    loginUser,
    publicEstablishment,
    mergeOperationalFromDiskForTests,
    resetPersistedStoreCacheForTests,
  } = await import("./store");
  const { updateMerchantStatus } = await import("./platform-store");
  const { appendAuditEvent } = await import("./audit-log");
  const { PRIVACY_POLICY_VERSION } = await import("./privacy-policy");

  const signup = registerEstablishment({
    businessName: "Bar Aprovação Persist",
    ownerName: "João Persist",
    email: "joao.approval.persist@example.com",
    password: "SenhaTeste1",
    businessType: "bar",
    tableCount: 4,
    plan: "essencial",
    privacyConsent: {
      acceptedAt: new Date().toISOString(),
      policyVersion: PRIVACY_POLICY_VERSION,
    },
  });
  assert.ok(signup.session, signup.error);
  assert.equal(signup.establishment!.platformStatus, "pending");

  const establishmentId = signup.establishment!.id;
  const pendingToken = signup.session!.token;
  assert.equal(validateSession(pendingToken)?.establishment.platformStatus, "pending");

  const approved = await updateMerchantStatus(establishmentId, "active");
  assert.ok("value" in approved, approved.error);
  assert.equal(approved.value.platformStatus, "active");
  assert.ok(simulatedBlobOperational, "approval must flush operational blob before 200");
  assert.equal(
    simulatedBlobOperational!.establishments[establishmentId].platformStatus,
    "active",
  );

  const sameSession = validateSession(pendingToken);
  assert.ok(sameSession, "session token stays valid after approval");
  assert.equal(publicEstablishment(sameSession!.establishment).platformStatus, "active");

  const approvedOnDisk = readFileSync(process.env.MESAFLOW_DATA!, "utf8");
  assert.ok(approvedOnDisk.includes('"platformStatus": "active"'));

  resetPersistedStoreCacheForTests();
  await hydratePersistentStore();
  assert.equal(
    getStore().establishments[establishmentId].platformStatus,
    "active",
    "fresh instance must hydrate active status from shared blob",
  );

  const session = loginUser("joao.approval.persist@example.com", "SenhaTeste1");
  assert.ok(session.session, session.error);
  assert.ok(
    validateActiveSession(session.session!.token),
    "approved merchant can use admin API after cross-instance hydrate",
  );

  const diskStore = getStore();
  const remoteStore = structuredClone(diskStore);
  remoteStore.establishments[establishmentId] = {
    ...remoteStore.establishments[establishmentId],
    platformStatus: "pending",
  };
  delete remoteStore.auditEvents;

  const merged = mergeOperationalFromDiskForTests(remoteStore, diskStore);
  assert.equal(merged.mergedAhead, true);
  assert.equal(merged.store.establishments[establishmentId].platformStatus, "active");

  const store = getStore();
  appendAuditEvent(store, {
    establishmentId,
    type: "platform.merchant_status",
    actorType: "PLATFORM",
    targetType: "establishment",
    targetId: establishmentId,
    metadata: { status: "active" },
  });
  const diskWithAudit = structuredClone(store);
  const remoteOlder = structuredClone(store);
  remoteOlder.establishments[establishmentId].platformStatus = "pending";
  remoteOlder.auditEvents = {};

  const mergedWithAudit = mergeOperationalFromDiskForTests(remoteOlder, diskWithAudit);
  assert.equal(mergedWithAudit.store.establishments[establishmentId].platformStatus, "active");

  setBlobPersistenceTestHooks({
    flushToBlob: async () => ({
      operational: { ok: false, error: "This store has been suspended" },
    }),
  });

  resetPersistedStoreCacheForTests();
  simulatedBlobOperational = null;
  simulatedBlobIdentity = null;
  await hydratePersistentStore();

  const signup2 = registerEstablishment({
    businessName: "Bar Blob Fail",
    ownerName: "Ana Fail",
    email: "ana.blob.fail@example.com",
    password: "SenhaTeste1",
    businessType: "bar",
    tableCount: 2,
    plan: "essencial",
    privacyConsent: {
      acceptedAt: new Date().toISOString(),
      policyVersion: PRIVACY_POLICY_VERSION,
    },
  });
  assert.ok(signup2.session, signup2.error);
  const failId = signup2.establishment!.id;

  const failed = await updateMerchantStatus(failId, "active");
  assert.ok("error" in failed, "blob failure must not return 200 for approval");
  assert.equal(failed.status, 503);
  assert.equal(getStore().establishments[failId].platformStatus, "pending");

  clearBlobPersistenceTestHooks();
  console.log("platform-approval-persist.test.ts — all assertions passed");
}

run()
  .then(async () => {
    const { clearBlobPersistenceTestHooks: clear } = await import("./blob-persistence");
    clear();
    rmSync(tempDir, { recursive: true, force: true });
  })
  .catch(async (error) => {
    const { clearBlobPersistenceTestHooks: clear } = await import("./blob-persistence");
    clear();
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
