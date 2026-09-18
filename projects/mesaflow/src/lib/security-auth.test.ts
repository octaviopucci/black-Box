import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-security-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-for-security-tests";

async function run() {
  const { getStore, findTableByQr } = await import("./store");
  const { joinGuestAtTable, publicParticipation } = await import("./guest");
  const { resolveGuestTableContext } = await import("./guest-table-context");
  const { publicOtpBypassHint, otpBypassCode } = await import("./otp-bypass");
  const { issueAdminSessionToken } = await import("./admin-session-token");
  const { resolveSecret } = await import("./production-secrets");
  const { validatePasswordStrength } = await import("./password-policy");
  const { validateSignupInvite, signupOpenWithoutInvite } = await import("./signup-invite");
  const { rejectPredictableDemoQrInProduction } = await import("./demo-qr");
  const { buildPublicHealthResponse } = await import("./public-health");

  const store = getStore();
  const establishment = Object.values(store.establishments)[0];
  assert.ok(establishment, "demo establishment required");

  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishment.id);
  assert.ok(tables.length >= 2, "need at least two tables for cross-table IDOR test");

  const tableA = tables[0];
  const tableB = tables[1];

  const guestA = joinGuestAtTable({
    establishment,
    table: tableA,
    phoneE164: "+5511988111111",
    displayName: "Guest A",
  });
  assert.ok(!("error" in guestA));

  const crossTable = resolveGuestTableContext(
    establishment.slug,
    tableB.qrToken,
    guestA.token,
  );
  assert.equal(crossTable.ok, false);
  if (!crossTable.ok) {
    assert.equal(crossTable.status, 403);
    assert.match(crossTable.error, /mesa/i);
  }

  const ownTable = resolveGuestTableContext(
    establishment.slug,
    tableA.qrToken,
    guestA.token,
  );
  assert.equal(ownTable.ok, true);
  if (ownTable.ok) {
    assert.equal(ownTable.data.hasSession, true);
    const participants = ownTable.data.participants as Array<Record<string, unknown>>;
    assert.ok(Array.isArray(participants));
    for (const p of participants) {
      assert.equal("phoneDisplay" in p, false, "co-participants must not see phoneDisplay");
    }
  }

  const gp = store.guestParticipations[guestA.participation.id];
  const pub = publicParticipation(gp);
  assert.equal("phoneDisplay" in pub, false);
  const self = publicParticipation(gp, { includePhone: true });
  assert.ok(self.phoneDisplay);

  assert.ok(validatePasswordStrength("SenhaFraca1") === null);
  assert.ok(validatePasswordStrength("curta1A") !== null);

  assert.equal(signupOpenWithoutInvite(), true, "dev signup open");

  const prodEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  process.env.NODE_ENV = "production";
  process.env.VERCEL_ENV = "production";
  delete process.env.MESAFLOW_SIGNUP_OPEN;
  delete process.env.MESAFLOW_SIGNUP_INVITE_CODE;
  try {
    const runtimeSecret = resolveSecret(["MESAFLOW_NONEXISTENT_TEST_SECRET"], "test");
    assert.ok(
      typeof runtimeSecret === "string" && runtimeSecret.length >= 16,
      "resolveSecret must return runtime secret in prod instead of throwing",
    );
    assert.equal(otpBypassCode(), null, "default OTP bypass must be off in production");
    const hint = publicOtpBypassHint();
    assert.equal(hint.active, false);
    assert.ok(!("code" in hint), "production must not expose bypass code in API");
    assert.equal(validateSignupInvite("wrong"), false);
    process.env.MESAFLOW_SIGNUP_INVITE_CODE = "convite-secreto";
    assert.equal(validateSignupInvite("convite-secreto"), true);
    assert.equal(rejectPredictableDemoQrInProduction("mesa-4"), true);
    assert.equal(findTableByQr(establishment.id, "mesa-4"), null);
  } finally {
    if (prodEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prodEnv;
    if (vercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = vercelEnv;
    delete process.env.MESAFLOW_SIGNUP_INVITE_CODE;
  }

  const publicHealth = buildPublicHealthResponse({ sharedOk: true, blobOk: true, establishmentCount: 1 });
  assert.equal(publicHealth.service, "mesaflow");
  assert.equal("storage" in publicHealth, false);

  const owner = Object.values(store.users).find((u) => u.establishmentId === establishment.id);
  assert.ok(owner);
  const adminToken = issueAdminSessionToken(owner.id, establishment.id);
  const { requireDashboardForEstablishment } = await import("../app/api/admin/_shared");

  const authorized = requireDashboardForEstablishment(
    new Request("http://local/api/events", {
      headers: { Authorization: `Bearer ${adminToken}` },
    }),
    establishment.id,
  );
  assert.ok(authorized, "staff token must authorize SSE for own establishment");

  const foreignEst = Object.values(store.establishments).find((e) => e.id !== establishment.id);
  if (foreignEst) {
    const foreign = requireDashboardForEstablishment(
      new Request("http://local/api/events", {
        headers: { Authorization: `Bearer ${adminToken}` },
      }),
      foreignEst.id,
    );
    assert.equal(foreign, null, "staff must not subscribe to another tenant SSE");
  }

  const unauth = requireDashboardForEstablishment(
    new Request("http://local/api/events"),
    establishment.id,
  );
  assert.equal(unauth, null, "SSE requires authentication");

  console.log("security-auth.test.ts — all assertions passed");
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
