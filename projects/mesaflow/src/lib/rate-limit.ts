/**
 * In-memory rate limiter (fixed window per key).
 *
 * OK for dev and low-traffic pilots. Each Vercel serverless instance holds its
 * own bucket — use Redis (Upstash Ratelimit) before multi-tenant scale.
 */

export type RateLimitPolicy = {
  limit: number;
  windowMs: number;
};

export const RATE_LIMIT_POLICIES = {
  authLogin: { limit: 10, windowMs: 15 * 60 * 1000 },
  authRegister: { limit: 5, windowMs: 60 * 60 * 1000 },
  otpRequest: { limit: 5, windowMs: 15 * 60 * 1000 },
  otpVerify: { limit: 20, windowMs: 15 * 60 * 1000 },
} as const satisfies Record<string, RateLimitPolicy>;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { allowed: true; limit: number; remaining: number; resetAt: number }
  | { allowed: false; limit: number; remaining: 0; resetAt: number; retryAfterSec: number };

export function rateLimitKey(namespace: string, clientId: string): string {
  return `${namespace}:${clientId}`;
}

export function checkRateLimit(key: string, policy: RateLimitPolicy): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + policy.windowMs };
    buckets.set(key, bucket);
  }

  if (bucket.count >= policy.limit) {
    return {
      allowed: false,
      limit: policy.limit,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    limit: policy.limit,
    remaining: Math.max(0, policy.limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSec);
  }
  return headers;
}

export function clientIpFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>,
): string {
  const get = (name: string): string | undefined => {
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    const lower = name.toLowerCase();
    const value =
      headers[lower] ??
      headers[name] ??
      Object.entries(headers).find(([k]) => k.toLowerCase() === lower)?.[1];
    if (Array.isArray(value)) return value[0]?.trim();
    return typeof value === "string" ? value.split(",")[0]?.trim() : undefined;
  };

  return get("x-forwarded-for") || get("x-real-ip") || get("cf-connecting-ip") || "unknown";
}

export function enforceRateLimit(
  namespace: keyof typeof RATE_LIMIT_POLICIES,
  clientId: string,
): RateLimitResult {
  return checkRateLimit(rateLimitKey(namespace, clientId), RATE_LIMIT_POLICIES[namespace]);
}

export function resetRateLimitStoreForTests() {
  buckets.clear();
}
