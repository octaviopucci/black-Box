import {
  buildDetailedHealthResponse,
  buildPublicHealthResponse,
  healthDiagnosticsAuthorized,
} from "@/lib/public-health";
import {
  blobDiagnostics,
  flushPersistentStore,
  getStore,
  probeBlobStorage,
  probeRedisStorage,
} from "@/lib/store";

function blobSetupHint(storage: ReturnType<typeof blobDiagnostics>): string {
  if (storage.hasToken) return "";
  if (storage.hasStoreId && !storage.hasOidc && !storage.hasOidcHeader) {
    return "BLOB_STORE_ID sem OIDC na function — redeploy ou BLOB_READ_WRITE_TOKEN.";
  }
  if ((storage.hasOidc || storage.hasOidcHeader) && !storage.hasStoreId) {
    return "OIDC ok mas BLOB_STORE_ID ausente — conecte Blob ao projeto Vercel.";
  }
  return "Configure Blob/Redis para persistência compartilhada.";
}

export async function GET(req: Request) {
  const hasOidcHeader = Boolean(req.headers.get("x-vercel-oidc-token")?.trim());
  const storage = blobDiagnostics(hasOidcHeader);
  const probe = await probeBlobStorage();
  const redisProbe = await probeRedisStorage();
  const persist = await flushPersistentStore();
  const blobOk = probe.ok || (storage.hasToken && storage.configured);
  const sharedOk =
    persist.blob === true ||
    persist.redis === true ||
    (redisProbe.ok === true && storage.redis?.configured === true);
  const establishmentCount = Object.keys(getStore().establishments).length;

  if (healthDiagnosticsAuthorized(req)) {
    return Response.json(
      buildDetailedHealthResponse({
        sharedOk,
        blobOk,
        establishmentCount,
        storage: { ...storage, probe, redisProbe },
        persist,
        setup: sharedOk
          ? undefined
          : persist.redisError
            ? `Redis: ${persist.redisError}`
            : blobSetupHint({ ...storage, lastError: persist.blobError ?? storage.lastError }),
      }),
    );
  }

  return Response.json(
    buildPublicHealthResponse({
      sharedOk,
      blobOk,
      establishmentCount,
    }),
  );
}
