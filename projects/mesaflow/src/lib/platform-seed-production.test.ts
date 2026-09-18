import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-platform-seed-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.VERCEL = "1";
process.env.VERCEL_ENV = "production";
process.env.NODE_ENV = "production";
delete process.env.MESAFLOW_PLATFORM_OWNER_EMAIL;
delete process.env.MESAFLOW_PLATFORM_OWNER_PASSWORD;
delete process.env.MESAFLOW_ALLOW_DEMO_SEED;
delete process.env.MESAFLOW_IDENTITY_SECRET;
delete process.env.MESAFLOW_PLATFORM_SESSION_SECRET;
delete process.env.MESAFLOW_ADMIN_SESSION_SECRET;

async function run() {
  const { getStore, loginUser } = await import("./store");
  const { ensureProductionSeed, needsProductionSeed } = await import("./production-seed");
  const { loginPlatformUser, findPlatformUserByEmail } = await import("./platform-store");
  const { PLATFORM_OWNER_LOGIN, DEMO_LOGIN } = await import("./demo");
  const { verifyPassword } = await import("./crypto-utils");
  const { resolveSecret } = await import("./production-secrets");

  const coldStore = getStore();
  assert.equal(
    Object.keys(coldStore.establishments).length,
    1,
    "load() must seed demo merchant in production without MESAFLOW_ALLOW_DEMO_SEED",
  );
  assert.equal(
    Object.keys(coldStore.platformUsers).length,
    1,
    "load() must seed platform owner in production without MESAFLOW_ALLOW_DEMO_SEED",
  );

  const runtimeSecret = resolveSecret(["MESAFLOW_NONEXISTENT_TEST_SECRET"], "auth-test");
  assert.ok(typeof runtimeSecret === "string" && runtimeSecret.length >= 16, "resolveSecret must not throw in prod");

  const store = getStore();
  store.platformUsers = {};
  store.establishments = {};
  store.users = {};
  store.sectors = {};
  store.categories = {};
  store.products = {};
  store.tables = {};

  assert.ok(needsProductionSeed(store), "empty store must need production seed");

  const seeded = ensureProductionSeed();
  assert.ok(seeded, "production seed must run on empty store");

  const after = getStore();
  assert.equal(Object.keys(after.platformUsers).length, 1, "platform owner must exist");
  assert.equal(Object.keys(after.establishments).length, 1, "demo establishment must exist");
  assert.ok(Object.keys(after.users).length >= 1, "demo merchant users must exist");

  const owner = findPlatformUserByEmail(PLATFORM_OWNER_LOGIN.email);
  assert.ok(owner?.active, "seeded owner must be findable by email");
  assert.ok(
    verifyPassword(PLATFORM_OWNER_LOGIN.password, owner!.passwordHash),
    "seeded platform password must match demo defaults",
  );

  const platformLogin = loginPlatformUser(PLATFORM_OWNER_LOGIN.email, PLATFORM_OWNER_LOGIN.password);
  assert.ok(!("error" in platformLogin), platformLogin.error ?? "platform login must succeed");
  assert.ok(platformLogin.token, "platform login must return session token without MESAFLOW_IDENTITY_SECRET");

  const adminLogin = loginUser(DEMO_LOGIN.email, DEMO_LOGIN.password);
  assert.ok(!("error" in adminLogin), adminLogin.error ?? "admin demo login must succeed");
  assert.ok(adminLogin.session?.token, "admin login must return session token");

  const badPlatform = loginPlatformUser(PLATFORM_OWNER_LOGIN.email, "wrong-password");
  assert.ok("error" in badPlatform, "bad platform password must fail");
  assert.equal(badPlatform.error, "E-mail ou senha inválidos.");

  console.log("✓ platform seed production: empty store → platform + admin login OK (no env secrets)");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
