import { get, list, put } from "@vercel/blob";
import type { MesaFlowIdentityStore, MesaFlowOperationalStore, MesaFlowStore } from "./types";

export const LEGACY_BLOB_PATH = "mesaflow/store.json";
export const OPERATIONAL_BLOB_PATH = "mesaflow/operational.json";
export const IDENTITY_BLOB_PATH = "mesaflow/identity.json";
export const BLOB_ACCESS = "private" as const;

export type BlobAuthOptions = {
  token?: string;
  storeId?: string;
  oidcToken?: string;
};

export type BlobEtags = {
  operational?: string;
  identity?: string;
};

function blobReadWriteToken() {
  const direct = [
    process.env.MESAFLOW_BLOB_READ_WRITE_TOKEN,
    process.env.BLOB_READ_WRITE_TOKEN,
  ].find((value) => value?.trim());
  if (direct) return direct.trim();

  for (const [key, value] of Object.entries(process.env)) {
    if (!value?.trim()) continue;
    if (key.includes("BLOB") && /TOKEN|RW/i.test(key) && value.startsWith("vercel_blob_rw_")) {
      return value.trim();
    }
  }
  return undefined;
}

function blobStoreId() {
  return process.env.MESAFLOW_BLOB_STORE_ID || process.env.BLOB_STORE_ID;
}

export function blobAuthOptions(runtimeOidcToken?: string): BlobAuthOptions {
  const token = blobReadWriteToken();
  if (token) return { token };

  const storeId = blobStoreId();
  const oidcToken = runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN;
  if (oidcToken && storeId) return { oidcToken, storeId };
  if (storeId) return { storeId };
  if (oidcToken) return { oidcToken };
  return {};
}

export function blobConfigured(runtimeOidcToken?: string) {
  if (blobReadWriteToken()) return true;
  if (blobStoreId()) return true;
  return Boolean(runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN);
}

function emptyOperational(): MesaFlowOperationalStore {
  return {
    establishments: {},
    sectors: {},
    categories: {},
    products: {},
    tables: {},
    commands: {},
    orders: {},
    guestParticipations: {},
    rodizios: {},
    rodizioRounds: {},
    notifications: {},
    closingRequests: {},
    orderItemSplits: {},
    payments: {},
    integrationConnections: {},
    auditEvents: {},
    orderCounter: {},
  };
}

function emptyIdentity(): MesaFlowIdentityStore {
  return {
    users: {},
    sessions: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {},
  };
}

export function splitStore(store: MesaFlowStore): {
  operational: MesaFlowOperationalStore;
  identity: MesaFlowIdentityStore;
} {
  const {
    users,
    sessions,
    establishments,
    sectors,
    categories,
    products,
    tables,
    commands,
    orders,
    guestParticipations,
    rodizios,
    rodizioRounds,
    notifications,
    closingRequests,
    orderItemSplits,
    payments,
    integrationConnections,
    auditEvents,
    orderCounter,
    clientSessions,
    otpChallenges,
    guestPhoneSecrets,
    revokedGuestTokenHashes,
  } = store;
  return {
    operational: {
      establishments,
      sectors,
      categories,
      products,
      tables,
      commands,
      orders,
      guestParticipations,
      rodizios,
      rodizioRounds,
      notifications,
      closingRequests,
      orderItemSplits,
      payments,
      integrationConnections,
      auditEvents,
      orderCounter,
    },
    identity: {
      users,
      sessions,
      clientSessions,
      otpChallenges,
      guestPhoneSecrets,
      revokedGuestTokenHashes: revokedGuestTokenHashes || {},
    },
  };
}

export function mergeStore(
  operational: Partial<MesaFlowOperationalStore>,
  identity: Partial<MesaFlowIdentityStore>,
): MesaFlowStore {
  return {
    ...emptyOperational(),
    ...operational,
    ...emptyIdentity(),
    ...identity,
  };
}

async function readJsonFromStream(stream: ReadableStream<Uint8Array>): Promise<unknown> {
  const text = await new Response(stream).text();
  return JSON.parse(text);
}

async function readPrivateBlob(
  pathname: string,
  auth: BlobAuthOptions,
): Promise<{ data: unknown; etag?: string } | null> {
  const result = await get(pathname, { access: BLOB_ACCESS, ...auth, useCache: false });
  if (!result?.stream) return null;
  const data = await readJsonFromStream(result.stream);
  return { data, etag: result.blob.etag };
}

