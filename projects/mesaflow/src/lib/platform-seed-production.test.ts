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
process.env.MESAFLOW_IDENTITY_SECRET = "test-platform-seed-secret";

async function run() {
  const { getStore } = await import("./store");
  const { ensurePlatformOwnerSeed, findPlatformUserByEmail } = await import("./platform-store");
  const { PLATFORM_OWNER_LOGIN } = await import("./demo");
  const { verifyPassword } = await import("./crypto-utils");

  const store = getStore();
  store.platformUsers = {};
  store.establishments = {};
  store.users = {};

  const seeded = ensurePlatformOwnerSeed();
  assert.ok(seeded, "platform owner must seed on empty store without Blob");
  assert.equal(Object.keys(getStore().platformUsers).length, 1);

  const owner = findPlatformUserByEmail(PLATFORM_OWNER_LOGIN.email);
  assert.ok(owner?.active, "seeded owner must be findable by email");
  assert.ok(
    verifyPassword(PLATFORM_OWNER_LOGIN.password, owner!.passwordHash),
    "seeded password must match demo defaults",
  );

  console.log("✓ platform seed production: empty store seeds owner from demo defaults");
}

run()
  .then(() => rmSync(tempDir, { recursive: true, force: true }))
  .catch((error) => {
    rmSync(tempDir, { recursive: true, force: true });
    console.error(error);
    process.exit(1);
  });
