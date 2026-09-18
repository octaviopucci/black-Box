import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-security-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-for-security-tests";

async function run() {
  const { getStore } = await import("./store");
  const { joinGuestAtTable } = await import("./guest");
  const { resolveGuestTableContext } = await import("./guest-table-context");
  const { publicOtpBypassHint, otpBypassCode } = await import("./otp-bypass");
  const { issueAdminSessionToken } = await import("./admin-session-token");
  const { resolveSecret } = await import("./production-secrets");

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
    assert.ok(Array.isArray(ownTable.data.participants));
  }

  const noSession = resolveGuestTableContext(establishment.slug, tableB.qrToken, null);
  assert.equal(noSession.ok, true);

  const prodEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  process.env.NODE_ENV = "production";
  process.env.VERCEL_ENV = "production";
  try {
    assert.throws(
      () => resolveSecret(["MESAFLOW_NONEXISTENT_TEST_SECRET"], "test"),
      /Secret ausente em produção/,
    );
    assert.equal(otpBypassCode(), null, "default OTP bypass must be off in production");
    const hint = publicOtpBypassHint();
    assert.equal(hint.active, false);
    assert.ok(!("code" in hint), "production must not expose bypass code in API");
  } finally {
    if (prodEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prodEnv;
    if (vercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = vercelEnv;
  }

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
