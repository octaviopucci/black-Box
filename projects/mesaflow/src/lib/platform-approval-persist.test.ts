import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-approval-persist-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "1";

async function run() {
  const {
    registerEstablishment,
    hydratePersistentStore,
    getStore,
    validateActiveSession,
    validateSession,
    loginUser,
    publicEstablishment,
    mergeOperationalFromDiskForTests,
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

  const approved = updateMerchantStatus(establishmentId, "active");
  assert.ok("value" in approved);
  assert.equal(approved.value.platformStatus, "active");

  const sameSession = validateSession(pendingToken);
  assert.ok(sameSession, "session token stays valid after approval");
  assert.equal(publicEstablishment(sameSession!.establishment).platformStatus, "active");

  const approvedOnDisk = readFileSync(process.env.MESAFLOW_DATA!, "utf8");
  assert.ok(approvedOnDisk.includes('"platformStatus": "active"'));

  await hydratePersistentStore();
  assert.equal(getStore().establishments[establishmentId].platformStatus, "active");

  const session = loginUser("joao.approval.persist@example.com", "SenhaTeste1");
  assert.ok(session.session, session.error);
  assert.ok(validateActiveSession(session.session!.token), "approved merchant can use admin API");

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

  console.log("platform-approval-persist.test.ts — all assertions passed");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