async function readLegacyPublicBlob(
  pathname: string,
  auth: BlobAuthOptions,
): Promise<{ data: unknown } | null> {
  const listed = await list({ prefix: pathname, limit: 1, ...auth });
  const blob = listed.blobs.find((entry) => entry.pathname === pathname);
  if (!blob) return null;
  const response = await fetch(blob.url);
  if (!response.ok) return null;
  return { data: await response.json() };
}

export type HydrateBlobResult = {
  store: MesaFlowStore;
  etags: BlobEtags;
  migratedFromLegacy: boolean;
};

export async function hydrateFromBlob(runtimeOidcToken?: string): Promise<HydrateBlobResult | null> {
  const auth = blobAuthOptions(runtimeOidcToken);
  if (!blobConfigured(runtimeOidcToken)) return null;

  const operational = await readPrivateBlob(OPERATIONAL_BLOB_PATH, auth);
  const identity = await readPrivateBlob(IDENTITY_BLOB_PATH, auth);

  if (operational || identity) {
    return {
      store: mergeStore(
        (operational?.data || {}) as Partial<MesaFlowOperationalStore>,
        (identity?.data || {}) as Partial<MesaFlowIdentityStore>,
      ),
      etags: {
        operational: operational?.etag,
        identity: identity?.etag,
      },
      migratedFromLegacy: false,
    };
  }

  const legacy = await readLegacyPublicBlob(LEGACY_BLOB_PATH, auth);
  if (!legacy) return null;

  const legacyStore = legacy.data as Partial<MesaFlowStore>;
  const { operational: op, identity: id } = splitStore(mergeStore(legacyStore, {}));
  return {
    store: mergeStore(op, id),
    etags: {},
    migratedFromLegacy: true,
  };
}

const MAX_BLOB_RETRIES = 3;

async function putWithRetry(
  pathname: string,
  body: string,
  auth: BlobAuthOptions,
  etag?: string,
): Promise<{ ok: true; etag: string } | { ok: false; error: string }> {
  for (let attempt = 0; attempt < MAX_BLOB_RETRIES; attempt++) {
    try {
      const result = await put(pathname, body, {
        access: BLOB_ACCESS,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        ifMatch: etag,
        ...auth,
      });
      return { ok: true, etag: result.etag };
    } catch (error) {
      const message = error instanceof Error ? error.message : "blob persist failed";
      const conflict = /precondition|etag|412/i.test(message);
      if (!conflict || attempt === MAX_BLOB_RETRIES - 1) {
        return { ok: false, error: message };
      }
      const fresh = await readPrivateBlob(pathname, auth);
      if (fresh?.etag) etag = fresh.etag;
    }
  }
  return { ok: false, error: "blob persist failed after retries" };
}

export type FlushBlobInput = {
  store: MesaFlowStore;
  etags: BlobEtags;
  flushOperational: boolean;
  flushIdentity: boolean;
  runtimeOidcToken?: string;
};

export type FlushBlobResult = {
  operational?: { ok: boolean; etag?: string; error?: string };
  identity?: { ok: boolean; etag?: string; error?: string };
};

export async function flushToBlob(input: FlushBlobInput): Promise<FlushBlobResult> {
  const auth = blobAuthOptions(input.runtimeOidcToken);
  if (!blobConfigured(input.runtimeOidcToken)) {
    return {
      operational: { ok: false, error: "Blob not configured" },
      identity: { ok: false, error: "Blob not configured" },
    };
  }

  const { operational, identity } = splitStore(input.store);
  const result: FlushBlobResult = {};

  if (input.flushOperational) {
    const putResult = await putWithRetry(
      OPERATIONAL_BLOB_PATH,
      JSON.stringify(operational),
      auth,
      input.etags.operational,
    );
    result.operational = putResult.ok
      ? { ok: true, etag: putResult.etag }
      : { ok: false, error: putResult.error };
  }

  if (input.flushIdentity) {
    const putResult = await putWithRetry(
      IDENTITY_BLOB_PATH,
      JSON.stringify(identity),
      auth,
      input.etags.identity,
    );
    result.identity = putResult.ok
      ? { ok: true, etag: putResult.etag }
      : { ok: false, error: putResult.error };
  }

  return result;
}

export async function probeBlobPaths(runtimeOidcToken?: string): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.VERCEL) return { ok: false, error: "local" };
  if (!blobConfigured(runtimeOidcToken)) {
    return { ok: false, error: "Blob not configured (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)" };
  }
  try {
    const auth = blobAuthOptions(runtimeOidcToken);
    await list({ prefix: "mesaflow/", limit: 1, ...auth });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "blob unreachable",
    };
  }
}
