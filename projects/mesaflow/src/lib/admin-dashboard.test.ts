import assert from "node:assert/strict";

async function run() {
  process.env.VERCEL = "";
  const { buildAdminDashboardPayload, parseAdminDashboardPeriod } = await import("./admin-dashboard");
  const { getStore, loginUser } = await import("./store");
  const { DEMO_LOGIN } = await import("./demo");

  assert.equal(parseAdminDashboardPeriod("7d"), "7d");
  assert.equal(parseAdminDashboardPeriod(null), "today");

  const login = loginUser(DEMO_LOGIN.email, DEMO_LOGIN.password);
  assert.ok(login.session, login.error);
  assert.ok(login.establishment, "establishment from demo login");
  const establishment = login.establishment!;

  const payload = buildAdminDashboardPayload(establishment, "today");
  assert.ok(payload.analytics, "analytics required for Visão geral UI");
  assert.ok(payload.analyticsWeek, "analyticsWeek required");
  assert.ok(payload.analyticsMonth, "analyticsMonth required");
  assert.ok(Array.isArray(payload.notifications), "notifications array");
  assert.equal(typeof payload.stats.revenue, "number");
  assert.ok(getStore().establishments[establishment.id], "store has establishment");

  console.log("admin-dashboard.test.ts OK");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
