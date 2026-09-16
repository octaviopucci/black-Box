import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tempDir = mkdtempSync(join(tmpdir(), "mesaflow-guest-"));
process.env.MESAFLOW_DATA = join(tempDir, "store.json");
process.env.MESAFLOW_DEV_SKIP_OTP = "1";

async function run() {
  const { getStore, findEstablishmentBySlug, findTableByQr, createOrder } = await import("./store");
  const {
    joinGuestAtTable,
    validateClientSession,
    findOpenParticipation,
    requestOtpChallenge,
    verifyOtpChallenge,
  } = await import("./guest");
  const { phoneLookupHash } = await import("./identity-crypto");

  const store = getStore();
  const establishment = findEstablishmentBySlug("ponto-do-sabor");
  assert.ok(establishment, "demo establishment required");
  const table = Object.values(store.tables).find((entry) => entry.establishmentId === establishment.id);
  assert.ok(table, "demo table required");
  const qrToken = table.qrToken;

  const first = joinGuestAtTable({
    establishment,
    table,
    phoneE164: "+5511988776655",
    displayName: "Ana",
  });
  assert.ok(first.token);
  assert.equal(first.participation.displayName, "Ana");
  assert.equal(first.participation.status, "OPEN");

  const session = validateClientSession(first.token);
  assert.ok(session);
  assert.equal(session.participation.id, first.participation.id);

  const duplicate = joinGuestAtTable({
    establishment,
    table,
    phoneE164: "+5511988776655",
    displayName: "Ana",
  });
  assert.equal(duplicate.participation.id, first.participation.id);
  assert.ok(duplicate.message);

  const lookup = phoneLookupHash(establishment.id, "+5511988776655");
  const open = findOpenParticipation(store, duplicate.command.id, lookup);
  assert.ok(open);
  assert.equal(open.id, first.participation.id);

  const product = Object.values(store.products).find(
    (entry) => entry.establishmentId === establishment.id && entry.active,
  );
  assert.ok(product);

  const order = createOrder({
    establishmentId: establishment.id,
    table,
    commandId: duplicate.command.id,
    guestParticipationId: first.participation.id,
    items: [
      {
        id: "line_test",
        productId: product.id,
        productName: product.name,
        sectorId: product.sectorId,
        sectorName: "Cozinha",
        qty: 1,
        unitPrice: product.price,
        variantDelta: 0,
        addons: [],
        status: "NOVO",
      },
    ],
    source: "MESA",
  });
  assert.equal(order.guestParticipationId, first.participation.id);

  process.env.MESAFLOW_OTP_MOCK = "1";
  delete process.env.MESAFLOW_DEV_SKIP_OTP;
  const otpEst = { ...establishment, settings: { ...establishment.settings, otpRequired: true } };
  const otpTable = findTableByQr(otpEst.id, qrToken);
  assert.ok(otpTable);
  const otpRequest = requestOtpChallenge({
    establishment: otpEst,
    table: otpTable,
    phoneRaw: "+5511977665544",
    purpose: "JOIN",
  });
  assert.ok("challengeId" in otpRequest);
  assert.ok(otpRequest.mockCode);

  const verified = verifyOtpChallenge({
    challengeId: otpRequest.challengeId,
    code: otpRequest.mockCode!,
    displayName: "Bruno",
  });
  assert.ok("token" in verified && verified.participation);
  assert.equal(verified.participation!.displayName, "Bruno");

  console.log("✓ MesaFlow guest-session tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
