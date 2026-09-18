import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-platform-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");

async function run() {
  const { loginUser, registerEstablishment, getStore } = await import("./store");
  const {
    loginPlatformUser,
    validatePlatformSession,
    listMerchants,
    getMerchantDetail,
    platformDashboard,
    updateMerchantStatus,
  } = await import("./platform-store");
  const { parsePlatformSessionToken } = await import("./platform-session-token");
  const { parseAdminSessionToken } = await import("./admin-session-token");
  const { PLATFORM_OWNER_LOGIN, DEMO_LOGIN } = await import("./demo");

  const store = getStore();
  assert.ok(store.platformUsers && Object.keys(store.platformUsers).length > 0, "platform owner seeded");

  const platformLogin = loginPlatformUser(PLATFORM_OWNER_LOGIN.email, PLATFORM_OWNER_LOGIN.password);
  assert.ok("token" in platformLogin, platformLogin.error);
  const platformAuth = validatePlatformSession(platformLogin.token);
  assert.ok(platformAuth?.user.role === "PLATFORM_OWNER");

  const adminLogin = loginUser(DEMO_LOGIN.email, DEMO_LOGIN.password);
  assert.ok(adminLogin.session, adminLogin.error);
  assert.equal(parsePlatformSessionToken(adminLogin.session!.token), null, "merchant token must not parse as platform");
  assert.ok(parseAdminSessionToken(adminLogin.session!.token), "merchant token parses as admin");

  const merchants = listMerchants();
  assert.ok(merchants.length >= 1, "demo merchant listed");
  const demo = merchants.find((m) => m.slug === "ponto-do-sabor");
  assert.ok(demo, "demo merchant found");
  assert.equal(demo!.plan, "premium");

  const detail = getMerchantDetail(demo!.id);
  assert.ok(detail?.tables.length > 0, "merchant detail includes tables");
  assert.ok(detail!.analytics30d, "merchant detail includes analytics");

  const dashboard = platformDashboard("30d");
  assert.ok(dashboard.totals.merchants >= 1);
  assert.ok(dashboard.totals.arrEstimate > 0);

  const { PRIVACY_POLICY_VERSION } = await import("./privacy-policy");
  const signup = registerEstablishment({
    businessName: "Lanchonete Teste Platform",
    ownerName: "Maria Teste",
    email: "maria.platform.test@example.com",
    password: "senha123",
    businessType: "lanchonete",
    tableCount: 5,
    privacyConsent: {
      acceptedAt: new Date().toISOString(),
      policyVersion: PRIVACY_POLICY_VERSION,
    },
  });
  assert.ok(signup.session, signup.error);
  const newMerchants = listMerchants({ q: "maria.platform.test" });
  assert.equal(newMerchants.length, 1);
  assert.equal(newMerchants[0].plan, "essencial");
  assert.equal(newMerchants[0].platformStatus, "active");

  const suspended = updateMerchantStatus(newMerchants[0].id, "suspended", "teste");
  assert.ok("value" in suspended);
  assert.equal(suspended.value.platformStatus, "suspended");

  const blocked = loginUser("maria.platform.test@example.com", "senha123");
  assert.ok(blocked.error, "suspended merchant cannot login");

  const reactivated = updateMerchantStatus(newMerchants[0].id, "active");
  assert.ok("value" in reactivated);
  const allowed = loginUser("maria.platform.test@example.com", "senha123");
  assert.ok(allowed.session, allowed.error);

  console.log("platform.test.ts — all assertions passed");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
