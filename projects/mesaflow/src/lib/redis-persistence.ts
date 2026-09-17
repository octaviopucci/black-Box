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

export function redisConfigured(): boolean {
  return Boolean(redisAuth());
}

export function redisAuth(): RedisAuth | null {
  const url = process.env.MESAFLOW_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.MESAFLOW_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
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
  const operational = await redisCommand<MesaFlowOperationalStore>(["GET", OPERATIONAL_KEY]);
  const identity = await redisCommand<MesaFlowIdentityStore>(["GET", IDENTITY_KEY]);
  const etags = (await redisCommand<BlobEtags>(["GET", ETAGS_KEY])) || {};
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
  const pipeline: unknown[][] = [];
  if (input.flushOperational) pipeline.push(["SET", OPERATIONAL_KEY, operational]);
  if (input.flushIdentity) pipeline.push(["SET", IDENTITY_KEY, identity]);
  if (input.flushOperational || input.flushIdentity) {
    pipeline.push(["SET", ETAGS_KEY, input.etags]);
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
  if (!redisConfigured()) return { ok: false, error: "Redis not configured" };
  const pong = await redisCommand<string>(["PING"]);
  if (pong !== "PONG") return { ok: false, error: "redis ping failed" };
  return { ok: true };
}
