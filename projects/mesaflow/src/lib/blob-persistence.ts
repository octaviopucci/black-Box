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
    platformUsers: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {},
    waiterActivationTokens: {},
    tableAssignments: {},
  };
}

export function splitStore(store: MesaFlowStore): {
  operational: MesaFlowOperationalStore;
  identity: MesaFlowIdentityStore;
} {
  const {
    users,
    sessions,
    platformUsers,
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
    waiterActivationTokens,
    tableAssignments,
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
      platformUsers: platformUsers || {},
      clientSessions,
      otpChallenges,
      guestPhoneSecrets,
      revokedGuestTokenHashes: revokedGuestTokenHashes || {},
      waiterActivationTokens: waiterActivationTokens || {},
      tableAssignments: tableAssignments || {},
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

async function blobGet(pathname: string, auth: BlobAuthOptions) {
  const getFn = blobGetOverride ?? get;
  return getFn(pathname, { access: BLOB_ACCESS, ...auth, useCache: false });
}

async function blobPut(
  pathname: string,
  body: string,
  auth: BlobAuthOptions,
  etag?: string,
) {
  const putFn = blobPutOverride ?? put;
  return putFn(pathname, body, {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ifMatch: etag,
    ...auth,
  });
}

async function readPrivateBlob(
  pathname: string,
  auth: BlobAuthOptions,
): Promise<{ data: unknown; etag?: string } | null> {
  const result = await blobGet(pathname, auth);
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

export type OperationalMergeFn = (
  remote: MesaFlowOperationalStore,
  local: MesaFlowOperationalStore,
) => MesaFlowOperationalStore;

export type FlushBlobInput = {
  store: MesaFlowStore;
  etags: BlobEtags;
  flushOperational: boolean;
  flushIdentity: boolean;
  runtimeOidcToken?: string;
  /** Re-applies local operational changes onto fresh remote blob after ETag conflict. */
  mergeOperational?: OperationalMergeFn;
  /** Critical path (approve): after If-Match retries, PUT without ifMatch so approve never 503s on ETag. */
  allowUnconditionalOverwrite?: boolean;
};

export type FlushBlobResult = {
  operational?: {
    ok: boolean;
    etag?: string;
    error?: string;
    unconditionalOverwrite?: boolean;
  };
  identity?: { ok: boolean; etag?: string; error?: string };
};

type HydrateFromBlobFn = (runtimeOidcToken?: string) => Promise<HydrateBlobResult | null>;
type FlushToBlobFn = (input: FlushBlobInput) => Promise<FlushBlobResult>;

let hydrateFromBlobOverride: HydrateFromBlobFn | undefined;
let flushToBlobOverride: FlushToBlobFn | undefined;

type BlobPutFn = typeof put;
type BlobGetFn = typeof get;

let blobPutOverride: BlobPutFn | undefined;
let blobGetOverride: BlobGetFn | undefined;

/** @internal Test-only hooks for simulated cross-instance blob I/O. */
export function setBlobPersistenceTestHooks(hooks: {
  hydrateFromBlob?: HydrateFromBlobFn;
  flushToBlob?: FlushToBlobFn;
}) {
  hydrateFromBlobOverride = hooks.hydrateFromBlob;
  flushToBlobOverride = hooks.flushToBlob;
}

/** @internal Low-level Blob I/O hooks for ETag retry tests. */
export function setBlobIoTestHooks(hooks: { put?: BlobPutFn; get?: BlobGetFn }) {
  blobPutOverride = hooks.put;
  blobGetOverride = hooks.get;
}

/** @internal Clears test hooks between cases. */
export function clearBlobPersistenceTestHooks() {
  hydrateFromBlobOverride = undefined;
  flushToBlobOverride = undefined;
  blobPutOverride = undefined;
  blobGetOverride = undefined;
}

async function hydrateFromBlobImpl(runtimeOidcToken?: string): Promise<HydrateBlobResult | null> {
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

const MAX_BLOB_RETRIES = 5;
const RETRY_BACKOFF_MS = 40;

function isBlobEtagConflict(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /precondition|etag|412/i.test(message);
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type PutWithRetryInput<T> = {
  pathname: string;
  auth: BlobAuthOptions;
  etag?: string;
  payload: T;
  serialize: (payload: T) => string;
  mergeOnConflict?: (remote: T, local: T) => T;
  allowUnconditionalOverwrite?: boolean;
};

type PutWithRetrySuccess = {
  ok: true;
  etag: string;
  unconditionalOverwrite?: boolean;
};

async function mergeWithLatestRemote<T>(
  pathname: string,
  auth: BlobAuthOptions,
  payload: T,
  serialize: (payload: T) => string,
  mergeOnConflict?: (remote: T, local: T) => T,
): Promise<{ etag?: string; payload: T; body: string }> {
  let merged = payload;
  let etag: string | undefined;
  try {
    const fresh = await readPrivateBlob(pathname, auth);
    if (fresh?.etag) etag = fresh.etag;
    if (fresh?.data !== undefined && fresh?.data !== null && mergeOnConflict) {
      merged = mergeOnConflict(fresh.data as T, payload);
    } else if (fresh?.data !== undefined && fresh?.data !== null) {
      merged = payload;
    }
  } catch {
    // keep local payload if re-read fails; unconditional put may still succeed
  }
  return { etag, payload: merged, body: serialize(merged) };
}

async function putWithRetry<T>(
  input: PutWithRetryInput<T>,
): Promise<PutWithRetrySuccess | { ok: false; error: string }> {
  let etag = input.etag;
  let payload = input.payload;
  let body = input.serialize(payload);
  let lastError = "blob persist failed";

  for (let attempt = 0; attempt < MAX_BLOB_RETRIES; attempt++) {
    try {
      const result = await blobPut(input.pathname, body, input.auth, etag);
      return { ok: true, etag: result.etag };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "blob persist failed";
      const conflict = isBlobEtagConflict(error);
      if (!conflict) {
        return { ok: false, error: lastError };
      }
      if (attempt < MAX_BLOB_RETRIES - 1) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
      }
      const refreshed = await mergeWithLatestRemote(
        input.pathname,
        input.auth,
        payload,
        input.serialize,
        input.mergeOnConflict,
      );
      etag = refreshed.etag;
      payload = refreshed.payload;
      body = refreshed.body;
    }
  }

  if (input.allowUnconditionalOverwrite) {
    try {
      const refreshed = await mergeWithLatestRemote(
        input.pathname,
        input.auth,
        payload,
        input.serialize,
        input.mergeOnConflict,
      );
      console.warn(
        "[mesaflow] blob unconditional operational overwrite after ETag conflicts",
        { pathname: input.pathname },
      );
      const result = await blobPut(input.pathname, refreshed.body, input.auth, undefined);
      return { ok: true, etag: result.etag, unconditionalOverwrite: true };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "blob persist failed";
    }
  }

  return { ok: false, error: lastError };
}

async function flushToBlobImpl(input: FlushBlobInput): Promise<FlushBlobResult> {
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
    const putResult = await putWithRetry({
      pathname: OPERATIONAL_BLOB_PATH,
      auth,
      etag: input.etags.operational,
      payload: operational,
      serialize: (data) => JSON.stringify(data),
      mergeOnConflict: input.mergeOperational,
      allowUnconditionalOverwrite: input.allowUnconditionalOverwrite,
    });
    result.operational = putResult.ok
      ? {
          ok: true,
          etag: putResult.etag,
          unconditionalOverwrite: putResult.unconditionalOverwrite,
        }
      : { ok: false, error: putResult.error };
  }

  if (input.flushIdentity) {
    const putResult = await putWithRetry({
      pathname: IDENTITY_BLOB_PATH,
      auth,
      etag: input.etags.identity,
      payload: identity,
      serialize: (data) => JSON.stringify(data),
    });
    result.identity = putResult.ok
      ? { ok: true, etag: putResult.etag }
      : { ok: false, error: putResult.error };
  }

  return result;
}

export async function hydrateFromBlob(runtimeOidcToken?: string): Promise<HydrateBlobResult | null> {
  if (hydrateFromBlobOverride) return hydrateFromBlobOverride(runtimeOidcToken);
  return hydrateFromBlobImpl(runtimeOidcToken);
}

export async function flushToBlob(input: FlushBlobInput): Promise<FlushBlobResult> {
  if (flushToBlobOverride) return flushToBlobOverride(input);
  return flushToBlobImpl(input);
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
