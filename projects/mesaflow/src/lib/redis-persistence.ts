import {
  mergeStore,
  splitStore,
  type BlobEtags,
  type HydrateBlobResult,
} from "./blob-persistence";
import type { MesaFlowIdentityStore, MesaFlowOperationalStore } from "./types";

const OPERATIONAL_KEY = "mesaflow:operational";
const IDENTITY_KEY = "mesaflow:identity";
const ETAGS_KEY = "mesaflow:etags";

export type RedisAuth = {
  url: string;
  token: string;
};

function redisEnvKeys() {
  return Object.keys(process.env).filter(
    (key) => key.includes("REDIS") || key.includes("KV_REST") || key === "KV_URL",
  );
}

export function redisDiagnostics() {
  const auth = redisAuth();
  return {
    configured: Boolean(auth),
    envKeys: redisEnvKeys(),
    urlKey: auth
      ? [
          process.env.MESAFLOW_REDIS_REST_URL && "MESAFLOW_REDIS_REST_URL",
          process.env.UPSTASH_REDIS_REST_URL && "UPSTASH_REDIS_REST_URL",
          process.env.KV_REST_API_URL && "KV_REST_API_URL",
        ].find(Boolean)
      : undefined,
  };
}

export function redisConfigured(): boolean {
  return Boolean(redisAuth());
}

export function redisAuth(): RedisAuth | null {
  const url =
    process.env.MESAFLOW_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const token =
    process.env.MESAFLOW_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

function parseRedisJson<T>(raw: unknown): T | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  return raw as T;
}

async function redisCommand<T>(command: string[]): Promise<T | null> {
  const auth = redisAuth();
  if (!auth) return null;
  try {
    const res = await fetch(auth.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: T };
    return json.result ?? null;
  } catch {
    return null;
  }
}

export async function hydrateFromRedis(): Promise<HydrateBlobResult | null> {
  if (!redisConfigured()) return null;
  const operational = parseRedisJson<MesaFlowOperationalStore>(
    await redisCommand<string>(["GET", OPERATIONAL_KEY]),
  );
  const identity = parseRedisJson<MesaFlowIdentityStore>(await redisCommand<string>(["GET", IDENTITY_KEY]));
  const etags = parseRedisJson<BlobEtags>(await redisCommand<string>(["GET", ETAGS_KEY])) || {};
  if (!operational && !identity) return null;
  return {
    store: mergeStore(operational || {}, identity || {}),
    etags,
    migratedFromLegacy: false,
  };
}

export async function flushToRedis(input: {
  store: import("./types").MesaFlowStore;
  etags: BlobEtags;
  flushOperational: boolean;
  flushIdentity: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  if (!redisConfigured()) {
    return { ok: false, error: "Redis not configured" };
  }
  const { operational, identity } = splitStore(input.store);
  const pipeline: string[][] = [];
  if (input.flushOperational) {
    pipeline.push(["SET", OPERATIONAL_KEY, JSON.stringify(operational)]);
  }
  if (input.flushIdentity) {
    pipeline.push(["SET", IDENTITY_KEY, JSON.stringify(identity)]);
  }
  if (input.flushOperational || input.flushIdentity) {
    pipeline.push(["SET", ETAGS_KEY, JSON.stringify(input.etags)]);
  }
  if (!pipeline.length) return { ok: true };

  const auth = redisAuth();
  if (!auth) return { ok: false, error: "Redis not configured" };

  try {
    const res = await fetch(`${auth.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipeline),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: text || `redis pipeline failed (${res.status})` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "redis persist failed" };
  }
}

export async function probeRedis(): Promise<{ ok: boolean; error?: string }> {
  if (!redisConfigured()) {
    return {
      ok: false,
      error: `Redis not configured (need UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN). Found: ${redisEnvKeys().join(", ") || "none"}`,
    };
  }
  const pong = await redisCommand<string>(["PING"]);
  if (pong !== "PONG") return { ok: false, error: "redis ping failed" };
  return { ok: true };
}

export async function redisHasStoreData(): Promise<boolean> {
  if (!redisConfigured()) return false;
  const operational = await redisCommand<string>(["GET", OPERATIONAL_KEY]);
  const identity = await redisCommand<string>(["GET", IDENTITY_KEY]);
  return Boolean(operational || identity);
}
