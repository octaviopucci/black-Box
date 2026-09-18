import assert from "node:assert/strict";
import {
  checkRateLimit,
  enforceRateLimit,
  rateLimitHeaders,
  resetRateLimitStoreForTests,
} from "./rate-limit";

function run() {
  resetRateLimitStoreForTests();

  const policy = { limit: 2, windowMs: 60_000 };
  const key = "test:127.0.0.1";

  const first = checkRateLimit(key, policy);
  assert.equal(first.allowed, true);
  assert.equal(first.remaining, 1);

  const second = checkRateLimit(key, policy);
  assert.equal(second.allowed, true);
  assert.equal(second.remaining, 0);

  const third = checkRateLimit(key, policy);
  assert.equal(third.allowed, false);
  assert.ok(third.retryAfterSec >= 1);
  assert.ok(rateLimitHeaders(third)["Retry-After"]);

  resetRateLimitStoreForTests();
  const auth = enforceRateLimit("authLogin", "test-ip");
  assert.equal(auth.allowed, true);

  console.log("rate-limit.test.ts — all assertions passed");
}

run();
