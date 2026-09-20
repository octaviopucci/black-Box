import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-waiter-menu-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";
process.env.MESAFLOW_IDENTITY_SECRET = "test-secret-waiter-menu";

function mockHandlerResponse() {
  let statusCode = 0;
  let responseBody = "";
  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    setHeader() {
      return res;
    },
    send(data: string) {
      responseBody = data;
      return res;
    },
  } as unknown as VercelResponse;

  return {
    res,
    getStatus: () => statusCode,
    getBody: () => responseBody,
  };
}

async function run() {
  const { getStore, resetPersistedStoreCacheForTests, listGuestMenuCatalog } = await import("./store");
  const { issueAdminSessionToken } = await import("./admin-session-token");
  const { GET } = await import("../app/api/admin/menu/route");
  const handler = (await import("../../../iphone-imports/api/_mesaflow/handler")).default;

  resetPersistedStoreCacheForTests();
  const store = getStore();
  const establishment = Object.values(store.establishments).find((e) => e.slug === "ponto-do-sabor");
  assert.ok(establishment, "demo establishment");

  const waiter = store.users.user_waiter;
  assert.ok(waiter?.role === "WAITER", "demo waiter user");

  const token = issueAdminSessionToken(waiter.id, establishment.id);
  const expected = listGuestMenuCatalog(establishment.id);

  const routeRes = await GET(
    new Request("http://test/api/admin/menu", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  assert.equal(routeRes.status, 200, "Next route GET /admin/menu must succeed for WAITER");
  const routeBody = (await routeRes.json()) as {
    categories: unknown[];
    products: unknown[];
    establishment: { id: string };
  };
  assert.equal(routeBody.categories.length, expected.categories.length);
  assert.equal(routeBody.products.length, expected.products.length);
  assert.equal(routeBody.establishment.id, establishment.id);

  const route401 = await GET(new Request("http://test/api/admin/menu"));
  assert.equal(route401.status, 401, "unauthenticated menu GET must be 401");

  const { res, getStatus, getBody } = mockHandlerResponse();
  await handler(
    {
      method: "GET",
      query: { path: "admin/menu" },
      headers: { authorization: `Bearer ${token}` },
      url: "/api/mesaflow?path=admin/menu",
    } as VercelRequest,
    res,
  );
  assert.equal(getStatus(), 200, `handler GET /admin/menu must succeed, body=${getBody()}`);
  const handlerBody = JSON.parse(getBody()) as { categories: unknown[]; products: unknown[] };
  assert.equal(handlerBody.categories.length, expected.categories.length);
  assert.equal(handlerBody.products.length, expected.products.length);

  const unauth = mockHandlerResponse();
  await handler(
    {
      method: "GET",
      query: { path: "admin/menu" },
      headers: {},
      url: "/api/mesaflow?path=admin/menu",
    } as VercelRequest,
    unauth.res,
  );
  assert.equal(unauth.getStatus(), 401, "handler menu GET without auth must be 401");

  console.log("waiter-menu-endpoint.test.ts: all assertions passed");
}

run()
  .then(() => {
    rmSync(tempDir, { recursive: true, force: true });
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    rmSync(tempDir, { recursive: true, force: true });
    process.exit(1);
  });
