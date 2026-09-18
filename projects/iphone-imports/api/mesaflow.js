"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../iphone-imports/api/_mesaflow/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(handler_exports);

// src/lib/store.ts
var import_fs = require("fs");
var import_path = require("path");

// src/lib/blob-persistence.ts
var import_blob = require("@vercel/blob");
var LEGACY_BLOB_PATH = "mesaflow/store.json";
var OPERATIONAL_BLOB_PATH = "mesaflow/operational.json";
var IDENTITY_BLOB_PATH = "mesaflow/identity.json";
var BLOB_ACCESS = "private";
function blobReadWriteToken() {
  const direct = [
    process.env.MESAFLOW_BLOB_READ_WRITE_TOKEN,
    process.env.BLOB_READ_WRITE_TOKEN
  ].find((value) => value?.trim());
  if (direct) return direct.trim();
  for (const [key, value] of Object.entries(process.env)) {
    if (!value?.trim()) continue;
    if (key.includes("BLOB") && /TOKEN|RW/i.test(key) && value.startsWith("vercel_blob_rw_")) {
      return value.trim();
    }
  }
  return void 0;
}
function blobStoreId() {
  return process.env.MESAFLOW_BLOB_STORE_ID || process.env.BLOB_STORE_ID;
}
function blobAuthOptions(runtimeOidcToken2) {
  const token = blobReadWriteToken();
  if (token) return { token };
  const storeId = blobStoreId();
  const oidcToken = runtimeOidcToken2 || process.env.VERCEL_OIDC_TOKEN;
  if (oidcToken && storeId) return { oidcToken, storeId };
  if (storeId) return { storeId };
  if (oidcToken) return { oidcToken };
  return {};
}
function blobConfigured(runtimeOidcToken2) {
  if (blobReadWriteToken()) return true;
  if (blobStoreId()) return true;
  return Boolean(runtimeOidcToken2 || process.env.VERCEL_OIDC_TOKEN);
}
function emptyOperational() {
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
    orderCounter: {}
  };
}
function emptyIdentity() {
  return {
    users: {},
    sessions: {},
    platformUsers: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {}
  };
}
function splitStore(store) {
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
    revokedGuestTokenHashes
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
      orderCounter
    },
    identity: {
      users,
      sessions,
      platformUsers: platformUsers || {},
      clientSessions,
      otpChallenges,
      guestPhoneSecrets,
      revokedGuestTokenHashes: revokedGuestTokenHashes || {}
    }
  };
}
function mergeStore(operational, identity) {
  return {
    ...emptyOperational(),
    ...operational,
    ...emptyIdentity(),
    ...identity
  };
}
async function readJsonFromStream(stream) {
  const text = await new Response(stream).text();
  return JSON.parse(text);
}
async function readPrivateBlob(pathname, auth) {
  const result = await (0, import_blob.get)(pathname, { access: BLOB_ACCESS, ...auth, useCache: false });
  if (!result?.stream) return null;
  const data = await readJsonFromStream(result.stream);
  return { data, etag: result.blob.etag };
}
async function readLegacyPublicBlob(pathname, auth) {
  const listed = await (0, import_blob.list)({ prefix: pathname, limit: 1, ...auth });
  const blob = listed.blobs.find((entry) => entry.pathname === pathname);
  if (!blob) return null;
  const response = await fetch(blob.url);
  if (!response.ok) return null;
  return { data: await response.json() };
}
async function hydrateFromBlob(runtimeOidcToken2) {
  const auth = blobAuthOptions(runtimeOidcToken2);
  if (!blobConfigured(runtimeOidcToken2)) return null;
  const operational = await readPrivateBlob(OPERATIONAL_BLOB_PATH, auth);
  const identity = await readPrivateBlob(IDENTITY_BLOB_PATH, auth);
  if (operational || identity) {
    return {
      store: mergeStore(
        operational?.data || {},
        identity?.data || {}
      ),
      etags: {
        operational: operational?.etag,
        identity: identity?.etag
      },
      migratedFromLegacy: false
    };
  }
  const legacy = await readLegacyPublicBlob(LEGACY_BLOB_PATH, auth);
  if (!legacy) return null;
  const legacyStore = legacy.data;
  const { operational: op, identity: id2 } = splitStore(mergeStore(legacyStore, {}));
  return {
    store: mergeStore(op, id2),
    etags: {},
    migratedFromLegacy: true
  };
}
var MAX_BLOB_RETRIES = 3;
async function putWithRetry(pathname, body, auth, etag) {
  for (let attempt = 0; attempt < MAX_BLOB_RETRIES; attempt++) {
    try {
      const result = await (0, import_blob.put)(pathname, body, {
        access: BLOB_ACCESS,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        ifMatch: etag,
        ...auth
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
async function flushToBlob(input) {
  const auth = blobAuthOptions(input.runtimeOidcToken);
  if (!blobConfigured(input.runtimeOidcToken)) {
    return {
      operational: { ok: false, error: "Blob not configured" },
      identity: { ok: false, error: "Blob not configured" }
    };
  }
  const { operational, identity } = splitStore(input.store);
  const result = {};
  if (input.flushOperational) {
    const putResult = await putWithRetry(
      OPERATIONAL_BLOB_PATH,
      JSON.stringify(operational),
      auth,
      input.etags.operational
    );
    result.operational = putResult.ok ? { ok: true, etag: putResult.etag } : { ok: false, error: putResult.error };
  }
  if (input.flushIdentity) {
    const putResult = await putWithRetry(
      IDENTITY_BLOB_PATH,
      JSON.stringify(identity),
      auth,
      input.etags.identity
    );
    result.identity = putResult.ok ? { ok: true, etag: putResult.etag } : { ok: false, error: putResult.error };
  }
  return result;
}
async function probeBlobPaths(runtimeOidcToken2) {
  if (!process.env.VERCEL) return { ok: false, error: "local" };
  if (!blobConfigured(runtimeOidcToken2)) {
    return { ok: false, error: "Blob not configured (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)" };
  }
  try {
    const auth = blobAuthOptions(runtimeOidcToken2);
    await (0, import_blob.list)({ prefix: "mesaflow/", limit: 1, ...auth });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "blob unreachable"
    };
  }
}

// src/lib/redis-persistence.ts
var OPERATIONAL_KEY = "mesaflow:operational";
var IDENTITY_KEY = "mesaflow:identity";
var ETAGS_KEY = "mesaflow:etags";
function redisEnvKeys() {
  return Object.keys(process.env).filter(
    (key) => key.includes("REDIS") || key.includes("KV_REST") || key === "KV_URL"
  );
}
function redisDiagnostics() {
  const auth = redisAuth();
  return {
    configured: Boolean(auth),
    envKeys: redisEnvKeys(),
    urlKey: auth ? [
      process.env.MESAFLOW_REDIS_REST_URL && "MESAFLOW_REDIS_REST_URL",
      process.env.UPSTASH_REDIS_REST_URL && "UPSTASH_REDIS_REST_URL",
      process.env.KV_REST_API_URL && "KV_REST_API_URL"
    ].find(Boolean) : void 0
  };
}
function redisConfigured() {
  return Boolean(redisAuth());
}
function redisAuth() {
  const url = process.env.MESAFLOW_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.MESAFLOW_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}
function parseRedisJson(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
}
async function redisCommand(command) {
  const auth = redisAuth();
  if (!auth) return null;
  try {
    const res = await fetch(auth.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });
    if (!res.ok) return null;
    const json2 = await res.json();
    return json2.result ?? null;
  } catch {
    return null;
  }
}
async function hydrateFromRedis() {
  if (!redisConfigured()) return null;
  const operational = parseRedisJson(
    await redisCommand(["GET", OPERATIONAL_KEY])
  );
  const identity = parseRedisJson(await redisCommand(["GET", IDENTITY_KEY]));
  const etags = parseRedisJson(await redisCommand(["GET", ETAGS_KEY])) || {};
  if (!operational && !identity) return null;
  return {
    store: mergeStore(operational || {}, identity || {}),
    etags,
    migratedFromLegacy: false
  };
}
async function flushToRedis(input) {
  if (!redisConfigured()) {
    return { ok: false, error: "Redis not configured" };
  }
  const { operational, identity } = splitStore(input.store);
  const pipeline = [];
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pipeline)
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
async function probeRedis() {
  if (!redisConfigured()) {
    return {
      ok: false,
      error: `Redis not configured (need UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN). Found: ${redisEnvKeys().join(", ") || "none"}`
    };
  }
  const pong = await redisCommand(["PING"]);
  if (pong !== "PONG") return { ok: false, error: "redis ping failed" };
  return { ok: true };
}
async function redisHasStoreData() {
  if (!redisConfigured()) return false;
  const operational = await redisCommand(["GET", OPERATIONAL_KEY]);
  const identity = await redisCommand(["GET", IDENTITY_KEY]);
  return Boolean(operational || identity);
}

// src/lib/admin-session-token.ts
var import_crypto = require("crypto");
var ADMIN_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
function secret() {
  return process.env.MESAFLOW_ADMIN_SESSION_SECRET || process.env.MESAFLOW_IDENTITY_SECRET || "mesaflow-dev-only-change-in-production";
}
function sign(payloadB64) {
  return (0, import_crypto.createHmac)("sha256", secret()).update(payloadB64).digest("base64url");
}
function verifySig(payloadB64, sig) {
  const expected = sign(payloadB64);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  return sigBuf.length === expectedBuf.length && (0, import_crypto.timingSafeEqual)(sigBuf, expectedBuf);
}
function issueAdminSessionToken(userId, establishmentId, ttlMs = ADMIN_SESSION_TTL_MS) {
  const claims = { userId, establishmentId, exp: Date.now() + ttlMs };
  const payloadB64 = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}
function parseAdminSessionToken(token) {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig || !verifySig(payloadB64, sig)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!claims.userId || !claims.establishmentId || !claims.exp) return null;
    if (Date.now() > claims.exp) return null;
    return claims;
  } catch {
    return null;
  }
}

// src/lib/crypto-utils.ts
var import_crypto3 = require("crypto");

// node_modules/bcryptjs/index.js
var import_crypto2 = __toESM(require("crypto"), 1);
var randomFallback = null;
function randomBytes(len) {
  try {
    return crypto.getRandomValues(new Uint8Array(len));
  } catch {
  }
  try {
    return import_crypto2.default.randomBytes(len);
  } catch {
  }
  if (!randomFallback) {
    throw Error(
      "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
    );
  }
  return randomFallback(len);
}
function genSaltSync(rounds, seed_length) {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof rounds !== "number")
    throw Error(
      "Illegal arguments: " + typeof rounds + ", " + typeof seed_length
    );
  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  var salt = [];
  salt.push("$2b$");
  if (rounds < 10) salt.push("0");
  salt.push(rounds.toString());
  salt.push("$");
  salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
  return salt.join("");
}
function hashSync(password, salt) {
  if (typeof salt === "undefined") salt = GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof salt === "number") salt = genSaltSync(salt);
  if (typeof password !== "string" || typeof salt !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof salt);
  return _hash(password, salt);
}
function safeStringCompare(known, unknown) {
  var diff = known.length ^ unknown.length;
  for (var i = 0; i < known.length; ++i) {
    diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
  }
  return diff === 0;
}
function compareSync(password, hash) {
  if (typeof password !== "string" || typeof hash !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof hash);
  if (hash.length !== 60) return false;
  return safeStringCompare(
    hashSync(password, hash.substring(0, hash.length - 31)),
    hash
  );
}
var nextTick = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
function utf8Length(string) {
  var len = 0, c = 0;
  for (var i = 0; i < string.length; ++i) {
    c = string.charCodeAt(i);
    if (c < 128) len += 1;
    else if (c < 2048) len += 2;
    else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else len += 3;
  }
  return len;
}
function utf8Array(string) {
  var offset = 0, c1, c2;
  var buffer = new Array(utf8Length(string));
  for (var i = 0, k = string.length; i < k; ++i) {
    c1 = string.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return buffer;
}
var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var BASE64_INDEX = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  -1,
  -1,
  -1,
  -1,
  -1
];
function base64_encode(b, len) {
  var off = 0, rs = [], c1, c2;
  if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
  while (off < len) {
    c1 = b[off++] & 255;
    rs.push(BASE64_CODE[c1 >> 2 & 63]);
    c1 = (c1 & 3) << 4;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 4 & 15;
    rs.push(BASE64_CODE[c1 & 63]);
    c1 = (c2 & 15) << 2;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 6 & 3;
    rs.push(BASE64_CODE[c1 & 63]);
    rs.push(BASE64_CODE[c2 & 63]);
  }
  return rs.join("");
}
function base64_decode(s, len) {
  var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
  if (len <= 0) throw Error("Illegal len: " + len);
  while (off < slen - 1 && olen < len) {
    code = s.charCodeAt(off++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = s.charCodeAt(off++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c1 == -1 || c2 == -1) break;
    o = c1 << 2 >>> 0;
    o |= (c2 & 48) >> 4;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c3 == -1) break;
    o = (c2 & 15) << 4 >>> 0;
    o |= (c3 & 60) >> 2;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = (c3 & 3) << 6 >>> 0;
    o |= c4;
    rs.push(String.fromCharCode(o));
    ++olen;
  }
  var res = [];
  for (off = 0; off < olen; off++) res.push(rs[off].charCodeAt(0));
  return res;
}
var BCRYPT_SALT_LEN = 16;
var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
var BLOWFISH_NUM_ROUNDS = 16;
var MAX_EXECUTION_TIME = 100;
var P_ORIG = [
  608135816,
  2242054355,
  320440878,
  57701188,
  2752067618,
  698298832,
  137296536,
  3964562569,
  1160258022,
  953160567,
  3193202383,
  887688300,
  3232508343,
  3380367581,
  1065670069,
  3041331479,
  2450970073,
  2306472731
];
var S_ORIG = [
  3509652390,
  2564797868,
  805139163,
  3491422135,
  3101798381,
  1780907670,
  3128725573,
  4046225305,
  614570311,
  3012652279,
  134345442,
  2240740374,
  1667834072,
  1901547113,
  2757295779,
  4103290238,
  227898511,
  1921955416,
  1904987480,
  2182433518,
  2069144605,
  3260701109,
  2620446009,
  720527379,
  3318853667,
  677414384,
  3393288472,
  3101374703,
  2390351024,
  1614419982,
  1822297739,
  2954791486,
  3608508353,
  3174124327,
  2024746970,
  1432378464,
  3864339955,
  2857741204,
  1464375394,
  1676153920,
  1439316330,
  715854006,
  3033291828,
  289532110,
  2706671279,
  2087905683,
  3018724369,
  1668267050,
  732546397,
  1947742710,
  3462151702,
  2609353502,
  2950085171,
  1814351708,
  2050118529,
  680887927,
  999245976,
  1800124847,
  3300911131,
  1713906067,
  1641548236,
  4213287313,
  1216130144,
  1575780402,
  4018429277,
  3917837745,
  3693486850,
  3949271944,
  596196993,
  3549867205,
  258830323,
  2213823033,
  772490370,
  2760122372,
  1774776394,
  2652871518,
  566650946,
  4142492826,
  1728879713,
  2882767088,
  1783734482,
  3629395816,
  2517608232,
  2874225571,
  1861159788,
  326777828,
  3124490320,
  2130389656,
  2716951837,
  967770486,
  1724537150,
  2185432712,
  2364442137,
  1164943284,
  2105845187,
  998989502,
  3765401048,
  2244026483,
  1075463327,
  1455516326,
  1322494562,
  910128902,
  469688178,
  1117454909,
  936433444,
  3490320968,
  3675253459,
  1240580251,
  122909385,
  2157517691,
  634681816,
  4142456567,
  3825094682,
  3061402683,
  2540495037,
  79693498,
  3249098678,
  1084186820,
  1583128258,
  426386531,
  1761308591,
  1047286709,
  322548459,
  995290223,
  1845252383,
  2603652396,
  3431023940,
  2942221577,
  3202600964,
  3727903485,
  1712269319,
  422464435,
  3234572375,
  1170764815,
  3523960633,
  3117677531,
  1434042557,
  442511882,
  3600875718,
  1076654713,
  1738483198,
  4213154764,
  2393238008,
  3677496056,
  1014306527,
  4251020053,
  793779912,
  2902807211,
  842905082,
  4246964064,
  1395751752,
  1040244610,
  2656851899,
  3396308128,
  445077038,
  3742853595,
  3577915638,
  679411651,
  2892444358,
  2354009459,
  1767581616,
  3150600392,
  3791627101,
  3102740896,
  284835224,
  4246832056,
  1258075500,
  768725851,
  2589189241,
  3069724005,
  3532540348,
  1274779536,
  3789419226,
  2764799539,
  1660621633,
  3471099624,
  4011903706,
  913787905,
  3497959166,
  737222580,
  2514213453,
  2928710040,
  3937242737,
  1804850592,
  3499020752,
  2949064160,
  2386320175,
  2390070455,
  2415321851,
  4061277028,
  2290661394,
  2416832540,
  1336762016,
  1754252060,
  3520065937,
  3014181293,
  791618072,
  3188594551,
  3933548030,
  2332172193,
  3852520463,
  3043980520,
  413987798,
  3465142937,
  3030929376,
  4245938359,
  2093235073,
  3534596313,
  375366246,
  2157278981,
  2479649556,
  555357303,
  3870105701,
  2008414854,
  3344188149,
  4221384143,
  3956125452,
  2067696032,
  3594591187,
  2921233993,
  2428461,
  544322398,
  577241275,
  1471733935,
  610547355,
  4027169054,
  1432588573,
  1507829418,
  2025931657,
  3646575487,
  545086370,
  48609733,
  2200306550,
  1653985193,
  298326376,
  1316178497,
  3007786442,
  2064951626,
  458293330,
  2589141269,
  3591329599,
  3164325604,
  727753846,
  2179363840,
  146436021,
  1461446943,
  4069977195,
  705550613,
  3059967265,
  3887724982,
  4281599278,
  3313849956,
  1404054877,
  2845806497,
  146425753,
  1854211946,
  1266315497,
  3048417604,
  3681880366,
  3289982499,
  290971e4,
  1235738493,
  2632868024,
  2414719590,
  3970600049,
  1771706367,
  1449415276,
  3266420449,
  422970021,
  1963543593,
  2690192192,
  3826793022,
  1062508698,
  1531092325,
  1804592342,
  2583117782,
  2714934279,
  4024971509,
  1294809318,
  4028980673,
  1289560198,
  2221992742,
  1669523910,
  35572830,
  157838143,
  1052438473,
  1016535060,
  1802137761,
  1753167236,
  1386275462,
  3080475397,
  2857371447,
  1040679964,
  2145300060,
  2390574316,
  1461121720,
  2956646967,
  4031777805,
  4028374788,
  33600511,
  2920084762,
  1018524850,
  629373528,
  3691585981,
  3515945977,
  2091462646,
  2486323059,
  586499841,
  988145025,
  935516892,
  3367335476,
  2599673255,
  2839830854,
  265290510,
  3972581182,
  2759138881,
  3795373465,
  1005194799,
  847297441,
  406762289,
  1314163512,
  1332590856,
  1866599683,
  4127851711,
  750260880,
  613907577,
  1450815602,
  3165620655,
  3734664991,
  3650291728,
  3012275730,
  3704569646,
  1427272223,
  778793252,
  1343938022,
  2676280711,
  2052605720,
  1946737175,
  3164576444,
  3914038668,
  3967478842,
  3682934266,
  1661551462,
  3294938066,
  4011595847,
  840292616,
  3712170807,
  616741398,
  312560963,
  711312465,
  1351876610,
  322626781,
  1910503582,
  271666773,
  2175563734,
  1594956187,
  70604529,
  3617834859,
  1007753275,
  1495573769,
  4069517037,
  2549218298,
  2663038764,
  504708206,
  2263041392,
  3941167025,
  2249088522,
  1514023603,
  1998579484,
  1312622330,
  694541497,
  2582060303,
  2151582166,
  1382467621,
  776784248,
  2618340202,
  3323268794,
  2497899128,
  2784771155,
  503983604,
  4076293799,
  907881277,
  423175695,
  432175456,
  1378068232,
  4145222326,
  3954048622,
  3938656102,
  3820766613,
  2793130115,
  2977904593,
  26017576,
  3274890735,
  3194772133,
  1700274565,
  1756076034,
  4006520079,
  3677328699,
  720338349,
  1533947780,
  354530856,
  688349552,
  3973924725,
  1637815568,
  332179504,
  3949051286,
  53804574,
  2852348879,
  3044236432,
  1282449977,
  3583942155,
  3416972820,
  4006381244,
  1617046695,
  2628476075,
  3002303598,
  1686838959,
  431878346,
  2686675385,
  1700445008,
  1080580658,
  1009431731,
  832498133,
  3223435511,
  2605976345,
  2271191193,
  2516031870,
  1648197032,
  4164389018,
  2548247927,
  300782431,
  375919233,
  238389289,
  3353747414,
  2531188641,
  2019080857,
  1475708069,
  455242339,
  2609103871,
  448939670,
  3451063019,
  1395535956,
  2413381860,
  1841049896,
  1491858159,
  885456874,
  4264095073,
  4001119347,
  1565136089,
  3898914787,
  1108368660,
  540939232,
  1173283510,
  2745871338,
  3681308437,
  4207628240,
  3343053890,
  4016749493,
  1699691293,
  1103962373,
  3625875870,
  2256883143,
  3830138730,
  1031889488,
  3479347698,
  1535977030,
  4236805024,
  3251091107,
  2132092099,
  1774941330,
  1199868427,
  1452454533,
  157007616,
  2904115357,
  342012276,
  595725824,
  1480756522,
  206960106,
  497939518,
  591360097,
  863170706,
  2375253569,
  3596610801,
  1814182875,
  2094937945,
  3421402208,
  1082520231,
  3463918190,
  2785509508,
  435703966,
  3908032597,
  1641649973,
  2842273706,
  3305899714,
  1510255612,
  2148256476,
  2655287854,
  3276092548,
  4258621189,
  236887753,
  3681803219,
  274041037,
  1734335097,
  3815195456,
  3317970021,
  1899903192,
  1026095262,
  4050517792,
  356393447,
  2410691914,
  3873677099,
  3682840055,
  3913112168,
  2491498743,
  4132185628,
  2489919796,
  1091903735,
  1979897079,
  3170134830,
  3567386728,
  3557303409,
  857797738,
  1136121015,
  1342202287,
  507115054,
  2535736646,
  337727348,
  3213592640,
  1301675037,
  2528481711,
  1895095763,
  1721773893,
  3216771564,
  62756741,
  2142006736,
  835421444,
  2531993523,
  1442658625,
  3659876326,
  2882144922,
  676362277,
  1392781812,
  170690266,
  3921047035,
  1759253602,
  3611846912,
  1745797284,
  664899054,
  1329594018,
  3901205900,
  3045908486,
  2062866102,
  2865634940,
  3543621612,
  3464012697,
  1080764994,
  553557557,
  3656615353,
  3996768171,
  991055499,
  499776247,
  1265440854,
  648242737,
  3940784050,
  980351604,
  3713745714,
  1749149687,
  3396870395,
  4211799374,
  3640570775,
  1161844396,
  3125318951,
  1431517754,
  545492359,
  4268468663,
  3499529547,
  1437099964,
  2702547544,
  3433638243,
  2581715763,
  2787789398,
  1060185593,
  1593081372,
  2418618748,
  4260947970,
  69676912,
  2159744348,
  86519011,
  2512459080,
  3838209314,
  1220612927,
  3339683548,
  133810670,
  1090789135,
  1078426020,
  1569222167,
  845107691,
  3583754449,
  4072456591,
  1091646820,
  628848692,
  1613405280,
  3757631651,
  526609435,
  236106946,
  48312990,
  2942717905,
  3402727701,
  1797494240,
  859738849,
  992217954,
  4005476642,
  2243076622,
  3870952857,
  3732016268,
  765654824,
  3490871365,
  2511836413,
  1685915746,
  3888969200,
  1414112111,
  2273134842,
  3281911079,
  4080962846,
  172450625,
  2569994100,
  980381355,
  4109958455,
  2819808352,
  2716589560,
  2568741196,
  3681446669,
  3329971472,
  1835478071,
  660984891,
  3704678404,
  4045999559,
  3422617507,
  3040415634,
  1762651403,
  1719377915,
  3470491036,
  2693910283,
  3642056355,
  3138596744,
  1364962596,
  2073328063,
  1983633131,
  926494387,
  3423689081,
  2150032023,
  4096667949,
  1749200295,
  3328846651,
  309677260,
  2016342300,
  1779581495,
  3079819751,
  111262694,
  1274766160,
  443224088,
  298511866,
  1025883608,
  3806446537,
  1145181785,
  168956806,
  3641502830,
  3584813610,
  1689216846,
  3666258015,
  3200248200,
  1692713982,
  2646376535,
  4042768518,
  1618508792,
  1610833997,
  3523052358,
  4130873264,
  2001055236,
  3610705100,
  2202168115,
  4028541809,
  2961195399,
  1006657119,
  2006996926,
  3186142756,
  1430667929,
  3210227297,
  1314452623,
  4074634658,
  4101304120,
  2273951170,
  1399257539,
  3367210612,
  3027628629,
  1190975929,
  2062231137,
  2333990788,
  2221543033,
  2438960610,
  1181637006,
  548689776,
  2362791313,
  3372408396,
  3104550113,
  3145860560,
  296247880,
  1970579870,
  3078560182,
  3769228297,
  1714227617,
  3291629107,
  3898220290,
  166772364,
  1251581989,
  493813264,
  448347421,
  195405023,
  2709975567,
  677966185,
  3703036547,
  1463355134,
  2715995803,
  1338867538,
  1343315457,
  2802222074,
  2684532164,
  233230375,
  2599980071,
  2000651841,
  3277868038,
  1638401717,
  4028070440,
  3237316320,
  6314154,
  819756386,
  300326615,
  590932579,
  1405279636,
  3267499572,
  3150704214,
  2428286686,
  3959192993,
  3461946742,
  1862657033,
  1266418056,
  963775037,
  2089974820,
  2263052895,
  1917689273,
  448879540,
  3550394620,
  3981727096,
  150775221,
  3627908307,
  1303187396,
  508620638,
  2975983352,
  2726630617,
  1817252668,
  1876281319,
  1457606340,
  908771278,
  3720792119,
  3617206836,
  2455994898,
  1729034894,
  1080033504,
  976866871,
  3556439503,
  2881648439,
  1522871579,
  1555064734,
  1336096578,
  3548522304,
  2579274686,
  3574697629,
  3205460757,
  3593280638,
  3338716283,
  3079412587,
  564236357,
  2993598910,
  1781952180,
  1464380207,
  3163844217,
  3332601554,
  1699332808,
  1393555694,
  1183702653,
  3581086237,
  1288719814,
  691649499,
  2847557200,
  2895455976,
  3193889540,
  2717570544,
  1781354906,
  1676643554,
  2592534050,
  3230253752,
  1126444790,
  2770207658,
  2633158820,
  2210423226,
  2615765581,
  2414155088,
  3127139286,
  673620729,
  2805611233,
  1269405062,
  4015350505,
  3341807571,
  4149409754,
  1057255273,
  2012875353,
  2162469141,
  2276492801,
  2601117357,
  993977747,
  3918593370,
  2654263191,
  753973209,
  36408145,
  2530585658,
  25011837,
  3520020182,
  2088578344,
  530523599,
  2918365339,
  1524020338,
  1518925132,
  3760827505,
  3759777254,
  1202760957,
  3985898139,
  3906192525,
  674977740,
  4174734889,
  2031300136,
  2019492241,
  3983892565,
  4153806404,
  3822280332,
  352677332,
  2297720250,
  60907813,
  90501309,
  3286998549,
  1016092578,
  2535922412,
  2839152426,
  457141659,
  509813237,
  4120667899,
  652014361,
  1966332200,
  2975202805,
  55981186,
  2327461051,
  676427537,
  3255491064,
  2882294119,
  3433927263,
  1307055953,
  942726286,
  933058658,
  2468411793,
  3933900994,
  4215176142,
  1361170020,
  2001714738,
  2830558078,
  3274259782,
  1222529897,
  1679025792,
  2729314320,
  3714953764,
  1770335741,
  151462246,
  3013232138,
  1682292957,
  1483529935,
  471910574,
  1539241949,
  458788160,
  3436315007,
  1807016891,
  3718408830,
  978976581,
  1043663428,
  3165965781,
  1927990952,
  4200891579,
  2372276910,
  3208408903,
  3533431907,
  1412390302,
  2931980059,
  4132332400,
  1947078029,
  3881505623,
  4168226417,
  2941484381,
  1077988104,
  1320477388,
  886195818,
  18198404,
  3786409e3,
  2509781533,
  112762804,
  3463356488,
  1866414978,
  891333506,
  18488651,
  661792760,
  1628790961,
  3885187036,
  3141171499,
  876946877,
  2693282273,
  1372485963,
  791857591,
  2686433993,
  3759982718,
  3167212022,
  3472953795,
  2716379847,
  445679433,
  3561995674,
  3504004811,
  3574258232,
  54117162,
  3331405415,
  2381918588,
  3769707343,
  4154350007,
  1140177722,
  4074052095,
  668550556,
  3214352940,
  367459370,
  261225585,
  2610173221,
  4209349473,
  3468074219,
  3265815641,
  314222801,
  3066103646,
  3808782860,
  282218597,
  3406013506,
  3773591054,
  379116347,
  1285071038,
  846784868,
  2669647154,
  3771962079,
  3550491691,
  2305946142,
  453669953,
  1268987020,
  3317592352,
  3279303384,
  3744833421,
  2610507566,
  3859509063,
  266596637,
  3847019092,
  517658769,
  3462560207,
  3443424879,
  370717030,
  4247526661,
  2224018117,
  4143653529,
  4112773975,
  2788324899,
  2477274417,
  1456262402,
  2901442914,
  1517677493,
  1846949527,
  2295493580,
  3734397586,
  2176403920,
  1280348187,
  1908823572,
  3871786941,
  846861322,
  1172426758,
  3287448474,
  3383383037,
  1655181056,
  3139813346,
  901632758,
  1897031941,
  2986607138,
  3066810236,
  3447102507,
  1393639104,
  373351379,
  950779232,
  625454576,
  3124240540,
  4148612726,
  2007998917,
  544563296,
  2244738638,
  2330496472,
  2058025392,
  1291430526,
  424198748,
  50039436,
  29584100,
  3605783033,
  2429876329,
  2791104160,
  1057563949,
  3255363231,
  3075367218,
  3463963227,
  1469046755,
  985887462
];
var C_ORIG = [
  1332899944,
  1700884034,
  1701343084,
  1684370003,
  1668446532,
  1869963892
];
function _encipher(lr, off, P, S) {
  var n, l = lr[off], r = lr[off + 1];
  l ^= P[0];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[1];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[2];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[3];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[4];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[5];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[6];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[7];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[8];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[9];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[10];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[11];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[12];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[13];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[14];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[15];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[16];
  lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
  lr[off + 1] = l;
  return lr;
}
function _streamtoword(data, offp) {
  for (var i = 0, word = 0; i < 4; ++i)
    word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
  return { key: word, offp };
}
function _key(key, P, S) {
  var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
  for (i = 0; i < plen; i += 2)
    lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
function _ekskey(data, key, P, S) {
  var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
  offp = 0;
  for (i = 0; i < plen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
function _crypt(b, salt, rounds, callback, progressCallback) {
  var cdata = C_ORIG.slice(), clen = cdata.length, err;
  if (rounds < 4 || rounds > 31) {
    err = Error("Illegal number of rounds (4-31): " + rounds);
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.length !== BCRYPT_SALT_LEN) {
    err = Error(
      "Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN
    );
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  rounds = 1 << rounds >>> 0;
  var P, S, i = 0, j;
  if (typeof Int32Array === "function") {
    P = new Int32Array(P_ORIG);
    S = new Int32Array(S_ORIG);
  } else {
    P = P_ORIG.slice();
    S = S_ORIG.slice();
  }
  _ekskey(salt, b, P, S);
  function next() {
    if (progressCallback) progressCallback(i / rounds);
    if (i < rounds) {
      var start = Date.now();
      for (; i < rounds; ) {
        i = i + 1;
        _key(b, P, S);
        _key(salt, P, S);
        if (Date.now() - start > MAX_EXECUTION_TIME) break;
      }
    } else {
      for (i = 0; i < 64; i++)
        for (j = 0; j < clen >> 1; j++) _encipher(cdata, j << 1, P, S);
      var ret = [];
      for (i = 0; i < clen; i++)
        ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
      if (callback) {
        callback(null, ret);
        return;
      } else return ret;
    }
    if (callback) nextTick(next);
  }
  if (typeof callback !== "undefined") {
    next();
  } else {
    var res;
    while (true) if (typeof (res = next()) !== "undefined") return res || [];
  }
}
function _hash(password, salt, callback, progressCallback) {
  var err;
  if (typeof password !== "string" || typeof salt !== "string") {
    err = Error("Invalid string / salt: Not a string");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var minor, offset;
  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    err = Error("Invalid salt version: " + salt.substring(0, 2));
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
  else {
    minor = salt.charAt(2);
    if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
      err = Error("Invalid salt revision: " + salt.substring(2, 4));
      if (callback) {
        nextTick(callback.bind(this, err));
        return;
      } else throw err;
    }
    offset = 4;
  }
  if (salt.charAt(offset + 2) > "$") {
    err = Error("Missing salt rounds");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
  password += minor >= "a" ? "\0" : "";
  var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
  function finish(bytes) {
    var res = [];
    res.push("$2");
    if (minor >= "a") res.push(minor);
    res.push("$");
    if (rounds < 10) res.push("0");
    res.push(rounds.toString());
    res.push("$");
    res.push(base64_encode(saltb, saltb.length));
    res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
    return res.join("");
  }
  if (typeof callback == "undefined")
    return finish(_crypt(passwordb, saltb, rounds));
  else {
    _crypt(
      passwordb,
      saltb,
      rounds,
      function(err2, bytes) {
        if (err2) callback(err2, null);
        else callback(null, finish(bytes));
      },
      progressCallback
    );
  }
}

// src/lib/crypto-utils.ts
function hashPassword(password) {
  return hashSync(password, 12);
}
function verifyPassword(password, passwordHash) {
  if (passwordHash.startsWith("$2")) return compareSync(password, passwordHash);
  const legacyHash = (0, import_crypto3.createHash)("sha256").update(`mesaflow:${password}`).digest("hex");
  return passwordHash === legacyHash;
}
function id(prefix = "") {
  return `${prefix}${(0, import_crypto3.randomBytes)(8).toString("hex")}`;
}
function sessionToken() {
  return (0, import_crypto3.randomBytes)(32).toString("hex");
}

// src/lib/events.ts
var listeners = /* @__PURE__ */ new Map();
function emit(event) {
  const set = listeners.get(event.establishmentId);
  if (!set) return;
  for (const fn of set) fn(event);
}

// src/lib/order-math.ts
function lineTotal(item) {
  const addons = item.addons.reduce((s, a) => s + a.price * a.qty, 0);
  return item.qty * (item.unitPrice + item.variantDelta) + addons;
}

// src/lib/product-images.ts
var PEXELS_Q = "auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
function pexels(id2, slug = "pexels-photo") {
  return `https://images.pexels.com/photos/${id2}/${slug}-${id2}.jpeg?${PEXELS_Q}`;
}
function unsplash(id2) {
  return `https://images.unsplash.com/photo-${id2}?w=800&h=600&q=80&auto=format&fit=crop`;
}
var PRODUCT_IMAGES = {
  p_xburger: pexels(1639562),
  // hambúrguer artesanal
  p_xsalada: pexels(1279330),
  // burger com salada
  p_pizza_calabresa: unsplash("1513104890138-7c749659a591"),
  // pizza calabresa
  p_pizza_frango: pexels(2983101),
  // pizza de frango
  p_pizza_marg: unsplash("1565299624946-b28f40a0ae38"),
  // pizza margherita
  p_pizza_pepper: unsplash("1604382354936-07c5d9983bd3"),
  // pizza pepperoni
  p_batata: pexels(1581384),
  // batata frita
  p_coxinha: pexels(4518843),
  // salgado / coxinha
  p_coca: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  // coca-cola lata
  p_cappuccino: unsplash("1572442388796-11668a67e53d"),
  // cappuccino com latte art
  p_chopp: pexels(15515325),
  // chopp / cerveja na torneira
  p_caipirinha: pexels(2097090),
  // caipirinha / coquetel
  p_pudim: unsplash("1551024506-0bccd828d307"),
  // pudim de leite
  p_brownie: pexels(1624487),
  // brownie com sorvete
  p_salada: unsplash("1512621776951-a57141f2eefd")
  // salada fresca
};
var FOOD_PRESETS = {
  burger: pexels(1639562),
  xsalada: pexels(1279330),
  pizza: unsplash("1513104890138-7c749659a591"),
  prato: unsplash("1504674900247-0877df9cc836"),
  padaria: pexels(5632401),
  porcao: pexels(1581384),
  bebida: pexels(50593, "coca-cola-cold-drink-soft-drink-coke"),
  cafe: unsplash("1495474472287-4d71bcdd2085"),
  default: pexels(1893556)
};
function productImage(id2, fallback = "default") {
  if (PRODUCT_IMAGES[id2]) return PRODUCT_IMAGES[id2];
  if (fallback in FOOD_PRESETS) return FOOD_PRESETS[fallback];
  return FOOD_PRESETS.default;
}
function productImageByName(name, preset = "default") {
  const n = name.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (n.includes("x-salada") || n.includes("x salada")) return FOOD_PRESETS.xsalada;
  if (n.includes("burger") || n.includes("x-burger") || n.includes("hamburguer")) return FOOD_PRESETS.burger;
  if (n.includes("pizza") || n.includes("calabresa") || n.includes("pepperoni") || n.includes("marguerita") || n.includes("margherita")) {
    if (n.includes("pepperoni")) return PRODUCT_IMAGES.p_pizza_pepper;
    if (n.includes("marguerita") || n.includes("margherita")) return PRODUCT_IMAGES.p_pizza_marg;
    if (n.includes("frango")) return PRODUCT_IMAGES.p_pizza_frango;
    return PRODUCT_IMAGES.p_pizza_calabresa;
  }
  if (n.includes("coxinha") || n.includes("salgado")) return PRODUCT_IMAGES.p_coxinha;
  if (n.includes("pao") || n.includes("padaria") || n.includes("croissant")) return FOOD_PRESETS.padaria;
  if (n.includes("batata") || n.includes("porcao")) return FOOD_PRESETS.porcao;
  if (n.includes("refrigerante") || n.includes("coca") || n.includes("suco")) return FOOD_PRESETS.bebida;
  if (n.includes("cappuccino") || n.includes("capuccino")) return PRODUCT_IMAGES.p_cappuccino;
  if (n.includes("cafe") || n.includes("espresso") || n.includes("expresso") || n.includes("latte")) return FOOD_PRESETS.cafe;
  if (n.includes("chopp") || n.includes("cerveja")) return pexels(15515325);
  if (n.includes("caipirinha") || n.includes("drink")) return pexels(2097090);
  if (n.includes("pudim") || n.includes("flan")) return PRODUCT_IMAGES.p_pudim;
  if (n.includes("brownie") || n.includes("bolo") || n.includes("sobremesa") || n.includes("doce")) return PRODUCT_IMAGES.p_brownie;
  if (n.includes("salada")) return unsplash("1512621776951-a57141f2eefd");
  if (n.includes("prato")) return FOOD_PRESETS.prato;
  return FOOD_PRESETS[preset] ?? FOOD_PRESETS.default;
}

// src/lib/provision.ts
var import_crypto4 = require("crypto");

// src/lib/operation-modes.ts
var OPERATION_MODES = [
  {
    value: "a_la_carte",
    label: "\xC0 la carte",
    description: "Pedidos por item no card\xE1pio, cobrados na conta da mesa."
  },
  {
    value: "rodizio",
    label: "Rod\xEDzio",
    description: "Rodadas de itens com pre\xE7o por pessoa."
  },
  {
    value: "buffet",
    label: "Buffet",
    description: "Buffet livre ou por valor fixo."
  },
  {
    value: "self_service",
    label: "Self-service",
    description: "Cliente se serve e paga na sa\xEDda."
  },
  {
    value: "peso_kg",
    label: "Por quilo",
    description: "Cobran\xE7a por peso (kg)."
  },
  {
    value: "comanda",
    label: "Comanda",
    description: "Cada cliente identifica-se com n\xFAmero de comanda."
  },
  {
    value: "personalizado",
    label: "Personalizado",
    description: "Fluxo sob medida do estabelecimento."
  },
  {
    value: "outros",
    label: "Outros",
    description: "Outro modelo operacional."
  }
];
var OPERATION_MODE_VALUES = new Set(
  OPERATION_MODES.map((mode) => mode.value)
);
function isOperationMode(value) {
  return typeof value === "string" && OPERATION_MODE_VALUES.has(value);
}
function resolveOperationMode(establishment) {
  return establishment?.operationMode || "a_la_carte";
}

// src/lib/provision.ts
function slugify(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
function uniqueSlug(store, base) {
  let slug = slugify(base) || "estabelecimento";
  let n = 0;
  while (Object.values(store.establishments).some((e) => e.slug === slug)) {
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}
function uniqueQrToken(store, pending) {
  let token = (0, import_crypto4.randomBytes)(32).toString("hex");
  while (Object.values(store.tables).some((table) => table.qrToken === token) || Object.values(pending).some((table) => table.qrToken === token)) {
    token = (0, import_crypto4.randomBytes)(32).toString("hex");
  }
  return token;
}
var TYPE_LABELS = {
  restaurante: "Restaurante",
  lanchonete: "Lanchonete",
  padaria: "Padaria",
  bar: "Bar",
  cafeteria: "Cafeteria",
  rodizio: "Rod\xEDzio"
};
function provisionEstablishment(store, input) {
  const estId = id("est_");
  const slug = uniqueSlug(store, input.businessName);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const typeLabel = TYPE_LABELS[input.businessType];
  const operationMode = input.operationMode && isOperationMode(input.operationMode) && input.operationMode || (input.businessType === "rodizio" ? "rodizio" : "a_la_carte");
  const establishment = {
    id: estId,
    slug,
    name: input.businessName,
    tagline: `${typeLabel} \xB7 atendimento por mesa`,
    logo: "\u{1F37D}\uFE0F",
    open: true,
    rodizioEnabled: operationMode === "rodizio" || input.businessType === "rodizio",
    businessType: input.businessType,
    operationMode,
    settings: {
      currency: "BRL",
      allowEditAfterPrep: false,
      soundNotifications: true,
      minIntervalRodizioSec: 120,
      otpRequired: true
    },
    plan: "essencial",
    planStartedAt: now,
    platformStatus: "active",
    createdAt: now
  };
  const user = {
    id: id("user_"),
    establishmentId: estId,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.ownerName,
    role: "OWNER",
    active: true
  };
  const secCozinha = id("sec_");
  const sectors = {
    [secCozinha]: {
      id: secCozinha,
      establishmentId: estId,
      name: "Cozinha",
      kind: "COZINHA",
      color: "#f97316",
      active: true
    }
  };
  const secBalcao = id("sec_");
  sectors[secBalcao] = {
    id: secBalcao,
    establishmentId: estId,
    name: "Balc\xE3o",
    kind: "BALCAO",
    color: "#3b82f6",
    active: true
  };
  let secBar = secBalcao;
  if (["bar", "restaurante", "rodizio"].includes(input.businessType)) {
    secBar = id("sec_");
    sectors[secBar] = {
      id: secBar,
      establishmentId: estId,
      name: "Bar",
      kind: "BAR",
      color: "#a855f7",
      active: true
    };
  }
  const catPrincipal = id("cat_");
  const catBebida = id("cat_");
  const categories = {
    [catPrincipal]: {
      id: catPrincipal,
      establishmentId: estId,
      name: input.businessType === "padaria" ? "Padaria" : "Pratos",
      emoji: input.businessType === "padaria" ? "\u{1F950}" : "\u{1F37D}\uFE0F",
      sortOrder: 1,
      active: true
    },
    [catBebida]: {
      id: catBebida,
      establishmentId: estId,
      name: "Bebidas",
      emoji: "\u{1F964}",
      sortOrder: 2,
      active: true
    }
  };
  const p1 = id("p_");
  const p2 = id("p_");
  const p3 = id("p_");
  const products = {
    [p1]: {
      id: p1,
      establishmentId: estId,
      categoryId: catPrincipal,
      sectorId: secCozinha,
      name: input.businessType === "padaria" ? "P\xE3o na Chapa" : "Prato do Dia",
      description: "Edite este item no painel quando o CRUD estiver dispon\xEDvel.",
      price: 29.9,
      image: input.businessType === "padaria" ? FOOD_PRESETS.padaria : productImage("p_xburger", "prato"),
      tags: ["destaque"],
      prepMinutes: 15,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    [p2]: {
      id: p2,
      establishmentId: estId,
      categoryId: catPrincipal,
      sectorId: secCozinha,
      name: input.businessType === "lanchonete" ? "X-Salada" : "Por\xE7\xE3o Especial",
      description: "Item de exemplo \u2014 personalize no card\xE1pio.",
      price: 24.9,
      image: productImageByName(
        input.businessType === "lanchonete" ? "X-Salada" : "Por\xE7\xE3o Especial",
        "porcao"
      ),
      tags: [],
      prepMinutes: 12,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    [p3]: {
      id: p3,
      establishmentId: estId,
      categoryId: catBebida,
      sectorId: secBalcao,
      name: "Refrigerante Lata",
      description: "350ml gelado.",
      price: 8.9,
      image: FOOD_PRESETS.bebida,
      tags: [],
      prepMinutes: 1,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    }
  };
  const tables = {};
  const count = Math.min(20, Math.max(3, input.tableCount || 5));
  for (let i = 1; i <= count; i++) {
    const tid = id("tbl_");
    tables[tid] = {
      id: tid,
      establishmentId: estId,
      number: String(i).padStart(2, "0"),
      name: `Mesa ${String(i).padStart(2, "0")}`,
      capacity: i <= 4 ? 4 : 6,
      status: "LIVRE",
      qrToken: uniqueQrToken(store, tables)
    };
  }
  const rodizios = {};
  if (input.businessType === "rodizio") {
    const rid = id("rod_");
    rodizios[rid] = {
      id: rid,
      establishmentId: estId,
      name: "Rod\xEDzio",
      pricePerPerson: 59.9,
      durationMinutes: 90,
      maxItemsPerRound: 6,
      maxRounds: 8,
      minIntervalSec: 120,
      drinksIncluded: false,
      active: true,
      productIds: [p1, p2],
      premiumProductIds: []
    };
  }
  store.establishments[estId] = establishment;
  store.users[user.id] = user;
  Object.assign(store.sectors, sectors);
  Object.assign(store.categories, categories);
  Object.assign(store.products, products);
  Object.assign(store.tables, tables);
  Object.assign(store.rodizios, rodizios);
  store.orderCounter[estId] = 1e3;
  return { establishment, user, slug };
}

// src/lib/demo.ts
var DEMO_ESTABLISHMENT_SLUG = "ponto-do-sabor";
var DEMO_ESTABLISHMENT_ID = "est_ponto_sabor";
var PLATFORM_OWNER_LOGIN = {
  email: process.env.MESAFLOW_PLATFORM_OWNER_EMAIL || "octavio@namesa.io",
  password: process.env.MESAFLOW_PLATFORM_OWNER_PASSWORD || "namesa-platform-dev"
};

// src/lib/seed.ts
var EST_ID = DEMO_ESTABLISHMENT_ID;
var DEMO_SLUG = DEMO_ESTABLISHMENT_SLUG;
function buildDemoStore() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const sectors = {
    sec_cozinha: {
      id: "sec_cozinha",
      establishmentId: EST_ID,
      name: "Cozinha",
      kind: "COZINHA",
      color: "#f97316",
      active: true
    },
    sec_balcao: {
      id: "sec_balcao",
      establishmentId: EST_ID,
      name: "Balc\xE3o",
      kind: "BALCAO",
      color: "#3b82f6",
      active: true
    },
    sec_bar: {
      id: "sec_bar",
      establishmentId: EST_ID,
      name: "Bar",
      kind: "BAR",
      color: "#a855f7",
      active: true
    }
  };
  const categories = {
    cat_burger: { id: "cat_burger", establishmentId: EST_ID, name: "Hamb\xFArgueres", emoji: "\u{1F354}", sortOrder: 1, active: true },
    cat_pizza: { id: "cat_pizza", establishmentId: EST_ID, name: "Pizzas", emoji: "\u{1F355}", sortOrder: 2, active: true },
    cat_porcao: { id: "cat_porcao", establishmentId: EST_ID, name: "Por\xE7\xF5es", emoji: "\u{1F35F}", sortOrder: 3, active: true },
    cat_bebida: { id: "cat_bebida", establishmentId: EST_ID, name: "Bebidas", emoji: "\u{1F964}", sortOrder: 4, active: true },
    cat_doce: { id: "cat_doce", establishmentId: EST_ID, name: "Sobremesas", emoji: "\u{1F370}", sortOrder: 5, active: true },
    cat_rodizio: { id: "cat_rodizio", establishmentId: EST_ID, name: "Rod\xEDzio", emoji: "\u{1F525}", sortOrder: 6, active: true }
  };
  const products = {
    p_xburger: {
      id: "p_xburger",
      establishmentId: EST_ID,
      categoryId: "cat_burger",
      sectorId: "sec_cozinha",
      name: "X-Burger Artesanal",
      description: "Blend 180g, queijo prato, molho da casa e p\xE3o brioche.",
      price: 32.9,
      image: productImage("p_xburger"),
      tags: ["destaque"],
      prepMinutes: 18,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [
        { id: "v_simples", name: "Simples", priceDelta: 0 },
        { id: "v_duplo", name: "Duplo", priceDelta: 14 }
      ],
      addons: [
        { id: "a_bacon", name: "Bacon", price: 6 },
        { id: "a_cheddar", name: "Cheddar", price: 5 }
      ],
      bumpProductIds: ["p_coca", "p_batata"],
      upsellProductIds: ["p_chopp"],
      rodizioIncluded: false
    },
    p_xsalada: {
      id: "p_xsalada",
      establishmentId: EST_ID,
      categoryId: "cat_burger",
      sectorId: "sec_cozinha",
      name: "X-Salada Premium",
      description: "Hamb\xFArguer com salada fresca, tomate e cebola roxa.",
      price: 36.9,
      image: productImage("p_xsalada"),
      tags: [],
      prepMinutes: 20,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [{ id: "a_ovo", name: "Ovo", price: 4 }],
      bumpProductIds: ["p_coca", "p_salada"],
      upsellProductIds: ["p_pudim"],
      rodizioIncluded: false
    },
    p_pizza_calabresa: {
      id: "p_pizza_calabresa",
      establishmentId: EST_ID,
      categoryId: "cat_pizza",
      sectorId: "sec_cozinha",
      name: "Pizza Calabresa",
      description: "Massa fina, calabresa fatiada e cebola.",
      price: 54.9,
      image: productImage("p_pizza_calabresa"),
      tags: ["rod\xEDzio"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [
        { id: "v_p", name: "Broto", priceDelta: -12 },
        { id: "v_g", name: "Grande", priceDelta: 18 }
      ],
      addons: [{ id: "a_borda_cat", name: "Borda catupiry", price: 12 }],
      bumpProductIds: ["p_chopp", "p_coca"],
      upsellProductIds: ["p_brownie"],
      rodizioIncluded: true
    },
    p_pizza_frango: {
      id: "p_pizza_frango",
      establishmentId: EST_ID,
      categoryId: "cat_pizza",
      sectorId: "sec_cozinha",
      name: "Frango com Catupiry",
      description: "Cl\xE1ssica da casa com frango desfiado.",
      price: 56.9,
      image: productImage("p_pizza_frango"),
      tags: ["rod\xEDzio"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: true,
      rodizioPremiumPrice: 9.9
    },
    p_pizza_marg: {
      id: "p_pizza_marg",
      establishmentId: EST_ID,
      categoryId: "cat_pizza",
      sectorId: "sec_cozinha",
      name: "Marguerita",
      description: "Molho de tomate, mussarela e manjeric\xE3o.",
      price: 49.9,
      image: productImage("p_pizza_marg"),
      tags: ["rod\xEDzio"],
      prepMinutes: 22,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: true
    },
    p_batata: {
      id: "p_batata",
      establishmentId: EST_ID,
      categoryId: "cat_porcao",
      sectorId: "sec_cozinha",
      name: "Batata Frita Grande",
      description: "Por\xE7\xE3o generosa com alecrim e parmes\xE3o.",
      price: 28.9,
      image: productImage("p_batata"),
      tags: [],
      prepMinutes: 12,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [{ id: "a_cheddar_bat", name: "Cheddar", price: 8 }],
      rodizioIncluded: false
    },
    p_coxinha: {
      id: "p_coxinha",
      establishmentId: EST_ID,
      categoryId: "cat_porcao",
      sectorId: "sec_balcao",
      name: "Coxinha de Frango",
      description: "Massa crocante, recheio cremoso (unidade).",
      price: 9.9,
      image: productImage("p_coxinha"),
      tags: [],
      prepMinutes: 5,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_coca: {
      id: "p_coca",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_balcao",
      name: "Coca-Cola Lata",
      description: "350ml gelada.",
      price: 8.9,
      image: productImage("p_coca"),
      tags: [],
      prepMinutes: 1,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_cappuccino: {
      id: "p_cappuccino",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_balcao",
      name: "Cappuccino",
      description: "Espresso, leite vaporizado e espuma.",
      price: 14.9,
      image: productImage("p_cappuccino"),
      tags: [],
      prepMinutes: 6,
      availability: "SOB_DEMANDA",
      featured: true,
      active: true,
      variants: [
        { id: "v_p", name: "Pequeno", priceDelta: 0 },
        { id: "v_g", name: "Grande", priceDelta: 4 }
      ],
      addons: [
        { id: "a_leite_amend", name: "Leite de am\xEAndoas", price: 3 },
        { id: "a_chantilly", name: "Chantilly", price: 2 }
      ],
      rodizioIncluded: false
    },
    p_chopp: {
      id: "p_chopp",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_bar",
      name: "Chopp Artesanal",
      description: "300ml da torneira.",
      price: 16.9,
      image: productImage("p_chopp"),
      tags: [],
      prepMinutes: 2,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [{ id: "v_500", name: "500ml", priceDelta: 8 }],
      addons: [],
      rodizioIncluded: false
    },
    p_caipirinha: {
      id: "p_caipirinha",
      establishmentId: EST_ID,
      categoryId: "cat_bebida",
      sectorId: "sec_bar",
      name: "Caipirinha",
      description: "Lim\xE3o, cacha\xE7a e gelo.",
      price: 22.9,
      image: productImage("p_caipirinha"),
      tags: [],
      prepMinutes: 5,
      availability: "SOB_DEMANDA",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_pudim: {
      id: "p_pudim",
      establishmentId: EST_ID,
      categoryId: "cat_doce",
      sectorId: "sec_balcao",
      name: "Pudim de Leite",
      description: "Receita da v\xF3, calda caramelizada.",
      price: 18.9,
      image: productImage("p_pudim"),
      tags: [],
      prepMinutes: 3,
      availability: "VITRINE",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_brownie: {
      id: "p_brownie",
      establishmentId: EST_ID,
      categoryId: "cat_doce",
      sectorId: "sec_balcao",
      name: "Brownie com Sorvete",
      description: "Chocolate belga e sorvete de creme.",
      price: 24.9,
      image: productImage("p_brownie"),
      tags: [],
      prepMinutes: 5,
      availability: "SOB_DEMANDA",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    },
    p_pizza_pepper: {
      id: "p_pizza_pepper",
      establishmentId: EST_ID,
      categoryId: "cat_rodizio",
      sectorId: "sec_cozinha",
      name: "Pizza Pepperoni",
      description: "Pepperoni importado e mussarela.",
      price: 59.9,
      image: productImage("p_pizza_pepper"),
      tags: ["rod\xEDzio", "premium"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: true,
      rodizioPremiumPrice: 9.9
    },
    p_salada: {
      id: "p_salada",
      establishmentId: EST_ID,
      categoryId: "cat_porcao",
      sectorId: "sec_cozinha",
      name: "Salada da Casa",
      description: "Mix de folhas, tomate cereja e molho bals\xE2mico.",
      price: 26.9,
      image: productImage("p_salada"),
      tags: [],
      prepMinutes: 8,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false
    }
  };
  const tables = {};
  for (let i = 1; i <= 10; i++) {
    const tid = `tbl_${i}`;
    tables[tid] = {
      id: tid,
      establishmentId: EST_ID,
      number: String(i).padStart(2, "0"),
      name: `Mesa ${String(i).padStart(2, "0")}`,
      capacity: i <= 4 ? 4 : i <= 7 ? 6 : 8,
      status: i === 4 || i === 8 ? "OCUPADA" : i === 3 ? "AGUARDANDO_PAGAMENTO" : "LIVRE",
      qrToken: `mesa-${i}`
    };
  }
  const cmd4 = {
    id: "cmd_demo_4",
    establishmentId: EST_ID,
    tableId: "tbl_4",
    openedAt: new Date(Date.now() - 45 * 6e4).toISOString(),
    status: "ABERTA",
    guestCount: 4,
    total: 0
  };
  tables.tbl_4.commandId = cmd4.id;
  const cmd8 = {
    id: "cmd_demo_8",
    establishmentId: EST_ID,
    tableId: "tbl_8",
    openedAt: new Date(Date.now() - 20 * 6e4).toISOString(),
    status: "ABERTA",
    guestCount: 2,
    total: 0
  };
  tables.tbl_8.commandId = cmd8.id;
  function demoItem(productId, qty, status = "EM_PREPARO", notes) {
    const p = products[productId];
    const sec = sectors[p.sectorId];
    return {
      id: id("oi_"),
      productId: p.id,
      productName: p.name,
      sectorId: p.sectorId,
      sectorName: sec.name,
      qty,
      unitPrice: p.price,
      variantDelta: 0,
      addons: [],
      notes,
      status
    };
  }
  const demoOrders = [
    {
      id: "ord_demo_1",
      establishmentId: EST_ID,
      tableId: "tbl_8",
      tableNumber: "08",
      commandId: cmd8.id,
      guestParticipationId: `gp_legacy_${cmd8.id}`,
      number: 1294,
      status: "EM_PREPARO",
      items: [demoItem("p_xburger", 2, "EM_PREPARO", "1 sem cebola"), demoItem("p_batata", 1)],
      total: 94.7,
      source: "MESA",
      createdAt: new Date(Date.now() - 4 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ord_demo_2",
      establishmentId: EST_ID,
      tableId: "tbl_4",
      tableNumber: "04",
      commandId: cmd4.id,
      guestParticipationId: `gp_legacy_${cmd4.id}`,
      number: 1293,
      status: "NOVO",
      items: [demoItem("p_cappuccino", 2), demoItem("p_coxinha", 1)],
      total: 39.7,
      source: "MESA",
      createdAt: new Date(Date.now() - 1 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ord_demo_3",
      establishmentId: EST_ID,
      tableId: "tbl_4",
      tableNumber: "04",
      commandId: cmd4.id,
      guestParticipationId: `gp_legacy_${cmd4.id}`,
      number: 1290,
      status: "PRONTO",
      items: [demoItem("p_chopp", 2), demoItem("p_caipirinha", 1)],
      total: 56.7,
      source: "MESA",
      createdAt: new Date(Date.now() - 18 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ord_demo_4",
      establishmentId: EST_ID,
      tableId: "tbl_4",
      tableNumber: "04",
      commandId: cmd4.id,
      guestParticipationId: `gp_legacy_${cmd4.id}`,
      number: 1288,
      status: "ENTREGUE",
      items: [demoItem("p_pizza_calabresa", 1), demoItem("p_salada", 1)],
      total: 81.8,
      source: "MESA",
      createdAt: new Date(Date.now() - 55 * 6e4).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  cmd4.total = demoOrders.filter((o) => o.commandId === cmd4.id).reduce((s, o) => s + o.total, 0);
  cmd8.total = demoOrders.filter((o) => o.commandId === cmd8.id).reduce((s, o) => s + o.total, 0);
  const guestParticipations = {
    gp_demo_4a: {
      id: "gp_demo_4a",
      establishmentId: EST_ID,
      commandId: cmd4.id,
      tableId: "tbl_4",
      phoneLookupHash: "demo_hash_4a",
      phoneDisplay: "+55 ** *****-1001",
      displayName: "Ana",
      participantIndex: 1,
      status: "OPEN",
      joinedAt: new Date(Date.now() - 40 * 6e4).toISOString(),
      verifiedAt: new Date(Date.now() - 40 * 6e4).toISOString(),
      orderCount: 2,
      lastOrderAt: demoOrders[1]?.createdAt
    },
    gp_demo_4b: {
      id: "gp_demo_4b",
      establishmentId: EST_ID,
      commandId: cmd4.id,
      tableId: "tbl_4",
      phoneLookupHash: "demo_hash_4b",
      phoneDisplay: "+55 ** *****-1002",
      displayName: "Bruno",
      participantIndex: 2,
      status: "OPEN",
      joinedAt: new Date(Date.now() - 35 * 6e4).toISOString(),
      verifiedAt: new Date(Date.now() - 35 * 6e4).toISOString(),
      orderCount: 1,
      lastOrderAt: demoOrders[2]?.createdAt
    },
    gp_demo_8a: {
      id: "gp_demo_8a",
      establishmentId: EST_ID,
      commandId: cmd8.id,
      tableId: "tbl_8",
      phoneLookupHash: "demo_hash_8a",
      phoneDisplay: "+55 ** *****-2001",
      displayName: "Carla",
      participantIndex: 1,
      status: "OPEN",
      joinedAt: new Date(Date.now() - 15 * 6e4).toISOString(),
      verifiedAt: new Date(Date.now() - 15 * 6e4).toISOString(),
      orderCount: 1,
      lastOrderAt: demoOrders[0]?.createdAt
    }
  };
  demoOrders[0].guestParticipationId = "gp_demo_8a";
  demoOrders[1].guestParticipationId = "gp_demo_4a";
  demoOrders[2].guestParticipationId = "gp_demo_4b";
  demoOrders[3].guestParticipationId = "gp_demo_4a";
  return {
    establishments: {
      [EST_ID]: {
        id: EST_ID,
        slug: DEMO_SLUG,
        name: "Ponto do Sabor",
        tagline: "Seu pedido, sem espera.",
        logo: "\u{1F37D}\uFE0F",
        open: true,
        rodizioEnabled: true,
        businessType: "rodizio",
        operationMode: "rodizio",
        plan: "premium",
        planStartedAt: now,
        platformStatus: "active",
        settings: {
          currency: "BRL",
          allowEditAfterPrep: false,
          soundNotifications: true,
          minIntervalRodizioSec: 120,
          otpRequired: true
        },
        createdAt: now
      }
    },
    sessions: {},
    platformUsers: {
      plat_octavio: {
        id: "plat_octavio",
        email: PLATFORM_OWNER_LOGIN.email.toLowerCase(),
        passwordHash: hashPassword(PLATFORM_OWNER_LOGIN.password),
        name: "Octavio Pucci",
        role: "PLATFORM_OWNER",
        active: true,
        createdAt: now
      }
    },
    users: {
      user_owner: {
        id: "user_owner",
        establishmentId: EST_ID,
        email: "owner@pontodosabor.com",
        passwordHash: hashPassword("demo123"),
        name: "Carlos Mendes",
        role: "OWNER",
        active: true
      },
      user_waiter: {
        id: "user_waiter",
        establishmentId: EST_ID,
        email: "garcom@pontodosabor.com",
        passwordHash: hashPassword("demo123"),
        name: "Jo\xE3o Gar\xE7om",
        role: "WAITER",
        active: true
      }
    },
    sectors,
    categories,
    products,
    tables,
    commands: { [cmd4.id]: cmd4, [cmd8.id]: cmd8 },
    orders: Object.fromEntries(demoOrders.map((o) => [o.id, o])),
    rodizios: {
      rod_pizza: {
        id: "rod_pizza",
        establishmentId: EST_ID,
        name: "Rod\xEDzio de Pizza",
        pricePerPerson: 59.9,
        durationMinutes: 90,
        maxItemsPerRound: 6,
        maxRounds: 8,
        minIntervalSec: 120,
        drinksIncluded: false,
        active: true,
        productIds: ["p_pizza_calabresa", "p_pizza_frango", "p_pizza_marg", "p_pizza_pepper"],
        premiumProductIds: ["p_pizza_frango", "p_pizza_pepper"]
      }
    },
    rodizioRounds: {},
    notifications: {},
    closingRequests: {},
    orderItemSplits: {},
    payments: {},
    integrationConnections: {},
    auditEvents: {},
    orderCounter: { [EST_ID]: 1294 },
    guestParticipations,
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {}
  };
}

// src/lib/accounting.ts
function getParticipantItemTotal(orders, splits, guestParticipationId) {
  const splitMap = /* @__PURE__ */ new Map();
  for (const split of splits) {
    const list2 = splitMap.get(split.orderItemId) ?? [];
    list2.push(split);
    splitMap.set(split.orderItemId, list2);
  }
  let total = 0;
  for (const order of orders) {
    for (const item of order.items) {
      const itemSplits = splitMap.get(item.id) ?? [];
      const participantSplit = itemSplits.find(
        (split) => split.guestParticipationId === guestParticipationId
      );
      if (participantSplit) {
        const lineTotalValue = lineTotal(item);
        const unitShare = item.qty > 0 ? lineTotalValue / item.qty : 0;
        total += unitShare * participantSplit.quantity;
        continue;
      }
      if (itemSplits.length === 0 && order.guestParticipationId === guestParticipationId) {
        total += lineTotal(item);
      }
    }
  }
  return total;
}
function getCommandTotal(orders) {
  return orders.filter((order) => order.status !== "CANCELADO").reduce((sum, order) => sum + order.total, 0);
}
function getParticipantPaidTotal(payments, guestParticipationId) {
  return payments.filter(
    (payment) => payment.status === "registered" && payment.guestParticipationId === guestParticipationId
  ).reduce((sum, payment) => sum + payment.amount, 0);
}
function getCommandPaidTotal(payments) {
  return payments.filter((payment) => payment.status === "registered").reduce((sum, payment) => sum + payment.amount, 0);
}

// src/lib/closing.ts
function buildClosingSummary(orders, participations, splits, payments) {
  const activeOrders = orders.filter((order) => order.status !== "CANCELADO");
  const commandTotal = getCommandTotal(activeOrders);
  const paidTotal = getCommandPaidTotal(payments);
  const remainingTotal = Math.max(0, commandTotal - paidTotal);
  const participants = participations.map((participation) => {
    const itemTotal = getParticipantItemTotal(activeOrders, splits, participation.id);
    const participantPaid = getParticipantPaidTotal(payments, participation.id);
    const participantRemaining = Math.max(0, itemTotal - participantPaid);
    const displayName = participation.displayName?.trim() || `Participante ${participation.participantIndex}`;
    return {
      guestParticipationId: participation.id,
      displayName,
      itemTotal,
      paidTotal: participantPaid,
      remainingTotal: participantRemaining,
      isSettled: participantRemaining <= 9e-3
    };
  });
  const canSettle = remainingTotal <= 9e-3 && participants.every((participant) => participant.isSettled || participant.itemTotal <= 9e-3);
  return {
    commandTotal,
    paidTotal,
    remainingTotal,
    canSettle,
    participants
  };
}

// src/lib/payments.ts
function sumRegisteredPayments(payments) {
  return payments.filter((payment) => payment.status === "registered").reduce((sum, payment) => sum + payment.amount, 0);
}
function validatePaymentAmount(amount, maxAmount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Informe um valor maior que zero.";
  }
  if (maxAmount !== void 0 && amount > maxAmount + 9e-3) {
    return "Valor acima do saldo pendente.";
  }
  return null;
}

// src/lib/dashboard-analytics.ts
var MS_HOUR = 60 * 60 * 1e3;
var STALE_PARTICIPATION_MS = 12 * MS_HOUR;
function periodStart(period) {
  const now = /* @__PURE__ */ new Date();
  if (period === "today") {
    return now.toISOString().slice(0, 10);
  }
  const days = period === "7d" ? 7 : 30;
  const start = new Date(now.getTime() - days * 24 * MS_HOUR);
  return start.toISOString();
}
function inPeriod(iso, period) {
  const start = periodStart(period);
  if (period === "today") return iso.startsWith(start);
  return iso >= start;
}
function durationMinutes(from, to) {
  return Math.max(0, (new Date(to).getTime() - new Date(from).getTime()) / 6e4);
}
function dashboardAnalytics(establishmentId, period = "today") {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  const operationMode = resolveOperationMode(establishment);
  const orders = Object.values(store.orders).filter(
    (o) => o.establishmentId === establishmentId && o.status !== "CANCELADO" && inPeriod(o.createdAt, period)
  );
  const deliveredOrders = orders.filter((o) => o.status === "ENTREGUE");
  const salesRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const ticketAvg = deliveredOrders.length ? salesRevenue / deliveredOrders.length : 0;
  const payments = Object.values(store.payments || {}).filter(
    (p) => p.establishmentId === establishmentId && p.status === "registered" && inPeriod(p.registeredAt, period)
  );
  const paymentsCollected = sumRegisteredPayments(payments);
  const salesByTable = {};
  for (const order of deliveredOrders) {
    if (!salesByTable[order.tableId]) {
      salesByTable[order.tableId] = { tableNumber: order.tableNumber, revenue: 0, orders: 0 };
    }
    salesByTable[order.tableId].revenue += order.total;
    salesByTable[order.tableId].orders += 1;
  }
  const salesByMode = {
    a_la_carte: 0,
    rodizio: 0,
    buffet: 0,
    self_service: 0,
    peso_kg: 0,
    comanda: 0,
    personalizado: 0,
    outros: 0
  };
  salesByMode[operationMode] = salesRevenue;
  const participations = Object.values(store.guestParticipations).filter(
    (gp) => gp.establishmentId === establishmentId
  );
  const activeSessions = participations.filter((gp) => gp.status !== "CLOSED");
  const historicalSessions = participations.filter(
    (gp) => gp.status === "CLOSED" && gp.closedAt && inPeriod(gp.closedAt, period)
  );
  const abandonedSessions = historicalSessions.filter(
    (gp) => !gp.paymentConfirmedAt && gp.orderCount > 0 && gp.closedByUserId
  );
  const abandonmentTimes = abandonedSessions.map(
    (gp) => durationMinutes(gp.joinedAt, gp.closedAt || gp.joinedAt)
  );
  const avgAbandonmentMinutes = abandonmentTimes.length > 0 ? abandonmentTimes.reduce((a, b) => a + b, 0) / abandonmentTimes.length : 0;
  const closedWithDuration = historicalSessions.filter((gp) => gp.closedAt);
  const permanenceMinutes = closedWithDuration.map(
    (gp) => durationMinutes(gp.joinedAt, gp.closedAt)
  );
  const avgPermanenceMinutes = permanenceMinutes.length > 0 ? permanenceMinutes.reduce((a, b) => a + b, 0) / permanenceMinutes.length : 0;
  const permanenceDistribution = [
    { label: "< 30 min", max: 30, count: 0 },
    { label: "30\u201360 min", max: 60, count: 0 },
    { label: "1\u20132 h", max: 120, count: 0 },
    { label: "> 2 h", max: Infinity, count: 0 }
  ];
  for (const minutes of permanenceMinutes) {
    if (minutes < 30) permanenceDistribution[0].count += 1;
    else if (minutes < 60) permanenceDistribution[1].count += 1;
    else if (minutes < 120) permanenceDistribution[2].count += 1;
    else permanenceDistribution[3].count += 1;
  }
  const tables = Object.values(store.tables).filter((t) => t.establishmentId === establishmentId);
  const tablesOccupied = tables.filter((t) => t.status === "OCUPADA").length;
  const tablesAwaitingPayment = tables.filter((t) => t.status === "AGUARDANDO_PAGAMENTO").length;
  const tablesFree = tables.filter((t) => t.status === "LIVRE").length;
  const commands = Object.values(store.commands).filter((c) => c.establishmentId === establishmentId);
  const openCommands = commands.filter((c) => c.status !== "FECHADA").length;
  const closedCommandsPeriod = commands.filter(
    (c) => c.status === "FECHADA" && c.closedAt && inPeriod(c.closedAt, period)
  ).length;
  let paymentsConfirmed = 0;
  let paymentsPending = 0;
  for (const gp of activeSessions) {
    if (gp.paymentConfirmedAt) {
      paymentsConfirmed += 1;
      continue;
    }
    const gpOrders = Object.values(store.orders).filter(
      (o) => o.guestParticipationId === gp.id && o.status !== "CANCELADO"
    );
    const gpSplits = Object.values(store.orderItemSplits || {}).filter((s) => s.guestParticipationId === gp.id);
    const gpPayments = Object.values(store.payments || {}).filter(
      (p) => p.guestParticipationId === gp.id && p.status === "registered"
    );
    const summary = buildClosingSummary(gpOrders, [gp], gpSplits, gpPayments);
    const participant = summary.participants[0];
    if ((participant?.itemTotal ?? 0) > 9e-3) {
      paymentsPending += 1;
    }
  }
  const alerts = [];
  const now = Date.now();
  for (const table of tables) {
    if (table.status !== "AGUARDANDO_PAGAMENTO" || !table.commandId) continue;
    const command = store.commands[table.commandId];
    if (!command?.closingRequestedAt) continue;
    const waitMin = durationMinutes(command.closingRequestedAt, (/* @__PURE__ */ new Date()).toISOString());
    if (waitMin >= 15) {
      alerts.push({
        level: "warning",
        title: `Mesa ${table.number} aguardando pagamento`,
        body: `Conta solicitada h\xE1 ${Math.round(waitMin)} min`,
        href: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`
      });
    }
  }
  for (const gp of activeSessions) {
    if (gp.orderCount === 0) continue;
    if (gp.paymentConfirmedAt) continue;
    const age = now - new Date(gp.joinedAt).getTime();
    if (age > STALE_PARTICIPATION_MS) {
      alerts.push({
        level: "danger",
        title: "Sess\xE3o longa sem confirma\xE7\xE3o",
        body: `${gp.displayName || "Cliente"} \xB7 mesa aberta h\xE1 ${Math.round(age / MS_HOUR)} h`,
        href: `/admin/tables/cockpit?table=${encodeURIComponent(gp.tableId)}`
      });
    }
  }
  const pendingOrders = orders.filter((o) => o.status === "NOVO").length;
  if (pendingOrders >= 5) {
    alerts.push({
      level: "info",
      title: "Fila de pedidos",
      body: `${pendingOrders} pedidos aguardando aceite`,
      href: "/admin/orders"
    });
  }
  if (paymentsPending > 0) {
    alerts.push({
      level: "warning",
      title: "Pagamentos pendentes de confirma\xE7\xE3o",
      body: `${paymentsPending} cliente(s) com consumo aguardando OK do restaurante`,
      href: "/admin/operations"
    });
  }
  const productSales = {};
  for (const o of orders) {
    for (const item of o.items) {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, qty: 0 };
      productSales[item.productId].qty += item.qty;
    }
  }
  const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);
  return {
    period,
    operationMode,
    sales: {
      revenue: salesRevenue,
      ordersCount: orders.length,
      deliveredCount: deliveredOrders.length,
      ticketAvg,
      paymentsCollected,
      byTable: Object.values(salesByTable).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      byOperationMode: Object.entries(salesByMode).filter(([, revenue]) => revenue > 0).map(([mode, revenue]) => ({ mode, revenue }))
    },
    sessions: {
      active: activeSessions.length,
      historical: historicalSessions.length,
      abandoned: abandonedSessions.length,
      avgAbandonmentMinutes
    },
    permanence: {
      avgMinutes: avgPermanenceMinutes,
      distribution: permanenceDistribution
    },
    occupancy: {
      tablesTotal: tables.length,
      occupied: tablesOccupied,
      awaitingPayment: tablesAwaitingPayment,
      free: tablesFree,
      openCommands,
      closedCommandsPeriod
    },
    payments: {
      confirmed: paymentsConfirmed,
      pending: paymentsPending
    },
    alerts,
    topProducts,
    inPrep: orders.filter((o) => ["ACEITO", "EM_PREPARO"].includes(o.status)).length,
    pendingOrders
  };
}

// src/lib/store.ts
var DATA_PATH = process.env.MESAFLOW_DATA || (process.env.VERCEL ? "/tmp/mesaflow-store.json" : (0, import_path.join)(process.cwd(), "data", "store.json"));
var cache = null;
var operationalDirty = false;
var identityDirty = false;
var blobEtags = {};
var runtimeOidcToken;
var lastBlobError;
var lastRedisError;
var lastPersistSource = "none";
var SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
function emptyStore() {
  return {
    establishments: {},
    users: {},
    sessions: {},
    platformUsers: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {},
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
    orderCounter: {}
  };
}
function migrateProductImages(store, markBlobDirty = true) {
  let changed = false;
  for (const product of Object.values(store.products)) {
    const canonical = PRODUCT_IMAGES[product.id];
    const next = canonical ?? productImageByName(product.name);
    const stale = !product.image || product.image.includes("picsum.photos") || product.id === "p_cappuccino" && product.image.includes("1593508512255");
    if (stale && next && product.image !== next) {
      product.image = next;
      changed = true;
    }
  }
  if (!changed) return;
  if (markBlobDirty) {
    persist();
    return;
  }
  (0, import_fs.writeFileSync)(DATA_PATH, JSON.stringify(store, null, 2));
}
function load() {
  if (cache) return cache;
  (0, import_fs.mkdirSync)((0, import_path.dirname)(DATA_PATH), { recursive: true });
  if ((0, import_fs.existsSync)(DATA_PATH)) {
    try {
      cache = { ...emptyStore(), ...JSON.parse((0, import_fs.readFileSync)(DATA_PATH, "utf8")) };
      migrateOperationalCollections(cache);
      migrateProductImages(cache);
      return cache;
    } catch {
    }
  }
  cache = buildDemoStore();
  persist();
  return cache;
}
function persist(markIdentity = true) {
  if (!cache) return;
  (0, import_fs.writeFileSync)(DATA_PATH, JSON.stringify(cache, null, 2));
  operationalDirty = true;
  if (markIdentity) identityDirty = true;
}
function migrateOperationalCollections(store) {
  store.closingRequests ||= {};
  store.orderItemSplits ||= {};
  store.payments ||= {};
  store.integrationConnections ||= {};
  store.auditEvents ||= {};
  store.revokedGuestTokenHashes ||= {};
  store.clientSessions ||= {};
  store.otpChallenges ||= {};
  store.guestPhoneSecrets ||= {};
  store.platformUsers ||= {};
  for (const establishment of Object.values(store.establishments)) {
    if (!establishment.plan) establishment.plan = "essencial";
    if (!establishment.platformStatus) establishment.platformStatus = "active";
    if (!establishment.planStartedAt) establishment.planStartedAt = establishment.createdAt;
  }
}
function migrateLegacyGuestParticipations(store) {
  let changed = false;
  for (const order of Object.values(store.orders)) {
    if (order.guestParticipationId) continue;
    order.guestParticipationId = `gp_legacy_${order.commandId}`;
    changed = true;
  }
  if (changed) persist(false);
}
function getStore() {
  return load();
}
function saveStore(next) {
  cache = next;
  persist();
}
function blobReadWriteToken2() {
  return process.env.MESAFLOW_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
}
function blobStoreId2() {
  return process.env.MESAFLOW_BLOB_STORE_ID || process.env.BLOB_STORE_ID;
}
function blobDiagnostics(hasOidcHeader = false) {
  const blobEnvKeys = Object.keys(process.env).filter(
    (key) => key.includes("BLOB") || key.includes("OIDC")
  );
  const auth = blobAuthOptions(runtimeOidcToken);
  return {
    configured: blobConfigured(runtimeOidcToken),
    hasToken: Boolean(blobReadWriteToken2()),
    hasStoreId: Boolean(blobStoreId2()),
    hasOidc: Boolean(runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN),
    hasOidcHeader,
    onVercel: Boolean(process.env.VERCEL),
    vercelProjectId: process.env.VERCEL_PROJECT_ID,
    vercelEnv: process.env.VERCEL_ENV,
    blobEnvKeys,
    paths: {
      legacy: LEGACY_BLOB_PATH,
      operational: OPERATIONAL_BLOB_PATH,
      identity: IDENTITY_BLOB_PATH
    },
    access: BLOB_ACCESS,
    lastError: lastBlobError,
    etags: blobEtags,
    redis: {
      ...redisDiagnostics(),
      lastError: lastRedisError
    }
  };
}
async function probeBlobStorage() {
  return probeBlobPaths(runtimeOidcToken);
}
function setPersistentStoreOidcToken(token) {
  runtimeOidcToken = token?.trim() || void 0;
}
async function hydratePersistentStore() {
  if (!process.env.VERCEL) {
    const store2 = getStore();
    migrateLegacyGuestParticipations(store2);
    return;
  }
  (0, import_fs.mkdirSync)((0, import_path.dirname)(DATA_PATH), { recursive: true });
  lastBlobError = void 0;
  lastRedisError = void 0;
  if (redisConfigured()) {
    try {
      const hydrated = await hydrateFromRedis();
      if (hydrated) {
        cache = hydrated.store;
        blobEtags = hydrated.etags;
        operationalDirty = false;
        identityDirty = false;
        (0, import_fs.writeFileSync)(DATA_PATH, JSON.stringify(cache, null, 2));
        migrateProductImages(cache, false);
        migrateLegacyGuestParticipations(cache);
        lastPersistSource = "redis";
        return;
      }
    } catch (error) {
      lastRedisError = error instanceof Error ? error.message : "redis hydrate failed";
      console.warn("[mesaflow] redis hydrate failed", error);
    }
  }
  if (blobConfigured(runtimeOidcToken)) {
    try {
      const hydrated = await hydrateFromBlob(runtimeOidcToken);
      if (hydrated) {
        cache = hydrated.store;
        blobEtags = hydrated.etags;
        operationalDirty = hydrated.migratedFromLegacy;
        identityDirty = hydrated.migratedFromLegacy;
        (0, import_fs.writeFileSync)(DATA_PATH, JSON.stringify(cache, null, 2));
        migrateProductImages(cache, false);
        migrateLegacyGuestParticipations(cache);
        lastPersistSource = "blob";
        return;
      }
    } catch (error) {
      lastBlobError = error instanceof Error ? error.message : "blob hydrate failed";
      console.warn("[mesaflow] blob hydrate failed", error);
    }
  } else {
    lastBlobError = "Blob not configured (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)";
  }
  cache = null;
  const store = getStore();
  migrateLegacyGuestParticipations(store);
}
async function flushPersistentStore() {
  if (!cache) return { disk: false, blob: false };
  if (!process.env.VERCEL || !operationalDirty && !identityDirty) {
    return { disk: true, blob: false };
  }
  if (redisConfigured()) {
    const redisResult = await flushToRedis({
      store: cache,
      etags: blobEtags,
      flushOperational: true,
      flushIdentity: true
    });
    if (redisResult.ok) {
      operationalDirty = false;
      identityDirty = false;
      lastRedisError = void 0;
      lastPersistSource = "redis";
      return { disk: true, blob: false, redis: true };
    }
    lastRedisError = redisResult.error || "redis persist failed";
    console.warn("[mesaflow] redis persist failed", lastRedisError);
  }
  if (blobConfigured(runtimeOidcToken)) {
    const flushed = await flushToBlob({
      store: cache,
      etags: blobEtags,
      flushOperational: operationalDirty,
      flushIdentity: identityDirty,
      runtimeOidcToken
    });
    const operationalOk = !operationalDirty || flushed.operational?.ok === true;
    const identityOk = !identityDirty || flushed.identity?.ok === true;
    const blobOk = operationalOk && identityOk;
    const blobError = flushed.operational?.error || flushed.identity?.error;
    if (blobOk) {
      if (flushed.operational?.etag) blobEtags.operational = flushed.operational.etag;
      if (flushed.identity?.etag) blobEtags.identity = flushed.identity.etag;
      operationalDirty = false;
      identityDirty = false;
      lastBlobError = void 0;
      lastPersistSource = "blob";
      return { disk: true, blob: true, redis: false, redisError: lastRedisError };
    }
    lastBlobError = blobError || "blob persist failed";
    console.warn("[mesaflow] blob persist failed", lastBlobError);
  } else {
    lastBlobError = "Blob not configured (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)";
  }
  return {
    disk: true,
    blob: false,
    blobError: lastBlobError,
    redis: false,
    redisError: lastRedisError
  };
}
async function probeRedisStorage() {
  const ping = await probeRedis();
  if (!ping.ok) return ping;
  const hasData = await redisHasStoreData();
  return { ok: true, hasData };
}
function persistStatus() {
  const redisReady = redisConfigured();
  return {
    source: lastPersistSource,
    blobError: lastBlobError,
    redisConfigured: redisReady,
    redisError: lastRedisError,
    shared: lastPersistSource === "blob" || lastPersistSource === "redis" || !process.env.VERCEL && lastPersistSource === "disk-only",
    warning: process.env.VERCEL && lastPersistSource !== "blob" && lastPersistSource !== "redis" && !redisReady ? "Pedidos n\xE3o est\xE3o sendo compartilhados entre inst\xE2ncias. Conecte Upstash Redis ou um Blob store novo com BLOB_READ_WRITE_TOKEN." : void 0
  };
}
function notify(establishmentId, type, title, body, extra) {
  const store = getStore();
  const n = {
    id: id("ntf_"),
    establishmentId,
    type,
    title,
    body,
    read: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    ...extra
  };
  store.notifications[n.id] = n;
  saveStore(store);
  emit({ type: "notification", notificationId: n.id, establishmentId });
}
function findEstablishmentBySlug(slug) {
  const store = getStore();
  return Object.values(store.establishments).find((e) => e.slug === slug) || null;
}
function findUserByEmail(email) {
  const store = getStore();
  return Object.values(store.users).find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.active
  ) || null;
}
function purgeExpiredSessions(store) {
  const now = Date.now();
  for (const [token, session] of Object.entries(store.sessions)) {
    if (new Date(session.expiresAt).getTime() <= now) {
      delete store.sessions[token];
    }
  }
}
function createSession(user) {
  const now = /* @__PURE__ */ new Date();
  const token = issueAdminSessionToken(user.id, user.establishmentId, SESSION_TTL_MS);
  return {
    token,
    userId: user.id,
    establishmentId: user.establishmentId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString()
  };
}
function validateSession(token) {
  if (!token) return null;
  const store = getStore();
  const signed = parseAdminSessionToken(token);
  if (signed) {
    const user2 = store.users[signed.userId];
    const establishment2 = store.establishments[signed.establishmentId];
    if (!user2?.active || !establishment2) return null;
    const session2 = {
      token,
      userId: user2.id,
      establishmentId: establishment2.id,
      createdAt: new Date(signed.exp - SESSION_TTL_MS).toISOString(),
      expiresAt: new Date(signed.exp).toISOString()
    };
    return { session: session2, user: user2, establishment: establishment2 };
  }
  purgeExpiredSessions(store);
  const session = store.sessions[token];
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    delete store.sessions[token];
    saveStore(store);
    return null;
  }
  const user = store.users[session.userId];
  const establishment = store.establishments[session.establishmentId];
  if (!user?.active || !establishment) return null;
  return { session, user, establishment };
}
function registerEstablishment(input) {
  const store = getStore();
  const email = input.email.toLowerCase().trim();
  if (!email || !input.password || input.password.length < 6) {
    return { error: "Preencha todos os campos. Senha com no m\xEDnimo 6 caracteres." };
  }
  if (findUserByEmail(email)) {
    return { error: "Este e-mail j\xE1 est\xE1 cadastrado." };
  }
  if (!input.businessName.trim() || !input.ownerName.trim()) {
    return { error: "Nome do neg\xF3cio e respons\xE1vel s\xE3o obrigat\xF3rios." };
  }
  const { establishment, user } = provisionEstablishment(store, {
    businessName: input.businessName.trim(),
    ownerName: input.ownerName.trim(),
    email,
    passwordHash: hashPassword(input.password),
    businessType: input.businessType,
    operationMode: input.operationMode,
    tableCount: input.tableCount
  });
  saveStore(store);
  const session = createSession(user);
  return { user, establishment, session };
}
function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha inv\xE1lidos." };
  }
  const store = getStore();
  if (!user.passwordHash.startsWith("$2")) {
    user.passwordHash = hashPassword(password);
    store.users[user.id] = user;
  }
  const establishment = store.establishments[user.establishmentId];
  if (!establishment) return { error: "Estabelecimento n\xE3o encontrado." };
  const platformStatus = establishment.platformStatus ?? "active";
  if (platformStatus !== "active") {
    return {
      error: platformStatus === "suspended" ? "Conta suspensa pela opera\xE7\xE3o NA MESA. Entre em contato com o suporte." : "Conta inativa. Entre em contato com o suporte NA MESA."
    };
  }
  user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString();
  store.users[user.id] = user;
  saveStore(store);
  const session = createSession(user);
  return { user, establishment, session };
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
function findTableByQr(establishmentId, tableToken) {
  const store = getStore();
  return Object.values(store.tables).find(
    (t) => t.establishmentId === establishmentId && t.status !== "INATIVA" && t.qrToken === tableToken
  ) || null;
}
var PRODUCT_AVAILABILITIES = /* @__PURE__ */ new Set([
  "VITRINE",
  "SOB_DEMANDA",
  "AMBOS"
]);
var TABLE_STATUSES = /* @__PURE__ */ new Set([
  "LIVRE",
  "OCUPADA",
  "AGUARDANDO_PAGAMENTO",
  "RESERVADA",
  "INATIVA"
]);
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function invalid(error, status = 400) {
  return { error, status };
}
function validateProductFields(store, establishmentId, body, partial) {
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const fields = {};
  const required = ["categoryId", "sectorId", "name", "description", "price", "prepMinutes", "availability"];
  if (!partial && required.some((field) => body[field] === void 0)) {
    return invalid("Preencha os campos obrigat\xF3rios do produto.");
  }
  if (body.categoryId !== void 0) {
    if (typeof body.categoryId !== "string") return invalid("Categoria inv\xE1lida.");
    const category = store.categories[body.categoryId];
    if (!category || category.establishmentId !== establishmentId) {
      return invalid("Categoria n\xE3o pertence ao estabelecimento.");
    }
    fields.categoryId = body.categoryId;
  }
  if (body.sectorId !== void 0) {
    if (typeof body.sectorId !== "string") return invalid("Setor inv\xE1lido.");
    const sector = store.sectors[body.sectorId];
    if (!sector || sector.establishmentId !== establishmentId) {
      return invalid("Setor n\xE3o pertence ao estabelecimento.");
    }
    fields.sectorId = body.sectorId;
  }
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      return invalid("Nome deve ter entre 1 e 120 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.description !== void 0) {
    if (typeof body.description !== "string" || body.description.length > 1e3) {
      return invalid("Descri\xE7\xE3o deve ter no m\xE1ximo 1000 caracteres.");
    }
    fields.description = body.description.trim();
  }
  if (body.price !== void 0) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0 || body.price > 1e6) {
      return invalid("Pre\xE7o deve estar entre 0 e 1000000.");
    }
    fields.price = body.price;
  }
  if (body.image !== void 0) {
    if (body.image !== null && (typeof body.image !== "string" || body.image.length > 2048)) {
      return invalid("Imagem inv\xE1lida.");
    }
    fields.image = body.image === null || body.image === "" ? void 0 : body.image;
  }
  if (body.tags !== void 0) {
    if (!Array.isArray(body.tags) || body.tags.length > 20 || body.tags.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 50)) {
      return invalid("Tags inv\xE1lidas.");
    }
    fields.tags = body.tags.map((tag) => String(tag).trim());
  }
  if (body.prepMinutes !== void 0) {
    if (!Number.isInteger(body.prepMinutes) || Number(body.prepMinutes) < 0 || Number(body.prepMinutes) > 1440) {
      return invalid("Tempo de preparo deve ser inteiro entre 0 e 1440.");
    }
    fields.prepMinutes = Number(body.prepMinutes);
  }
  if (body.availability !== void 0) {
    if (typeof body.availability !== "string" || !PRODUCT_AVAILABILITIES.has(body.availability)) {
      return invalid("Disponibilidade inv\xE1lida.");
    }
    fields.availability = body.availability;
  }
  for (const field of ["featured", "active"]) {
    if (body[field] !== void 0) {
      if (typeof body[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      fields[field] = body[field];
    }
  }
  if (body.variants !== void 0) {
    if (!Array.isArray(body.variants) || body.variants.length > 50) {
      return invalid("Variantes inv\xE1lidas.");
    }
    const variants = [];
    for (const entry of body.variants) {
      if (!isRecord(entry)) return invalid("Variante inv\xE1lida.");
      if (typeof entry.name !== "string" || !entry.name.trim() || entry.name.trim().length > 80) {
        return invalid("Nome da variante inv\xE1lido.");
      }
      if (typeof entry.priceDelta !== "number" || !Number.isFinite(entry.priceDelta) || entry.priceDelta < -1e6 || entry.priceDelta > 1e6) {
        return invalid("Delta de pre\xE7o da variante inv\xE1lido.");
      }
      variants.push({
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : id("var_"),
        name: entry.name.trim(),
        priceDelta: entry.priceDelta
      });
    }
    fields.variants = variants;
  }
  if (body.addons !== void 0) {
    if (!Array.isArray(body.addons) || body.addons.length > 50) {
      return invalid("Adicionais inv\xE1lidos.");
    }
    const addons = [];
    for (const entry of body.addons) {
      if (!isRecord(entry)) return invalid("Adicional inv\xE1lido.");
      if (typeof entry.name !== "string" || !entry.name.trim() || entry.name.trim().length > 80) {
        return invalid("Nome do adicional inv\xE1lido.");
      }
      if (typeof entry.price !== "number" || !Number.isFinite(entry.price) || entry.price < 0 || entry.price > 1e6) {
        return invalid("Pre\xE7o do adicional inv\xE1lido.");
      }
      if (entry.maxQty !== void 0 && (!Number.isInteger(entry.maxQty) || Number(entry.maxQty) < 1 || Number(entry.maxQty) > 99)) {
        return invalid("Quantidade m\xE1xima do adicional inv\xE1lida.");
      }
      addons.push({
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : id("add_"),
        name: entry.name.trim(),
        price: entry.price,
        maxQty: entry.maxQty === void 0 ? void 0 : Number(entry.maxQty)
      });
    }
    fields.addons = addons;
  }
  for (const field of ["bumpProductIds", "upsellProductIds"]) {
    if (body[field] !== void 0) {
      if (!Array.isArray(body[field]) || body[field].length > 20 || body[field].some((item) => typeof item !== "string" || !item.trim())) {
        return invalid(`${field} inv\xE1lido.`);
      }
      fields[field] = body[field].map((item) => item.trim());
    }
  }
  return { value: fields };
}
function listAdminProducts(establishmentId) {
  const store = getStore();
  return {
    categories: Object.values(store.categories).filter((item) => item.establishmentId === establishmentId).sort((a, b) => a.sortOrder - b.sortOrder),
    sectors: Object.values(store.sectors).filter(
      (item) => item.establishmentId === establishmentId
    ),
    products: Object.values(store.products).filter(
      (item) => item.establishmentId === establishmentId
    )
  };
}
function createAdminProduct(establishmentId, body) {
  const store = getStore();
  const parsed = validateProductFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const product = {
    id: id("p_"),
    establishmentId,
    categoryId: parsed.value.categoryId,
    sectorId: parsed.value.sectorId,
    name: parsed.value.name,
    description: parsed.value.description,
    price: parsed.value.price,
    image: parsed.value.image,
    tags: parsed.value.tags || [],
    prepMinutes: parsed.value.prepMinutes,
    availability: parsed.value.availability,
    featured: parsed.value.featured ?? false,
    active: parsed.value.active ?? true,
    variants: parsed.value.variants || [],
    addons: parsed.value.addons || [],
    bumpProductIds: parsed.value.bumpProductIds || [],
    upsellProductIds: parsed.value.upsellProductIds || [],
    rodizioIncluded: false
  };
  store.products[product.id] = product;
  saveStore(store);
  return { value: product };
}
function updateAdminProduct(establishmentId, productId, body) {
  const store = getStore();
  const product = store.products[productId];
  if (!product || product.establishmentId !== establishmentId) {
    return invalid("Produto n\xE3o encontrado.", 404);
  }
  const parsed = validateProductFields(store, establishmentId, body, true);
  if ("error" in parsed) return parsed;
  Object.assign(product, parsed.value);
  saveStore(store);
  return { value: product };
}
function deleteAdminProduct(establishmentId, productId) {
  const store = getStore();
  const product = store.products[productId];
  if (!product || product.establishmentId !== establishmentId) {
    return invalid("Produto n\xE3o encontrado.", 404);
  }
  product.active = false;
  saveStore(store);
  return { value: product };
}
function listAdminCategories(establishmentId) {
  const store = getStore();
  return Object.values(store.categories).filter((item) => item.establishmentId === establishmentId).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}
function validateCategoryFields(store, establishmentId, body, partial) {
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const fields = {};
  if (!partial && body.name === void 0) {
    return invalid("Nome da categoria \xE9 obrigat\xF3rio.");
  }
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 80) {
      return invalid("Nome deve ter entre 1 e 80 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.emoji !== void 0) {
    if (body.emoji !== null && (typeof body.emoji !== "string" || body.emoji.length > 16)) {
      return invalid("Emoji inv\xE1lido.");
    }
    fields.emoji = body.emoji === null || body.emoji === "" ? void 0 : body.emoji;
  }
  if (body.sortOrder !== void 0) {
    if (!Number.isInteger(body.sortOrder) || Number(body.sortOrder) < 0 || Number(body.sortOrder) > 1e4) {
      return invalid("Ordem deve ser inteiro entre 0 e 10000.");
    }
    fields.sortOrder = Number(body.sortOrder);
  }
  if (body.active !== void 0) {
    if (typeof body.active !== "boolean") return invalid("active deve ser booleano.");
    fields.active = body.active;
  }
  if (body.parentId !== void 0) {
    if (body.parentId === null || body.parentId === "") {
      fields.parentId = void 0;
    } else if (typeof body.parentId !== "string") {
      return invalid("Categoria pai inv\xE1lida.");
    } else {
      const parent = store.categories[body.parentId];
      if (!parent || parent.establishmentId !== establishmentId) {
        return invalid("Categoria pai n\xE3o pertence ao estabelecimento.");
      }
      fields.parentId = body.parentId;
    }
  }
  return { value: fields };
}
function createAdminCategory(establishmentId, body) {
  const store = getStore();
  const parsed = validateCategoryFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const existing = listAdminCategories(establishmentId);
  const category = {
    id: id("cat_"),
    establishmentId,
    name: parsed.value.name,
    emoji: parsed.value.emoji,
    sortOrder: parsed.value.sortOrder ?? existing.length + 1,
    active: parsed.value.active ?? true,
    parentId: parsed.value.parentId
  };
  store.categories[category.id] = category;
  saveStore(store);
  return { value: category };
}
function updateAdminCategory(establishmentId, categoryId, body) {
  const store = getStore();
  const category = store.categories[categoryId];
  if (!category || category.establishmentId !== establishmentId) {
    return invalid("Categoria n\xE3o encontrada.", 404);
  }
  const parsed = validateCategoryFields(store, establishmentId, body, true);
  if ("error" in parsed) return parsed;
  if (parsed.value.parentId === categoryId) {
    return invalid("Categoria n\xE3o pode ser pai de si mesma.");
  }
  Object.assign(category, parsed.value);
  saveStore(store);
  return { value: category };
}
function deleteAdminCategory(establishmentId, categoryId) {
  const store = getStore();
  const category = store.categories[categoryId];
  if (!category || category.establishmentId !== establishmentId) {
    return invalid("Categoria n\xE3o encontrada.", 404);
  }
  category.active = false;
  saveStore(store);
  return { value: category };
}
function uniqueQrToken2(store) {
  let token = sessionToken();
  while (Object.values(store.tables).some((table) => table.qrToken === token)) {
    token = sessionToken();
  }
  return token;
}
function validateTableFields(store, establishmentId, body, partial, currentId) {
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const fields = {};
  if (!partial && ["number", "capacity"].some((field) => body[field] === void 0)) {
    return invalid("Preencha os campos obrigat\xF3rios da mesa.");
  }
  if (body.number !== void 0) {
    if (typeof body.number !== "string" || !body.number.trim() || body.number.trim().length > 20) {
      return invalid("N\xFAmero deve ter entre 1 e 20 caracteres.");
    }
    const number = body.number.trim();
    const duplicate = Object.values(store.tables).some(
      (table) => table.establishmentId === establishmentId && table.id !== currentId && table.number === number
    );
    if (duplicate) return invalid("J\xE1 existe uma mesa com este n\xFAmero.", 409);
    fields.number = number;
  }
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || body.name.trim().length > 80) {
      return invalid("Nome deve ter no m\xE1ximo 80 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.capacity !== void 0) {
    if (!Number.isInteger(body.capacity) || Number(body.capacity) < 1 || Number(body.capacity) > 100) {
      return invalid("Capacidade deve ser inteira entre 1 e 100.");
    }
    fields.capacity = Number(body.capacity);
  }
  if (body.status !== void 0) {
    if (typeof body.status !== "string" || !TABLE_STATUSES.has(body.status)) {
      return invalid("Status de mesa inv\xE1lido.");
    }
    fields.status = body.status;
  }
  return { value: fields };
}
function listAdminTables(establishmentId) {
  return Object.values(getStore().tables).filter(
    (table) => table.establishmentId === establishmentId
  );
}
function createAdminTable(establishmentId, body) {
  const store = getStore();
  const parsed = validateTableFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const table = {
    id: id("tbl_"),
    establishmentId,
    number: parsed.value.number,
    name: parsed.value.name || `Mesa ${parsed.value.number}`,
    capacity: parsed.value.capacity,
    status: parsed.value.status || "LIVRE",
    qrToken: uniqueQrToken2(store)
  };
  store.tables[table.id] = table;
  saveStore(store);
  return { value: table };
}
function updateAdminTable(establishmentId, tableId, body) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa n\xE3o encontrada.", 404);
  }
  const parsed = validateTableFields(store, establishmentId, body, true, tableId);
  if ("error" in parsed) return parsed;
  Object.assign(table, parsed.value);
  saveStore(store);
  return { value: table };
}
function deleteAdminTable(establishmentId, tableId) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa n\xE3o encontrada.", 404);
  }
  const blockingCommand = Object.values(store.commands).some(
    (command) => command.establishmentId === establishmentId && command.tableId === tableId && (command.status === "ABERTA" || command.status === "PAGAMENTO_SOLICITADO")
  );
  if (blockingCommand) {
    return invalid("Mesa possui comanda aberta ou aguardando pagamento.", 409);
  }
  delete store.tables[tableId];
  saveStore(store);
  return { value: { id: tableId } };
}
function regenerateAdminTableQr(establishmentId, tableId) {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa n\xE3o encontrada.", 404);
  }
  table.qrToken = uniqueQrToken2(store);
  saveStore(store);
  return { value: table };
}
function getAdminSettings(establishmentId) {
  return getStore().establishments[establishmentId] || null;
}
function updateAdminSettings(establishmentId, body) {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return invalid("Estabelecimento n\xE3o encontrado.", 404);
  if (!isRecord(body)) return invalid("Corpo inv\xE1lido.");
  const next = {
    ...establishment,
    settings: { ...establishment.settings }
  };
  if (body.settings !== void 0 && !isRecord(body.settings)) {
    return invalid("Ajustes inv\xE1lidos.");
  }
  const settings = isRecord(body.settings) ? body.settings : body;
  if (body.name !== void 0) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      return invalid("Nome deve ter entre 1 e 120 caracteres.");
    }
    next.name = body.name.trim();
  }
  if (body.tagline !== void 0) {
    if (typeof body.tagline !== "string" || body.tagline.length > 240) {
      return invalid("Tagline deve ter no m\xE1ximo 240 caracteres.");
    }
    next.tagline = body.tagline.trim();
  }
  for (const field of ["open", "rodizioEnabled"]) {
    if (body[field] !== void 0) {
      if (typeof body[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      next[field] = body[field];
    }
  }
  if (body.operationMode !== void 0) {
    if (!isOperationMode(body.operationMode)) return invalid("Modo de opera\xE7\xE3o inv\xE1lido.");
    next.operationMode = body.operationMode;
    if (body.rodizioEnabled === void 0) {
      next.rodizioEnabled = next.operationMode === "rodizio" || next.rodizioEnabled;
    }
  }
  if (settings.currency !== void 0) {
    if (typeof settings.currency !== "string" || !/^[A-Za-z]{3}$/.test(settings.currency)) {
      return invalid("Moeda deve usar c\xF3digo ISO de 3 letras.");
    }
    next.settings.currency = settings.currency.toUpperCase();
  }
  for (const field of ["allowEditAfterPrep", "soundNotifications", "otpRequired"]) {
    if (settings[field] !== void 0) {
      if (typeof settings[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      next.settings[field] = settings[field];
    }
  }
  if (settings.minIntervalRodizioSec !== void 0) {
    if (!Number.isInteger(settings.minIntervalRodizioSec) || Number(settings.minIntervalRodizioSec) < 0 || Number(settings.minIntervalRodizioSec) > 86400) {
      return invalid("Intervalo do rod\xEDzio deve ser inteiro entre 0 e 86400.");
    }
    next.settings.minIntervalRodizioSec = Number(settings.minIntervalRodizioSec);
  }
  store.establishments[establishmentId] = next;
  saveStore(store);
  return { value: next };
}
function getActiveCommand(table) {
  const store = getStore();
  if (table.commandId) {
    const linked = store.commands[table.commandId];
    if (linked && linked.status !== "FECHADA") return linked;
  }
  const active = Object.values(store.commands).find(
    (command) => command.tableId === table.id && command.status !== "FECHADA"
  );
  return active || null;
}
function getOrOpenCommand(table) {
  const store = getStore();
  const active = getActiveCommand(table);
  if (active) {
    if (table.commandId !== active.id) {
      table.commandId = active.id;
      store.tables[table.id] = table;
      saveStore(store);
    }
    return active;
  }
  const cmd = {
    id: id("cmd_"),
    establishmentId: table.establishmentId,
    tableId: table.id,
    openedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "ABERTA",
    guestCount: 2,
    total: 0
  };
  store.commands[cmd.id] = cmd;
  table.commandId = cmd.id;
  table.status = "OCUPADA";
  store.tables[table.id] = table;
  saveStore(store);
  emit({ type: "command.updated", commandId: cmd.id, establishmentId: table.establishmentId });
  return cmd;
}
function recalcCommandTotal(commandId) {
  const store = getStore();
  const cmd = store.commands[commandId];
  if (!cmd) return;
  const orders = Object.values(store.orders).filter((o) => o.commandId === commandId && o.status !== "CANCELADO");
  cmd.total = orders.reduce((s, o) => s + o.total, 0);
  store.commands[commandId] = cmd;
  saveStore(store);
}
function nextOrderNumber(establishmentId) {
  const store = getStore();
  const n = (store.orderCounter[establishmentId] || 1200) + 1;
  store.orderCounter[establishmentId] = n;
  saveStore(store);
  return n;
}
function createOrder(input) {
  const store = getStore();
  const participation = store.guestParticipations[input.guestParticipationId];
  if (participation && participation.status !== "OPEN") {
    throw new Error("Participa\xE7\xE3o n\xE3o permite novos pedidos.");
  }
  const total = input.items.reduce((s, i) => s + lineTotal(i), 0);
  const order = {
    id: id("ord_"),
    establishmentId: input.establishmentId,
    tableId: input.table.id,
    tableNumber: input.table.number,
    commandId: input.commandId,
    guestParticipationId: input.guestParticipationId,
    number: nextOrderNumber(input.establishmentId),
    status: "NOVO",
    items: input.items.map((i) => ({ ...i, status: "NOVO" })),
    notes: input.notes,
    source: input.source || "MESA",
    rodizioRoundId: input.rodizioRoundId,
    total,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  store.orders[order.id] = order;
  if (participation) {
    participation.orderCount += 1;
    participation.lastOrderAt = order.createdAt;
    store.guestParticipations[participation.id] = participation;
  }
  saveStore(store);
  recalcCommandTotal(input.commandId);
  notify(input.establishmentId, "order.new", "Novo pedido", `Mesa ${input.table.number} \xB7 Pedido #${order.number}`);
  emit({ type: "order.created", orderId: order.id, establishmentId: input.establishmentId });
  return order;
}
function updateOrderStatus(orderId, status, establishmentId) {
  const store = getStore();
  const order = store.orders[orderId];
  if (!order) return null;
  if (establishmentId && order.establishmentId !== establishmentId) return null;
  order.status = status;
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  order.items = order.items.map((i) => ({ ...i, status }));
  store.orders[orderId] = order;
  saveStore(store);
  if (status === "PRONTO") {
    notify(order.establishmentId, "order.ready", "Pedido pronto", `#${order.number} \xB7 Mesa ${order.tableNumber}`);
  }
  emit({ type: "order.updated", orderId, establishmentId: order.establishmentId });
  return order;
}
function createRodizioRound(input) {
  const store = getStore();
  const existing = Object.values(store.rodizioRounds).filter(
    (r) => r.commandId === input.commandId && r.rodizioId === input.rodizioId
  );
  const round = {
    id: id("rrd_"),
    establishmentId: input.establishmentId,
    commandId: input.commandId,
    tableId: input.table.id,
    guestParticipationId: input.guestParticipationId,
    rodizioId: input.rodizioId,
    roundNumber: existing.length + 1,
    status: "NOVO",
    items: input.items,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  createOrder({
    establishmentId: input.establishmentId,
    table: input.table,
    commandId: input.commandId,
    guestParticipationId: input.guestParticipationId,
    items: input.items,
    source: "RODIZIO",
    rodizioRoundId: round.id
  });
  round.sentAt = (/* @__PURE__ */ new Date()).toISOString();
  round.status = "ACEITO";
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  notify(input.establishmentId, "rodizio.round", "Nova rodada", `Mesa ${input.table.number} \xB7 Rodada ${round.roundNumber}`);
  emit({ type: "rodizio.round", roundId: round.id, establishmentId: input.establishmentId });
  return round;
}
function dashboardStats(establishmentId) {
  const analytics = dashboardAnalytics(establishmentId, "today");
  return {
    revenue: analytics.sales.revenue,
    ordersToday: analytics.sales.ordersCount,
    ticketAvg: analytics.sales.ticketAvg,
    tablesOccupied: analytics.occupancy.occupied,
    tablesTotal: analytics.occupancy.tablesTotal,
    inPrep: analytics.inPrep,
    pending: analytics.pendingOrders,
    topProducts: analytics.topProducts,
    paymentsCollected: analytics.sales.paymentsCollected,
    activeSessions: analytics.sessions.active,
    paymentsPending: analytics.payments.pending,
    paymentsConfirmed: analytics.payments.confirmed
  };
}

// src/lib/identity-crypto.ts
var import_crypto5 = require("crypto");
var DEV_FALLBACK_SECRET = "mesaflow-dev-only-change-in-production";
function secret2(name) {
  return process.env[name] || process.env.MESAFLOW_IDENTITY_SECRET || DEV_FALLBACK_SECRET;
}
function hashToken(token) {
  return (0, import_crypto5.createHash)("sha256").update(token).digest("hex");
}
function phoneLookupHash(establishmentId, phoneE164) {
  return (0, import_crypto5.createHmac)("sha256", secret2("MESAFLOW_PHONE_LOOKUP_SECRET")).update(`${establishmentId}:${phoneE164}`).digest("hex");
}
function encryptPhone(phoneE164) {
  const key = (0, import_crypto5.createHash)("sha256").update(secret2("MESAFLOW_PHONE_CIPHER_SECRET")).digest();
  const iv = (0, import_crypto5.randomBytes)(12);
  const cipher = (0, import_crypto5.createCipheriv)("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(phoneE164, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}
function decryptPhone(ciphertext) {
  try {
    const [ivB64, tagB64, dataB64] = ciphertext.split(".");
    if (!ivB64 || !tagB64 || !dataB64) return null;
    const key = (0, import_crypto5.createHash)("sha256").update(secret2("MESAFLOW_PHONE_CIPHER_SECRET")).digest();
    const decipher = (0, import_crypto5.createDecipheriv)("aes-256-gcm", key, Buffer.from(ivB64, "base64url"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64url")),
      decipher.final()
    ]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}
function maskPhoneDisplay(phoneE164) {
  const digits = phoneE164.replace(/\D/g, "");
  if (digits.length < 4) return "+** ****";
  const tail = digits.slice(-4);
  if (phoneE164.startsWith("+55") && digits.length >= 12) {
    return `+55 ** *****-${tail}`;
  }
  return `+** ***${tail}`;
}
function normalizePhoneE164(input) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("55") && digits.length >= 12) return `+${digits}`;
  if (digits.length >= 10 && digits.length <= 11) return `+55${digits}`;
  if (input.startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}
function otpCodeHash(challengeId, code) {
  return (0, import_crypto5.createHmac)("sha256", secret2("MESAFLOW_OTP_SECRET")).update(`${challengeId}:${code}`).digest("hex");
}
function generateOtpCode() {
  return String(Math.floor(1e5 + Math.random() * 9e5));
}

// src/lib/otp-bypass.ts
var DEFAULT_OTP_BYPASS_CODE = "010203";
function evolutionOtpConfigured() {
  return Boolean(
    process.env.MESAFLOW_EVOLUTION_URL?.trim() && process.env.MESAFLOW_EVOLUTION_API_KEY?.trim() && process.env.MESAFLOW_EVOLUTION_INSTANCE?.trim()
  );
}
function otpBypassCode() {
  if (evolutionOtpConfigured()) return null;
  const configured = process.env.MESAFLOW_OTP_BYPASS_CODE?.trim();
  if (configured === "0" || configured === "off") return null;
  return configured || DEFAULT_OTP_BYPASS_CODE;
}
function isOtpBypassCode(code) {
  const bypass = otpBypassCode();
  if (!bypass) return false;
  return code.trim() === bypass;
}
function publicOtpBypassHint() {
  const code = otpBypassCode();
  if (!code) return { active: false };
  return { active: true, code };
}

// src/lib/guest-session-token.ts
var import_crypto6 = require("crypto");
var CLIENT_SESSION_TTL_MS = 24 * 60 * 60 * 1e3;
function secret3() {
  return process.env.MESAFLOW_CLIENT_SESSION_SECRET || process.env.MESAFLOW_IDENTITY_SECRET || "mesaflow-dev-only-change-in-production";
}
function sign2(payloadB64) {
  return (0, import_crypto6.createHmac)("sha256", secret3()).update(payloadB64).digest("base64url");
}
function verifySig2(payloadB64, sig) {
  const expected = sign2(payloadB64);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  return sigBuf.length === expectedBuf.length && (0, import_crypto6.timingSafeEqual)(sigBuf, expectedBuf);
}
function claimsFromParticipation(participation, ttlMs = CLIENT_SESSION_TTL_MS) {
  return {
    v: 2,
    id: participation.id,
    establishmentId: participation.establishmentId,
    commandId: participation.commandId,
    tableId: participation.tableId,
    phoneLookupHash: participation.phoneLookupHash,
    phoneDisplay: participation.phoneDisplay,
    displayName: participation.displayName,
    participantIndex: participation.participantIndex,
    status: participation.status,
    joinedAt: participation.joinedAt,
    verifiedAt: participation.verifiedAt,
    exp: Date.now() + ttlMs
  };
}
function issueGuestSessionToken(participation, ttlMs = CLIENT_SESSION_TTL_MS) {
  const payloadB64 = Buffer.from(JSON.stringify(claimsFromParticipation(participation, ttlMs))).toString(
    "base64url"
  );
  return `${payloadB64}.${sign2(payloadB64)}`;
}
function parseGuestTokenClaims(token) {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig || !verifySig2(payloadB64, sig)) return null;
  let raw;
  try {
    raw = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (raw.startsWith("{")) {
    try {
      const claims = JSON.parse(raw);
      if (claims.v !== 2 || !claims.id || !claims.establishmentId || !claims.tableId) return null;
      if (Date.now() > claims.exp) return null;
      return claims;
    } catch {
      return null;
    }
  }
  const [participationId, expStr] = raw.split(":");
  if (!participationId || !expStr) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  return null;
}

// src/lib/guest.ts
var CLIENT_SESSION_TTL_MS2 = 24 * 60 * 60 * 1e3;
var OTP_TTL_MS = 5 * 60 * 1e3;
var OTP_MAX_ATTEMPTS = 5;
function invalid2(error, status = 400) {
  return { error, status };
}
function ensureIdentityCollections(store) {
  store.clientSessions ||= {};
  store.otpChallenges ||= {};
  store.guestPhoneSecrets ||= {};
  store.revokedGuestTokenHashes ||= {};
}
function normalizeComandaNumber(raw) {
  if (raw === void 0 || raw === null) return void 0;
  const trimmed = String(raw).trim();
  return trimmed || void 0;
}
function requireComandaIfNeeded(establishment, comandaNumber) {
  if (resolveOperationMode(establishment) !== "comanda") return null;
  if (!comandaNumber || comandaNumber.length < 1 || comandaNumber.length > 20) {
    return invalid2("N\xFAmero da comanda \xE9 obrigat\xF3rio (1 a 20 caracteres).");
  }
  return null;
}
function otpRequiredForEstablishment(est) {
  if (process.env.MESAFLOW_DEV_SKIP_OTP === "1") return false;
  return est.settings.otpRequired !== false;
}
function findOpenParticipation(store, commandId, lookupHash) {
  return Object.values(store.guestParticipations).find(
    (gp) => gp.commandId === commandId && gp.phoneLookupHash === lookupHash && (gp.status === "OPEN" || gp.status === "CLOSING_REQUESTED")
  ) || null;
}
function nextParticipantIndex(store, commandId) {
  const active = Object.values(store.guestParticipations).filter(
    (gp) => gp.commandId === commandId && gp.status !== "CLOSED"
  );
  return active.length + 1;
}
function upsertGuestPhoneSecret(participationId, phoneE164) {
  const store = getStore();
  store.guestPhoneSecrets[participationId] = { phoneCiphertext: encryptPhone(phoneE164) };
  saveStore(store);
}
function createGuestParticipation(input) {
  const comandaNumber = normalizeComandaNumber(input.comandaNumber);
  const comandaError = requireComandaIfNeeded(input.establishment, comandaNumber);
  if (comandaError) return comandaError;
  const store = getStore();
  const lookup = phoneLookupHash(input.establishment.id, input.phoneE164);
  const existing = findOpenParticipation(store, input.commandId, lookup);
  if (existing) {
    if (comandaNumber && !existing.comandaNumber) {
      existing.comandaNumber = comandaNumber;
      store.guestParticipations[existing.id] = existing;
      saveStore(store);
    }
    return existing;
  }
  const participation = {
    id: id("gp_"),
    establishmentId: input.establishment.id,
    commandId: input.commandId,
    tableId: input.table.id,
    phoneLookupHash: lookup,
    phoneDisplay: maskPhoneDisplay(input.phoneE164),
    displayName: input.displayName?.trim() || void 0,
    comandaNumber,
    participantIndex: nextParticipantIndex(store, input.commandId),
    status: "OPEN",
    joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
    verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
    orderCount: 0
  };
  store.guestParticipations[participation.id] = participation;
  upsertGuestPhoneSecret(participation.id, input.phoneE164);
  saveStore(store);
  return participation;
}
function createClientSession(participation) {
  const token = issueGuestSessionToken(participation, CLIENT_SESSION_TTL_MS2);
  const now = /* @__PURE__ */ new Date();
  const session = {
    id: id("cs_"),
    guestParticipationId: participation.id,
    tokenHash: hashToken(token),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CLIENT_SESSION_TTL_MS2).toISOString(),
    lastSeenAt: now.toISOString()
  };
  const store = getStore();
  ensureIdentityCollections(store);
  store.clientSessions[session.id] = session;
  saveStore(store);
  return { token, session };
}
function participationFromClaims(claims) {
  const store = getStore();
  const existing = store.guestParticipations[claims.id];
  if (existing) {
    if (existing.status === "CLOSED") return null;
    return existing;
  }
  if (claims.status === "CLOSED") return null;
  const table = store.tables[claims.tableId];
  const command = table ? getOrOpenCommand(table) : null;
  const participation = {
    id: claims.id,
    establishmentId: claims.establishmentId,
    commandId: command?.id || claims.commandId,
    tableId: claims.tableId,
    phoneLookupHash: claims.phoneLookupHash,
    phoneDisplay: claims.phoneDisplay,
    displayName: claims.displayName,
    participantIndex: claims.participantIndex,
    status: claims.status,
    joinedAt: claims.joinedAt,
    verifiedAt: claims.verifiedAt,
    orderCount: 0
  };
  store.guestParticipations[participation.id] = participation;
  saveStore(store);
  return participation;
}
function resolveGuestSession(participation) {
  if (participation.status === "CLOSED") return null;
  const store = getStore();
  const establishment = store.establishments[participation.establishmentId];
  if (!establishment) return null;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const session = {
    id: `stateless_${participation.id}`,
    guestParticipationId: participation.id,
    tokenHash: "",
    createdAt: now,
    expiresAt: now,
    lastSeenAt: now
  };
  return { session, participation, establishment };
}
function validateClientSession(token) {
  if (!token?.trim()) return null;
  const trimmed = token.trim();
  const store = getStore();
  ensureIdentityCollections(store);
  const tokenHash = hashToken(trimmed);
  if (store.revokedGuestTokenHashes[tokenHash]) return null;
  const claims = parseGuestTokenClaims(trimmed);
  if (claims) {
    const participation2 = participationFromClaims(claims);
    if (!participation2) return null;
    return resolveGuestSession(participation2);
  }
  const session = Object.values(store.clientSessions).find(
    (entry) => entry.tokenHash === tokenHash && !entry.revokedAt
  );
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;
  const participation = store.guestParticipations[session.guestParticipationId];
  if (!participation) return null;
  return resolveGuestSession(participation);
}
function revokeClientSession(token) {
  if (!token?.trim()) return;
  const store = getStore();
  ensureIdentityCollections(store);
  const tokenHash = hashToken(token.trim());
  const now = (/* @__PURE__ */ new Date()).toISOString();
  store.revokedGuestTokenHashes[tokenHash] = now;
  for (const session of Object.values(store.clientSessions)) {
    if (session.tokenHash !== tokenHash) continue;
    session.revokedAt = now;
    store.clientSessions[session.id] = session;
  }
  saveStore(store);
}
function revokeSessionsForParticipation(store, participationId) {
  ensureIdentityCollections(store);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  for (const session of Object.values(store.clientSessions)) {
    if (session.guestParticipationId !== participationId || session.revokedAt) continue;
    session.revokedAt = now;
    store.clientSessions[session.id] = session;
    if (session.tokenHash) {
      store.revokedGuestTokenHashes[session.tokenHash] = now;
    }
  }
}
function joinGuestAtTable(input) {
  const comandaNumber = normalizeComandaNumber(input.comandaNumber);
  const comandaError = requireComandaIfNeeded(input.establishment, comandaNumber);
  if (comandaError) return comandaError;
  const store = getStore();
  const command = getOrOpenCommand(input.table);
  const lookup = phoneLookupHash(input.establishment.id, input.phoneE164);
  const existing = findOpenParticipation(store, command.id, lookup);
  const created = existing || createGuestParticipation({
    establishment: input.establishment,
    table: input.table,
    commandId: command.id,
    phoneE164: input.phoneE164,
    displayName: input.displayName,
    comandaNumber
  });
  if ("error" in created) return created;
  if (existing && comandaNumber && !existing.comandaNumber) {
    existing.comandaNumber = comandaNumber;
    store.guestParticipations[existing.id] = existing;
    saveStore(store);
  }
  const { token } = createClientSession(created);
  return {
    token,
    participation: created,
    command,
    message: existing ? "Voc\xEA j\xE1 est\xE1 participando desta mesa." : void 0
  };
}
function requestOtpChallenge(input) {
  const phoneE164 = normalizePhoneE164(input.phoneRaw);
  if (!phoneE164) return { error: "Telefone inv\xE1lido." };
  const command = getActiveCommand(input.table) || getOrOpenCommand(input.table);
  const store = getStore();
  const lookup = phoneLookupHash(input.establishment.id, phoneE164);
  for (const challenge2 of Object.values(store.otpChallenges)) {
    if (challenge2.commandId === command.id && challenge2.phoneLookupHash === lookup && !challenge2.consumedAt && new Date(challenge2.expiresAt).getTime() > Date.now()) {
      challenge2.consumedAt = (/* @__PURE__ */ new Date()).toISOString();
      store.otpChallenges[challenge2.id] = challenge2;
    }
  }
  const code = generateOtpCode();
  const challengeId = id("otp_");
  const challenge = {
    id: challengeId,
    establishmentId: input.establishment.id,
    commandId: command.id,
    tableId: input.table.id,
    phoneLookupHash: lookup,
    codeHash: otpCodeHash(challengeId, code),
    purpose: input.purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    sentAt: (/* @__PURE__ */ new Date()).toISOString(),
    resendCount: 0
  };
  store.otpChallenges[challenge.id] = challenge;
  storePhoneForOtpLookup(input.establishment.id, phoneE164);
  saveStore(store);
  const mockCode = process.env.MESAFLOW_OTP_MOCK === "1" || process.env.MESAFLOW_DEV_SKIP_OTP === "1" ? code : void 0;
  return { challengeId: challenge.id, mockCode };
}
function verifyOtpChallenge(input) {
  const code = input.code.trim();
  const comandaNumber = normalizeComandaNumber(input.comandaNumber);
  if (isOtpBypassCode(code) && input.slug && input.tableToken && input.phoneRaw) {
    const establishment2 = findEstablishmentBySlug(input.slug);
    if (!establishment2) return { error: "Estabelecimento n\xE3o encontrado." };
    const table2 = findTableByQr(establishment2.id, input.tableToken);
    if (!table2) return { error: "Mesa inv\xE1lida." };
    const phoneE1642 = normalizePhoneE164(input.phoneRaw);
    if (!phoneE1642) return { error: "Telefone inv\xE1lido." };
    const joined = joinGuestAtTable({
      establishment: establishment2,
      table: table2,
      phoneE164: phoneE1642,
      displayName: input.displayName,
      comandaNumber
    });
    if ("error" in joined) return { error: joined.error };
    return { token: joined.token, participation: joined.participation };
  }
  const store = getStore();
  const challenge = store.otpChallenges[input.challengeId];
  if (!challenge || challenge.consumedAt) {
    return { error: "C\xF3digo inv\xE1lido ou expirado." };
  }
  if (new Date(challenge.expiresAt).getTime() < Date.now()) {
    return { error: "C\xF3digo expirado." };
  }
  if (challenge.attempts >= challenge.maxAttempts) {
    return { error: "Limite de tentativas excedido." };
  }
  const expected = otpCodeHash(challenge.id, code);
  if (expected !== challenge.codeHash && !isOtpBypassCode(code)) {
    challenge.attempts += 1;
    store.otpChallenges[challenge.id] = challenge;
    saveStore(store);
    return { error: "C\xF3digo incorreto." };
  }
  challenge.consumedAt = (/* @__PURE__ */ new Date()).toISOString();
  store.otpChallenges[challenge.id] = challenge;
  const establishment = store.establishments[challenge.establishmentId];
  const table = store.tables[challenge.tableId];
  if (!establishment || !table) return { error: "Mesa indispon\xEDvel." };
  const secret4 = store.guestPhoneSecrets[challenge.phoneLookupHash];
  const phoneE164 = secret4 ? decryptPhone(secret4.phoneCiphertext) : null;
  if (!phoneE164) return { error: "Telefone n\xE3o encontrado para este c\xF3digo." };
  const participation = createGuestParticipation({
    establishment,
    table,
    commandId: challenge.commandId,
    phoneE164,
    displayName: input.displayName,
    comandaNumber
  });
  if ("error" in participation) return { error: participation.error };
  const { token } = createClientSession(participation);
  saveStore(store);
  return { token, participation };
}
function guestTableSummary(establishmentId, commandId) {
  const store = getStore();
  if (!commandId) {
    return { participantCount: 0, tableTotal: 0, participants: [] };
  }
  const participants = Object.values(store.guestParticipations).filter((gp) => gp.commandId === commandId && gp.status !== "CLOSED").sort((a, b) => a.participantIndex - b.participantIndex).map(publicParticipation);
  const command = store.commands[commandId];
  return {
    participantCount: participants.length,
    tableTotal: command?.total || 0,
    participants
  };
}
function publicParticipation(gp) {
  return {
    id: gp.id,
    displayName: gp.displayName || `Participante ${gp.participantIndex}`,
    participantIndex: gp.participantIndex,
    status: gp.status,
    phoneDisplay: gp.phoneDisplay,
    orderCount: gp.orderCount,
    comandaNumber: gp.comandaNumber,
    paymentConfirmedAt: gp.paymentConfirmedAt
  };
}
function storePhoneForOtpLookup(establishmentId, phoneE164) {
  const store = getStore();
  const lookup = phoneLookupHash(establishmentId, phoneE164);
  store.guestPhoneSecrets[lookup] = { phoneCiphertext: encryptPhone(phoneE164) };
  saveStore(store);
  return lookup;
}
function kickGuestParticipation(establishmentId, participationId, actorUserId) {
  const store = getStore();
  ensureIdentityCollections(store);
  const participation = store.guestParticipations[participationId];
  if (!participation || participation.establishmentId !== establishmentId) {
    return invalid2("Participa\xE7\xE3o n\xE3o encontrada.", 404);
  }
  if (participation.status === "CLOSED") {
    return { value: { participation } };
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  participation.status = "CLOSED";
  participation.closedAt = now;
  participation.closedByUserId = actorUserId;
  store.guestParticipations[participation.id] = participation;
  revokeSessionsForParticipation(store, participation.id);
  store.auditEvents ||= {};
  const auditId = id("aud_");
  store.auditEvents[auditId] = {
    id: auditId,
    establishmentId,
    type: "guest.kicked",
    actorType: "STAFF",
    actorUserId,
    targetType: "guest_participation",
    targetId: participation.id,
    metadata: { tableId: participation.tableId, commandId: participation.commandId },
    createdAt: now
  };
  saveStore(store);
  return { value: { participation } };
}

// src/lib/guest-payment.ts
function commandOrders(store, commandId) {
  return Object.values(store.orders).filter((order) => order.commandId === commandId);
}
function commandSplits(store, commandId) {
  return Object.values(store.orderItemSplits || {}).filter((split) => split.commandId === commandId);
}
function commandPayments(store, commandId) {
  return Object.values(store.payments || {}).filter((payment) => payment.commandId === commandId);
}
function getGuestPaymentStatus(participation) {
  const store = getStore();
  const orders = commandOrders(store, participation.commandId);
  const splits = commandSplits(store, participation.commandId);
  const payments = commandPayments(store, participation.commandId);
  const summary = buildClosingSummary(orders, [participation], splits, payments);
  const participant = summary.participants[0];
  const itemTotal = participant?.itemTotal ?? 0;
  const paidTotal = participant?.paidTotal ?? 0;
  const remainingTotal = participant?.remainingTotal ?? 0;
  const isSettled = participant?.isSettled ?? itemTotal <= 9e-3;
  const paymentConfirmedAt = participation.paymentConfirmedAt;
  const canLeave = canGuestLeave(participation, itemTotal);
  return {
    itemTotal,
    paidTotal,
    remainingTotal,
    isSettled,
    paymentConfirmedAt,
    canLeave
  };
}
function canGuestLeave(participation, itemTotal) {
  if (participation.status === "CLOSED") return false;
  const owed = itemTotal ?? getGuestPaymentStatus(participation).itemTotal;
  if (owed <= 9e-3) return true;
  return Boolean(participation.paymentConfirmedAt);
}
function clearPaymentConfirmationIfUnsettled(store, participationId) {
  const participation = store.guestParticipations[participationId];
  if (!participation?.paymentConfirmedAt) return;
  const status = getGuestPaymentStatus(participation);
  if (!status.isSettled) {
    participation.paymentConfirmedAt = void 0;
    participation.paymentConfirmedByUserId = void 0;
    store.guestParticipations[participationId] = participation;
  }
}

// src/lib/store-operations.ts
var PAYMENT_METHODS = /* @__PURE__ */ new Set(["cash", "credit", "debit", "pix", "other"]);
function invalid3(error, status = 400) {
  return { error, status };
}
function ensureOperationalCollections(store) {
  store.closingRequests ||= {};
  store.orderItemSplits ||= {};
  store.payments ||= {};
  store.integrationConnections ||= {};
  store.auditEvents ||= {};
}
function migrateOperationalCollections2(store) {
  ensureOperationalCollections(store);
}
function recordAudit(store, input) {
  ensureOperationalCollections(store);
  const event = {
    id: id("aud_"),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    ...input
  };
  store.auditEvents[event.id] = event;
}
function notifyStaff(store, establishmentId, type, title, body, extra) {
  const notification = {
    id: id("ntf_"),
    establishmentId,
    type,
    title,
    body,
    read: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    ...extra
  };
  store.notifications[notification.id] = notification;
  emit({ type: "notification", notificationId: notification.id, establishmentId });
}
function commandOrders2(store, commandId) {
  return Object.values(store.orders).filter((order) => order.commandId === commandId);
}
function commandParticipations(store, commandId) {
  return Object.values(store.guestParticipations).filter(
    (participation) => participation.commandId === commandId && participation.status !== "CLOSED"
  );
}
function commandSplits2(store, commandId) {
  return Object.values(store.orderItemSplits).filter((split) => split.commandId === commandId);
}
function commandPayments2(store, commandId) {
  return Object.values(store.payments).filter((payment) => payment.commandId === commandId);
}
function commandClosingRequests(store, commandId) {
  return Object.values(store.closingRequests).filter((request) => request.commandId === commandId);
}
function getTableCockpit(establishmentId, tableId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) return null;
  const command = (table.commandId ? store.commands[table.commandId] : null) || Object.values(store.commands).find(
    (entry) => entry.establishmentId === establishmentId && entry.tableId === tableId && entry.status !== "FECHADA"
  ) || null;
  if (!command) {
    return { table, command: null, orders: [], participations: [], splits: [], payments: [], closingRequests: [], summary: null };
  }
  const orders = commandOrders2(store, command.id);
  const participations = commandParticipations(store, command.id);
  const splits = commandSplits2(store, command.id);
  const payments = commandPayments2(store, command.id);
  const closingRequests = commandClosingRequests(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);
  return {
    table,
    command,
    orders,
    participations,
    splits,
    payments,
    closingRequests,
    summary
  };
}
function replaceOrderItemSplits(establishmentId, commandId, body, actorUserId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const command = store.commands[commandId];
  if (!command || command.establishmentId !== establishmentId) {
    return invalid3("Comanda n\xE3o encontrada.", 404);
  }
  if (command.status === "FECHADA") {
    return invalid3("Comanda j\xE1 encerrada.", 409);
  }
  if (!body || typeof body !== "object" || !Array.isArray(body.splits)) {
    return invalid3("Informe a lista de divis\xF5es por item.");
  }
  const entries = body.splits;
  const orders = commandOrders2(store, command.id).filter((order) => order.status !== "CANCELADO");
  const participations = new Set(commandParticipations(store, command.id).map((entry) => entry.id));
  const itemMap = /* @__PURE__ */ new Map();
  for (const order of orders) {
    for (const item of order.items) {
      itemMap.set(item.id, { orderId: order.id, qty: item.qty });
    }
  }
  const grouped = /* @__PURE__ */ new Map();
  const nextSplits = [];
  const now = (/* @__PURE__ */ new Date()).toISOString();
  for (const entry of entries) {
    if (typeof entry.orderItemId !== "string" || typeof entry.guestParticipationId !== "string" || typeof entry.quantity !== "number" || !Number.isFinite(entry.quantity) || entry.quantity <= 0) {
      return invalid3("Divis\xE3o de item inv\xE1lida.");
    }
    const item = itemMap.get(entry.orderItemId);
    if (!item) return invalid3("Item de pedido n\xE3o pertence \xE0 comanda.");
    if (!participations.has(entry.guestParticipationId)) {
      return invalid3("Participante inv\xE1lido para esta comanda.");
    }
    grouped.set(entry.orderItemId, (grouped.get(entry.orderItemId) || 0) + entry.quantity);
    nextSplits.push({
      id: id("ois_"),
      orderItemId: entry.orderItemId,
      orderId: item.orderId,
      commandId,
      guestParticipationId: entry.guestParticipationId,
      quantity: entry.quantity,
      createdAt: now
    });
  }
  for (const [orderItemId, itemInfo] of itemMap.entries()) {
    const assigned = grouped.get(orderItemId) || 0;
    if (assigned > 0 && Math.abs(assigned - itemInfo.qty) > 1e-4) {
      return invalid3("A soma das divis\xF5es deve corresponder \xE0 quantidade do item.");
    }
  }
  for (const [splitId, split] of Object.entries(store.orderItemSplits)) {
    if (split.commandId === commandId) delete store.orderItemSplits[splitId];
  }
  for (const split of nextSplits) {
    store.orderItemSplits[split.id] = split;
  }
  recordAudit(store, {
    establishmentId,
    type: "splits.updated",
    actorType: "STAFF",
    actorUserId,
    targetType: "command",
    targetId: commandId,
    metadata: { count: nextSplits.length }
  });
  saveStore(store);
  return { value: { splits: nextSplits } };
}
function registerPayment(establishmentId, commandId, body, actorUser) {
  const store = getStore();
  ensureOperationalCollections(store);
  const command = store.commands[commandId];
  if (!command || command.establishmentId !== establishmentId) {
    return invalid3("Comanda n\xE3o encontrada.", 404);
  }
  if (command.status === "FECHADA") {
    return invalid3("Comanda j\xE1 encerrada.", 409);
  }
  if (!body || typeof body !== "object") return invalid3("Corpo inv\xE1lido.");
  const payload = body;
  const amount = Number(payload.amount);
  const method = payload.method;
  if (!method || !PAYMENT_METHODS.has(method)) {
    return invalid3("Forma de pagamento inv\xE1lida.");
  }
  const amountError = validatePaymentAmount(amount);
  if (amountError) return invalid3(amountError);
  const participations = commandParticipations(store, command.id);
  if (payload.guestParticipationId) {
    const participation = participations.find((entry) => entry.id === payload.guestParticipationId);
    if (!participation) return invalid3("Participante inv\xE1lido para esta comanda.");
  }
  const orders = commandOrders2(store, command.id);
  const splits = commandSplits2(store, command.id);
  const payments = commandPayments2(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);
  const maxAmount = payload.guestParticipationId ? summary.participants.find((entry) => entry.guestParticipationId === payload.guestParticipationId)?.remainingTotal : summary.remainingTotal;
  const maxError = validatePaymentAmount(amount, maxAmount);
  if (maxError) return invalid3(maxError);
  const payment = {
    id: id("pay_"),
    establishmentId,
    commandId,
    guestParticipationId: payload.guestParticipationId,
    amount,
    method,
    status: "registered",
    registeredByUserId: actorUser.id,
    registeredAt: (/* @__PURE__ */ new Date()).toISOString(),
    note: typeof payload.note === "string" ? payload.note.trim() : void 0
  };
  store.payments[payment.id] = payment;
  recordAudit(store, {
    establishmentId,
    type: "payment.registered",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "payment",
    targetId: payment.id,
    metadata: { commandId, amount, method }
  });
  const table = store.tables[command.tableId];
  notifyStaff(
    store,
    establishmentId,
    "payment.registered",
    "Pagamento registrado",
    `Mesa ${table?.number || "?"} \xB7 ${amount.toFixed(2)}`,
    {
      commandId,
      tableId: command.tableId,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(command.tableId)}`
    }
  );
  saveStore(store);
  const nextSummary = buildClosingSummary(
    orders,
    participations,
    splits,
    [...payments, payment]
  );
  return { value: { payment, summary: nextSummary } };
}
function voidPayment(establishmentId, paymentId, actorUser) {
  const store = getStore();
  ensureOperationalCollections(store);
  const payment = store.payments[paymentId];
  if (!payment || payment.establishmentId !== establishmentId) {
    return invalid3("Pagamento n\xE3o encontrado.", 404);
  }
  if (payment.status === "voided") {
    return { value: { payment } };
  }
  const command = store.commands[payment.commandId];
  if (!command || command.status === "FECHADA") {
    return invalid3("N\xE3o \xE9 poss\xEDvel estornar pagamento de comanda encerrada.", 409);
  }
  payment.status = "voided";
  payment.voidedAt = (/* @__PURE__ */ new Date()).toISOString();
  payment.voidedByUserId = actorUser.id;
  store.payments[paymentId] = payment;
  if (payment.guestParticipationId) {
    clearPaymentConfirmationIfUnsettled(store, payment.guestParticipationId);
  }
  recordAudit(store, {
    establishmentId,
    type: "payment.voided",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "payment",
    targetId: payment.id,
    metadata: { commandId: payment.commandId }
  });
  saveStore(store);
  return { value: { payment } };
}
function confirmClosingRequest(establishmentId, closingRequestId, actorUser) {
  const store = getStore();
  ensureOperationalCollections(store);
  const request = store.closingRequests[closingRequestId];
  if (!request || request.establishmentId !== establishmentId) {
    return invalid3("Solicita\xE7\xE3o de fechamento n\xE3o encontrada.", 404);
  }
  if (request.status === "CONFIRMED" || request.status === "SETTLED") {
    return { value: { closingRequest: request } };
  }
  if (request.status !== "PENDING") {
    return invalid3("Solicita\xE7\xE3o n\xE3o est\xE1 pendente.", 409);
  }
  const command = store.commands[request.commandId];
  if (!command) return invalid3("Comanda n\xE3o encontrada.", 404);
  const orders = commandOrders2(store, command.id);
  const participations = commandParticipations(store, command.id);
  const splits = commandSplits2(store, command.id);
  const payments = commandPayments2(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);
  const targetIds = request.scope === "TABLE" ? participations.map((entry) => entry.id) : request.targetGuestParticipationIds;
  const targetsSettled = targetIds.every((targetId) => {
    const participant = summary.participants.find((entry) => entry.guestParticipationId === targetId);
    return participant?.isSettled ?? false;
  });
  if (!targetsSettled) {
    return invalid3("Pagamentos pendentes para confirmar o fechamento.", 409);
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  request.status = "CONFIRMED";
  request.confirmedAt = now;
  request.confirmedByUserId = actorUser.id;
  store.closingRequests[closingRequestId] = request;
  for (const participationId of targetIds) {
    const participation = store.guestParticipations[participationId];
    if (!participation) continue;
    participation.status = "CLOSED";
    participation.closedAt = now;
    participation.closedByUserId = actorUser.id;
    store.guestParticipations[participationId] = participation;
  }
  recordAudit(store, {
    establishmentId,
    type: "closing.confirmed",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "closing_request",
    targetId: request.id,
    metadata: { commandId: request.commandId, scope: request.scope }
  });
  saveStore(store);
  return { value: { closingRequest: request } };
}
function settleCommand(establishmentId, commandId, actorUser) {
  const store = getStore();
  ensureOperationalCollections(store);
  const command = store.commands[commandId];
  if (!command || command.establishmentId !== establishmentId) {
    return invalid3("Comanda n\xE3o encontrada.", 404);
  }
  if (command.status === "FECHADA") {
    const table2 = store.tables[command.tableId];
    return { value: { command, table: table2 } };
  }
  const orders = commandOrders2(store, command.id);
  const participations = commandParticipations(store, command.id);
  const splits = commandSplits2(store, command.id);
  const payments = commandPayments2(store, command.id);
  const summary = buildClosingSummary(orders, participations, splits, payments);
  if (!summary.canSettle) {
    return invalid3("Ainda h\xE1 saldo pendente para encerrar a comanda.", 409);
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  command.status = "FECHADA";
  command.closedAt = now;
  store.commands[commandId] = command;
  const table = store.tables[command.tableId];
  if (table) {
    table.status = "LIVRE";
    table.commandId = void 0;
    store.tables[table.id] = table;
  }
  for (const participation of Object.values(store.guestParticipations)) {
    if (participation.commandId !== commandId || participation.status === "CLOSED") continue;
    participation.status = "CLOSED";
    participation.closedAt = now;
    participation.closedByUserId = actorUser.id;
    store.guestParticipations[participation.id] = participation;
  }
  for (const request of Object.values(store.closingRequests)) {
    if (request.commandId !== commandId || request.status === "SETTLED") continue;
    request.status = "SETTLED";
    request.settledAt = now;
    request.settledByUserId = actorUser.id;
    store.closingRequests[request.id] = request;
  }
  recordAudit(store, {
    establishmentId,
    type: "command.settled",
    actorType: "STAFF",
    actorUserId: actorUser.id,
    targetType: "command",
    targetId: commandId,
    metadata: { tableId: command.tableId }
  });
  saveStore(store);
  emit({ type: "command.updated", commandId, establishmentId });
  return { value: { command, table } };
}
function markNotificationRead(establishmentId, notificationId) {
  const store = getStore();
  const notification = store.notifications[notificationId];
  if (!notification || notification.establishmentId !== establishmentId) {
    return invalid3("Notifica\xE7\xE3o n\xE3o encontrada.", 404);
  }
  notification.read = true;
  store.notifications[notificationId] = notification;
  saveStore(store);
  return { value: { notification } };
}
var INTEGRATION_CATALOG = [
  { provider: "ifood", label: "iFood", description: "Receba pedidos do marketplace no painel." },
  { provider: "rappi", label: "Rappi", description: "Sincronize card\xE1pio e pedidos delivery." },
  { provider: "whatsapp", label: "WhatsApp", description: "Atendimento e confirma\xE7\xF5es por mensagem." },
  { provider: "erp", label: "ERP / PDV", description: "Exporte vendas para seu sistema financeiro." },
  { provider: "webhook", label: "Webhook", description: "Envie eventos para sua pr\xF3pria API." }
];
function listIntegrations(establishmentId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const existing = Object.values(store.integrationConnections).filter(
    (entry) => entry.establishmentId === establishmentId
  );
  const byProvider = new Map(existing.map((entry) => [entry.provider, entry]));
  const items = INTEGRATION_CATALOG.map((item) => {
    const connection = byProvider.get(item.provider);
    return {
      provider: item.provider,
      label: item.label,
      description: item.description,
      status: connection?.status || "available",
      connection,
      canConnect: !connection || connection.status === "available" || connection.status === "disabled"
    };
  });
  return { items };
}
function ensureIntegrationCatalog(establishmentId) {
  const store = getStore();
  ensureOperationalCollections(store);
  for (const item of INTEGRATION_CATALOG) {
    const existing = Object.values(store.integrationConnections).find(
      (entry) => entry.establishmentId === establishmentId && entry.provider === item.provider
    );
    if (existing) continue;
    const connection = {
      id: id("int_"),
      establishmentId,
      provider: item.provider,
      status: "available",
      label: item.label,
      config: {}
    };
    store.integrationConnections[connection.id] = connection;
  }
  saveStore(store);
}
var INTEGRATION_PROVIDERS = new Set(
  INTEGRATION_CATALOG.map((item) => item.provider)
);
function connectIntegration(establishmentId, provider, config, actorUserId) {
  if (!INTEGRATION_PROVIDERS.has(provider)) {
    return invalid3("Provedor de integra\xE7\xE3o inv\xE1lido.", 400);
  }
  const store = getStore();
  ensureOperationalCollections(store);
  ensureIntegrationCatalog(establishmentId);
  const connection = Object.values(store.integrationConnections).find(
    (entry) => entry.establishmentId === establishmentId && entry.provider === provider
  );
  if (!connection) return invalid3("Integra\xE7\xE3o n\xE3o encontrada.", 404);
  const sanitized = {};
  for (const [key, value] of Object.entries(config)) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) sanitized[key] = trimmed.slice(0, 500);
  }
  if (provider === "webhook" && !sanitized.url) {
    return invalid3("Informe a URL do webhook.", 400);
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  connection.config = { ...connection.config, ...sanitized };
  connection.status = "connected";
  connection.connectedAt = now;
  connection.lastError = void 0;
  store.integrationConnections[connection.id] = connection;
  recordAudit(store, {
    establishmentId,
    type: "integration.connected",
    actorType: "STAFF",
    actorUserId,
    targetType: "integration",
    targetId: connection.id,
    metadata: { provider }
  });
  saveStore(store);
  return { value: { connection } };
}
function disconnectIntegration(establishmentId, provider, actorUserId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const connection = Object.values(store.integrationConnections).find(
    (entry) => entry.establishmentId === establishmentId && entry.provider === provider
  );
  if (!connection) return invalid3("Integra\xE7\xE3o n\xE3o encontrada.", 404);
  connection.status = "disabled";
  connection.config = {};
  connection.connectedAt = void 0;
  connection.lastSyncAt = void 0;
  store.integrationConnections[connection.id] = connection;
  recordAudit(store, {
    establishmentId,
    type: "integration.disconnected",
    actorType: "STAFF",
    actorUserId,
    targetType: "integration",
    targetId: connection.id,
    metadata: { provider }
  });
  saveStore(store);
  return { value: { connection } };
}
async function testWebhookStub(establishmentId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const connection = Object.values(store.integrationConnections).find(
    (entry) => entry.establishmentId === establishmentId && entry.provider === "webhook" && entry.status === "connected"
  );
  if (!connection?.config.url) {
    return invalid3("Configure e conecte o webhook antes de testar.", 400);
  }
  const payload = {
    event: "mesaflow.test",
    establishmentId,
    sentAt: (/* @__PURE__ */ new Date()).toISOString(),
    message: "Evento de teste MesaFlow \u2014 nenhuma a\xE7\xE3o necess\xE1ria."
  };
  try {
    const response = await fetch(connection.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MesaFlow-Event": "test",
        ...connection.config.secret ? { "X-MesaFlow-Signature": connection.config.secret.slice(0, 8) + "\u2026" } : {}
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8e3)
    });
    const preview = (await response.text()).slice(0, 200);
    connection.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
    connection.lastError = response.ok ? void 0 : `HTTP ${response.status}`;
    store.integrationConnections[connection.id] = connection;
    saveStore(store);
    return {
      value: {
        delivered: response.ok,
        status: response.status,
        preview: preview || "(sem corpo)"
      }
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao chamar webhook.";
    connection.lastError = message;
    store.integrationConnections[connection.id] = connection;
    saveStore(store);
    return invalid3(message, 502);
  }
}
function activateTable(establishmentId, tableId, actorUserId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid3("Mesa n\xE3o encontrada.", 404);
  }
  if (table.status === "INATIVA") {
    return invalid3("Mesa inativa n\xE3o pode ser ativada.", 409);
  }
  const existing = getActiveCommand(table);
  const command = existing || getOrOpenCommand(table);
  recordAudit(store, {
    establishmentId,
    type: "table.activated",
    actorType: "STAFF",
    actorUserId,
    targetType: "table",
    targetId: tableId,
    metadata: { commandId: command.id, tableNumber: table.number }
  });
  notifyStaff(
    store,
    establishmentId,
    "table.activated",
    "Mesa ativada",
    `Mesa ${table.number} pronta para receber clientes`,
    {
      commandId: command.id,
      tableId: table.id,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`
    }
  );
  saveStore(store);
  emit({ type: "command.updated", commandId: command.id, establishmentId });
  return { value: { table: store.tables[tableId], command } };
}
var STALE_PARTICIPATION_MS2 = 12 * 60 * 60 * 1e3;
function forceClearTable(establishmentId, tableId, actorUserId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid3("Mesa n\xE3o encontrada.", 404);
  }
  const command = (table.commandId ? store.commands[table.commandId] : null) || Object.values(store.commands).find(
    (entry) => entry.establishmentId === establishmentId && entry.tableId === tableId && entry.status !== "FECHADA"
  ) || null;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let closedParticipations = 0;
  const closeParticipation = (participation) => {
    if (participation.status === "CLOSED") return;
    participation.status = "CLOSED";
    participation.closedAt = now;
    participation.closedByUserId = actorUserId;
    store.guestParticipations[participation.id] = participation;
    revokeSessionsForParticipation(store, participation.id);
    closedParticipations += 1;
  };
  if (command) {
    for (const participation of Object.values(store.guestParticipations)) {
      if (participation.commandId !== command.id) continue;
      closeParticipation(participation);
    }
    command.status = "FECHADA";
    command.closedAt = now;
    store.commands[command.id] = command;
    for (const request of Object.values(store.closingRequests)) {
      if (request.commandId !== command.id || request.status === "SETTLED") continue;
      request.status = "SETTLED";
      request.settledAt = now;
      request.settledByUserId = actorUserId;
      store.closingRequests[request.id] = request;
    }
    emit({ type: "command.updated", commandId: command.id, establishmentId });
  } else {
    for (const participation of Object.values(store.guestParticipations)) {
      if (participation.tableId !== tableId || participation.establishmentId !== establishmentId) {
        continue;
      }
      closeParticipation(participation);
    }
  }
  table.status = "LIVRE";
  table.commandId = void 0;
  store.tables[table.id] = table;
  recordAudit(store, {
    establishmentId,
    type: "table.force_cleared",
    actorType: "STAFF",
    actorUserId,
    targetType: "table",
    targetId: tableId,
    metadata: {
      commandId: command?.id,
      closedParticipations
    }
  });
  saveStore(store);
  return { value: { table, command, closedParticipations } };
}
function listAdminOperations(establishmentId) {
  const store = getStore();
  ensureOperationalCollections(store);
  const now = Date.now();
  const activeTables = Object.values(store.tables).filter(
    (table) => table.establishmentId === establishmentId && table.status !== "INATIVA" && (table.status === "OCUPADA" || table.status === "AGUARDANDO_PAGAMENTO" || Boolean(table.commandId))
  ).map((table) => {
    const command = (table.commandId ? store.commands[table.commandId] : null) || Object.values(store.commands).find(
      (entry) => entry.tableId === table.id && entry.establishmentId === establishmentId && entry.status !== "FECHADA"
    ) || null;
    const participants = command ? Object.values(store.guestParticipations).filter(
      (gp) => gp.commandId === command.id && gp.status !== "CLOSED"
    ) : [];
    return { table, command, participants };
  });
  const staleParticipations = Object.values(store.guestParticipations).filter((gp) => {
    if (gp.establishmentId !== establishmentId) return false;
    if (gp.status === "CLOSED") return false;
    const joinedAge = now - new Date(gp.joinedAt).getTime();
    if (joinedAge > STALE_PARTICIPATION_MS2) return true;
    const command = store.commands[gp.commandId];
    if (command && command.status === "FECHADA") return true;
    return false;
  });
  return { activeTables, staleParticipations };
}

// src/lib/guest-closing.ts
function invalid4(error, status = 400) {
  return { error, status };
}
function activeParticipations(store, commandId) {
  return Object.values(store.guestParticipations).filter(
    (gp) => gp.commandId === commandId && gp.status !== "CLOSED"
  );
}
function pendingRequestForParticipation(store, commandId, participationId) {
  return Object.values(store.closingRequests).find(
    (request) => request.commandId === commandId && request.status === "PENDING" && (request.requestedByGuestParticipationId === participationId || request.targetGuestParticipationIds.includes(participationId))
  ) || null;
}
function markParticipationsClosing(store, participationIds, closing) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  for (const participationId of participationIds) {
    const participation = store.guestParticipations[participationId];
    if (!participation || participation.status === "CLOSED") continue;
    if (closing) {
      participation.status = "CLOSING_REQUESTED";
      participation.closingRequestedAt = now;
    } else if (participation.status === "CLOSING_REQUESTED") {
      participation.status = "OPEN";
      participation.closingRequestedAt = void 0;
    }
    store.guestParticipations[participationId] = participation;
  }
}
function applyTableClosingState(store, command, table, closing) {
  if (closing) {
    command.status = "PAGAMENTO_SOLICITADO";
    command.closingRequestedAt = command.closingRequestedAt || (/* @__PURE__ */ new Date()).toISOString();
    command.lastClosingScope = "TABLE";
    table.status = "AGUARDANDO_PAGAMENTO";
  } else {
    const hasPending = Object.values(store.closingRequests).some(
      (request) => request.commandId === command.id && request.status === "PENDING"
    );
    const anyClosing = activeParticipations(store, command.id).some(
      (gp) => gp.status === "CLOSING_REQUESTED"
    );
    if (!hasPending && !anyClosing) {
      command.status = "ABERTA";
      command.closingRequestedAt = void 0;
      command.lastClosingScope = void 0;
      if (table.status === "AGUARDANDO_PAGAMENTO") {
        table.status = "OCUPADA";
      }
    }
  }
  store.commands[command.id] = command;
  store.tables[table.id] = table;
}
function getGuestClosingStatus(participationId) {
  const store = getStore();
  migrateOperationalCollections2(store);
  const participation = store.guestParticipations[participationId];
  if (!participation) return null;
  const pending = Object.values(store.closingRequests).filter(
    (request) => request.commandId === participation.commandId && request.status === "PENDING"
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const ownRequest = pending.find((request) => request.requestedByGuestParticipationId === participationId) || pending.find((request) => request.targetGuestParticipationIds.includes(participationId)) || null;
  return {
    participationStatus: participation.status,
    pendingRequest: ownRequest,
    canCancel: participation.status === "CLOSING_REQUESTED" && Boolean(
      ownRequest && ownRequest.requestedByGuestParticipationId === participationId && ownRequest.status === "PENDING"
    ),
    canOrder: participation.status === "OPEN"
  };
}
function requestGuestClosing(participationId, scope, targetGuestParticipationIds = []) {
  const store = getStore();
  migrateOperationalCollections2(store);
  const participation = store.guestParticipations[participationId];
  if (!participation) return invalid4("Participa\xE7\xE3o n\xE3o encontrada.", 404);
  if (participation.status === "CLOSED") {
    return invalid4("Participa\xE7\xE3o j\xE1 encerrada.", 409);
  }
  if (participation.status === "CLOSING_REQUESTED") {
    const existing = pendingRequestForParticipation(
      store,
      participation.commandId,
      participationId
    );
    if (existing) {
      return { value: { closingRequest: existing, participation } };
    }
    return invalid4("Fechamento j\xE1 solicitado.", 409);
  }
  if (participation.status !== "OPEN") {
    return invalid4("Participa\xE7\xE3o n\xE3o permite solicitar fechamento.", 409);
  }
  const command = store.commands[participation.commandId];
  if (!command || command.status === "FECHADA") {
    return invalid4("Comanda indispon\xEDvel.", 409);
  }
  const table = store.tables[participation.tableId];
  if (!table) return invalid4("Mesa n\xE3o encontrada.", 404);
  const active = activeParticipations(store, command.id);
  let targetIds = [];
  if (scope === "SELF") {
    targetIds = [participationId];
  } else if (scope === "TABLE") {
    targetIds = active.map((gp) => gp.id);
    if (targetIds.length === 0) targetIds = [participationId];
  } else if (scope === "SELECTED") {
    const unique = [.../* @__PURE__ */ new Set([participationId, ...targetGuestParticipationIds])];
    const invalidTarget = unique.find(
      (targetId) => !active.some((gp) => gp.id === targetId)
    );
    if (invalidTarget) return invalid4("Participante selecionado inv\xE1lido.", 400);
    if (unique.length < 2) {
      return invalid4("Selecione ao menos um participante al\xE9m de voc\xEA.", 400);
    }
    targetIds = unique;
  } else {
    return invalid4("Escopo de fechamento inv\xE1lido.", 400);
  }
  const duplicate = Object.values(store.closingRequests).find(
    (request) => request.commandId === command.id && request.status === "PENDING" && request.scope === scope && request.requestedByGuestParticipationId === participationId && request.targetGuestParticipationIds.length === targetIds.length && request.targetGuestParticipationIds.every((id2) => targetIds.includes(id2))
  );
  if (duplicate) {
    markParticipationsClosing(store, targetIds, true);
    saveStore(store);
    return { value: { closingRequest: duplicate, participation: store.guestParticipations[participationId] } };
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const closingRequest = {
    id: id("clr_"),
    establishmentId: participation.establishmentId,
    commandId: command.id,
    tableId: table.id,
    requestedByGuestParticipationId: participationId,
    scope,
    targetGuestParticipationIds: targetIds,
    status: "PENDING",
    createdAt: now
  };
  store.closingRequests[closingRequest.id] = closingRequest;
  markParticipationsClosing(store, targetIds, true);
  if (scope === "TABLE") {
    applyTableClosingState(store, command, table, true);
  }
  const displayName = participation.displayName?.trim() || `Participante ${participation.participantIndex}`;
  notifyStaff(
    store,
    participation.establishmentId,
    "closing.requested",
    scope === "TABLE" ? "Conta da mesa solicitada" : "Fechamento parcial solicitado",
    `${displayName} \xB7 Mesa ${table.number}`,
    {
      commandId: command.id,
      tableId: table.id,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`,
      metadata: { scope, closingRequestId: closingRequest.id }
    }
  );
  saveStore(store);
  emit({
    type: "command.updated",
    commandId: command.id,
    establishmentId: participation.establishmentId
  });
  return {
    value: {
      closingRequest,
      participation: store.guestParticipations[participationId]
    }
  };
}
function cancelGuestClosing(participationId) {
  const store = getStore();
  migrateOperationalCollections2(store);
  const participation = store.guestParticipations[participationId];
  if (!participation) return invalid4("Participa\xE7\xE3o n\xE3o encontrada.", 404);
  if (participation.status !== "CLOSING_REQUESTED") {
    return { value: { participation, cancelled: false } };
  }
  const request = Object.values(store.closingRequests).find(
    (entry) => entry.commandId === participation.commandId && entry.status === "PENDING" && entry.requestedByGuestParticipationId === participationId
  );
  if (!request) {
    return invalid4("Somente quem solicitou pode cancelar o fechamento.", 403);
  }
  request.status = "CANCELLED";
  request.cancelledAt = (/* @__PURE__ */ new Date()).toISOString();
  store.closingRequests[request.id] = request;
  markParticipationsClosing(store, request.targetGuestParticipationIds, false);
  const command = store.commands[participation.commandId];
  const table = store.tables[participation.tableId];
  if (command && table && request.scope === "TABLE") {
    applyTableClosingState(store, command, table, false);
  }
  saveStore(store);
  if (command) {
    emit({
      type: "command.updated",
      commandId: command.id,
      establishmentId: participation.establishmentId
    });
  }
  return {
    value: {
      participation: store.guestParticipations[participationId],
      cancelled: true
    }
  };
}

// src/lib/kds-queue.ts
function getKdsQueue(establishmentId, sectorId) {
  const store = getStore();
  const sectors = Object.values(store.sectors).filter(
    (sector2) => sector2.establishmentId === establishmentId && sector2.active
  );
  const sector = sectors.find((entry) => entry.id === sectorId) || null;
  if (!sector) return null;
  const orders = Object.values(store.orders).filter(
    (order) => order.establishmentId === establishmentId && !["ENTREGUE", "CANCELADO"].includes(order.status) && order.items.some((item) => item.sectorId === sectorId)
  ).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const participations = Object.fromEntries(
    Object.values(store.guestParticipations).filter((gp) => gp.establishmentId === establishmentId).map((gp) => [
      gp.id,
      gp.displayName?.trim() || `Participante ${gp.participantIndex}`
    ])
  );
  const tickets = orders.flatMap((order) => {
    const items = order.items.filter((item) => item.sectorId === sectorId);
    if (!items.length) return [];
    const participantName = participations[order.guestParticipationId] || "Cliente";
    return [{ order, items, participantName }];
  });
  const establishment = Object.values(store.establishments).find(
    (entry) => entry.id === establishmentId
  );
  return {
    sector,
    sectors,
    tickets,
    orderCount: orders.length,
    soundNotifications: establishment?.settings.soundNotifications ?? true
  };
}

// src/lib/guest-cookie-web.ts
var CLIENT_COOKIE = "mf_cs";
function parseClientCookieHeader(cookieHeader) {
  if (!cookieHeader) return void 0;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${CLIENT_COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(CLIENT_COOKIE.length + 1));
    }
  }
  return void 0;
}
function clientCookiePath() {
  const prefix = process.env.MESAFLOW_API_PREFIX || process.env.NEXT_PUBLIC_API_PREFIX;
  if (prefix) return `/api/${prefix}`;
  if (process.env.VERCEL) return "/api/mesaflow";
  return "/api";
}
function buildClientCookie(token) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${CLIENT_COOKIE}=${encodeURIComponent(token)}; Path=${clientCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`;
}
function clearClientCookieValue() {
  const secure = process.env.VERCEL ? "; Secure" : "";
  return `${CLIENT_COOKIE}=; Path=${clientCookiePath()}; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

// src/lib/guest-cookie.ts
function parseClientCookie(req) {
  const raw = req.headers.cookie;
  if (typeof raw === "string") return parseClientCookieHeader(raw);
  if (Array.isArray(raw)) return parseClientCookieHeader(raw.join("; "));
  return void 0;
}
function setClientCookie(res, token) {
  res.setHeader("Set-Cookie", buildClientCookie(token));
}
function clearClientCookie(res) {
  res.setHeader("Set-Cookie", clearClientCookieValue());
}

// src/lib/media-upload.ts
var import_blob2 = require("@vercel/blob");
var MAX_BYTES = 4 * 1024 * 1024;
var ALLOWED_TYPES = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);
function safeFilename(filename) {
  const base = filename.split(/[/\\]/).pop() || "image";
  return base.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "image";
}
async function uploadProductImage(establishmentId, file, runtimeOidcToken2) {
  if (!establishmentId.trim()) {
    return { error: "Estabelecimento inv\xE1lido.", status: 400 };
  }
  const contentType = String(file.contentType || "").toLowerCase().split(";")[0].trim();
  if (!ALLOWED_TYPES.has(contentType)) {
    return { error: "Tipo de arquivo n\xE3o permitido. Use JPEG, PNG, WebP ou GIF.", status: 400 };
  }
  const bytes = file.bytes instanceof Buffer ? file.bytes : Buffer.from(file.bytes);
  if (!bytes.length) return { error: "Arquivo vazio.", status: 400 };
  if (bytes.length > MAX_BYTES) {
    return { error: "Arquivo excede o limite de 4MB.", status: 400 };
  }
  if (!blobConfigured(runtimeOidcToken2)) {
    return { error: "Armazenamento de m\xEDdia n\xE3o configurado.", status: 503 };
  }
  const pathname = `mesaflow/media/${establishmentId}/${Date.now()}-${safeFilename(file.filename)}`;
  try {
    const result = await (0, import_blob2.put)(pathname, bytes, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      ...blobAuthOptions(runtimeOidcToken2)
    });
    return { url: result.url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha no upload.",
      status: 502
    };
  }
}
function parseBase64UploadBody(body) {
  if (!body || typeof body !== "object") return { error: "Corpo inv\xE1lido." };
  const payload = body;
  if (typeof payload.filename !== "string" || !payload.filename.trim()) {
    return { error: "filename \xE9 obrigat\xF3rio." };
  }
  if (typeof payload.contentType !== "string" || !payload.contentType.trim()) {
    return { error: "contentType \xE9 obrigat\xF3rio." };
  }
  if (typeof payload.dataBase64 !== "string" || !payload.dataBase64.trim()) {
    return { error: "dataBase64 \xE9 obrigat\xF3rio." };
  }
  try {
    const bytes = Buffer.from(payload.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
    return {
      filename: payload.filename.trim(),
      contentType: payload.contentType.trim(),
      bytes
    };
  } catch {
    return { error: "dataBase64 inv\xE1lido." };
  }
}

// src/lib/order-resolve.ts
function hasClientPricing(item) {
  return "unitPrice" in item || "variantDelta" in item || Array.isArray(item.addons) && item.addons.some((addon) => typeof addon === "object" && addon !== null && "price" in addon);
}
function resolveAddon(product, addonId, qty) {
  const addon = product.addons.find((entry) => entry.id === addonId);
  if (!addon) return null;
  const maxQty = addon.maxQty ?? 99;
  if (qty < 1 || qty > maxQty) return null;
  return { addonId: addon.id, name: addon.name, price: addon.price, qty };
}
function resolveOrderLines(store, establishmentId, sectors, lines, options) {
  if (!lines.length) {
    return { ok: false, status: 400, error: "Carrinho vazio." };
  }
  const items = [];
  let lineIndex = 0;
  for (const raw of lines) {
    const line = raw;
    if (hasClientPricing(line)) {
      return {
        ok: false,
        status: 400,
        error: "Pre\xE7os devem ser calculados pelo servidor. Envie apenas productId, qty, variantId e addonIds."
      };
    }
    const product = store.products[line.productId];
    if (!product || product.establishmentId !== establishmentId || !product.active) {
      return { ok: false, status: 400, error: `Produto inv\xE1lido: ${line.productId}` };
    }
    const qty = Number(line.qty);
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      return { ok: false, status: 400, error: `Quantidade inv\xE1lida para ${product.name}.` };
    }
    let variantName;
    let variantDelta = 0;
    if (line.variantId) {
      const variant = product.variants.find((entry) => entry.id === line.variantId);
      if (!variant) {
        return { ok: false, status: 400, error: `Varia\xE7\xE3o inv\xE1lida para ${product.name}.` };
      }
      variantName = variant.name;
      variantDelta = variant.priceDelta;
    } else if (product.variants.length > 0) {
      return { ok: false, status: 400, error: `Selecione uma varia\xE7\xE3o para ${product.name}.` };
    }
    const addonCounts = /* @__PURE__ */ new Map();
    for (const addonId of line.addonIds || []) {
      addonCounts.set(addonId, (addonCounts.get(addonId) || 0) + 1);
    }
    const addons = [];
    for (const [addonId, addonQty] of addonCounts) {
      const resolved = resolveAddon(product, addonId, addonQty);
      if (!resolved) {
        return { ok: false, status: 400, error: `Adicional inv\xE1lido para ${product.name}.` };
      }
      addons.push(resolved);
    }
    const item = {
      id: `oi_${Date.now()}_${lineIndex++}`,
      productId: product.id,
      productName: product.name,
      sectorId: product.sectorId,
      sectorName: sectors[product.sectorId]?.name || "",
      qty,
      unitPrice: options?.unitPriceFor ? options.unitPriceFor(product) : product.price,
      variantName,
      variantDelta,
      addons,
      notes: line.notes?.trim() || void 0,
      status: "NOVO"
    };
    items.push(item);
  }
  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);
  return { ok: true, items, total };
}

// ../iphone-imports/api/_mesaflow/handler.ts
function resolvePath(req) {
  const q = req.query?.path;
  if (Array.isArray(q) && q.length > 0) return "/" + q.map(String).join("/");
  if (typeof q === "string" && q.length > 0) return "/" + q.replace(/^\/+/, "");
  const originalUrl = req.url || "/";
  const qIndex = originalUrl.indexOf("?");
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
  const stripped = pathname.replace(/^\/api\/mesaflow\/?/, "/") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}
async function json(res, status, body, options) {
  if (!options?.skipFlush) {
    const persist2 = await flushPersistentStore();
    if (!persist2.blob && persist2.blobError) {
      console.warn("[mesaflow] blob persist skipped/failed", persist2.blobError);
    }
  }
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.send(JSON.stringify(body));
}
function blobSetupHint(storage) {
  if (storage.hasToken) return "";
  if (storage.hasStoreId && !storage.hasOidc && !storage.hasOidcHeader) {
    return "BLOB_STORE_ID existe mas OIDC n\xE3o chegou na function. Fa\xE7a Redeploy ou adicione BLOB_READ_WRITE_TOKEN manualmente.";
  }
  if ((storage.hasOidc || storage.hasOidcHeader) && !storage.hasStoreId) {
    return "OIDC ok mas BLOB_STORE_ID ausente \u2014 o Blob provavelmente est\xE1 conectado a OUTRO projeto Vercel. Em Storage \u2192 Blob \u2192 Projects \u2192 conecte o projeto certo (Production + Preview).";
  }
  if (storage.blobEnvKeys.length === 0) {
    return "Nenhuma vari\xE1vel BLOB/OIDC nesta function. Storage \u2192 Blob \u2192 Connect to Project. Ou adicione BLOB_READ_WRITE_TOKEN em Environment Variables e redeploy.";
  }
  if (storage.lastError) {
    return `Persist\xEAncia falhou: ${storage.lastError}. Adicione BLOB_READ_WRITE_TOKEN (token Read-Write do Blob) e redeploy.`;
  }
  return "Storage \u2192 Blob \u2192 Connect to Project \u2192 marque Production + Preview \u2192 Redeploy.";
}
function readOidcHeader(req) {
  const value = req.headers["x-vercel-oidc-token"];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return void 0;
}
function readBearer(req) {
  const authorization = req.headers.authorization;
  const match = typeof authorization === "string" && authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : void 0;
}
function readGuestToken(req) {
  return readBearer(req) || parseClientCookie(req);
}
function adminAuth(req) {
  const auth = validateSession(readBearer(req));
  return auth && (auth.user.role === "OWNER" || auth.user.role === "MANAGER") ? auth : null;
}
function dashboardAuth(req) {
  const auth = validateSession(readBearer(req));
  const allowed = ["OWNER", "MANAGER", "COUNTER", "WAITER", "KITCHEN"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}
function staffAuth(req, roles) {
  const auth = validateSession(readBearer(req));
  const allowed = roles ?? ["OWNER", "MANAGER", "COUNTER", "WAITER"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}
function kitchenAuth(req) {
  const auth = validateSession(readBearer(req));
  if (!auth) return null;
  if (auth.user.role === "OWNER" || auth.user.role === "MANAGER" || auth.user.role === "KITCHEN" || auth.user.role === "COUNTER") {
    return auth;
  }
  return null;
}
async function handler(req, res) {
  setPersistentStoreOidcToken(readOidcHeader(req));
  if (req.method === "OPTIONS") return json(res, 204, {});
  try {
    await hydratePersistentStore();
    const path = resolvePath(req);
    const store = getStore();
    if (req.method === "GET" && path === "/health") {
      const hasOidcHeader = Boolean(readOidcHeader(req));
      const storage = blobDiagnostics(hasOidcHeader);
      const probe = await probeBlobStorage();
      const redisProbe = await probeRedisStorage();
      const persist2 = await flushPersistentStore();
      const blobOk = probe.ok || storage.hasToken && storage.configured;
      const sharedOk = persist2.blob === true || persist2.redis === true || redisProbe.ok === true && storage.redis?.configured === true;
      const establishments = Object.keys(store.establishments).length;
      return json(
        res,
        200,
        {
          ok: true,
          service: "mesaflow",
          blob: blobOk,
          shared: sharedOk,
          establishments,
          storage: { ...storage, probe, redisProbe, persist: persist2 },
          setup: sharedOk ? void 0 : persist2.redisError ? `Redis falhou: ${persist2.redisError}. Verifique UPSTASH_REDIS_REST_URL/TOKEN.` : blobSetupHint({ ...storage, lastError: persist2.blobError ?? storage.lastError })
        },
        { skipFlush: true }
      );
    }
    if (req.method === "GET" && path === "/guest/table-context") {
      const slug = String(req.query?.slug || "");
      const tableToken = String(req.query?.tableToken || "");
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
      const tbl = findTableByQr(est.id, tableToken);
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida ou QR expirado." });
      const command = getActiveCommand(tbl);
      const summary = guestTableSummary(est.id, command?.id);
      const guestAuth = validateClientSession(readGuestToken(req));
      return json(res, 200, {
        establishment: {
          id: est.id,
          slug: est.slug,
          name: est.name,
          open: est.open,
          rodizioEnabled: est.rodizioEnabled,
          operationMode: est.operationMode || "a_la_carte"
        },
        table: { id: tbl.id, number: tbl.number, name: tbl.name, status: tbl.status },
        command,
        otpRequired: otpRequiredForEstablishment(est),
        otpBypass: publicOtpBypassHint(),
        hasSession: Boolean(guestAuth),
        operationMode: est.operationMode || "a_la_carte",
        ...summary
      });
    }
    if (req.method === "GET" && path === "/guest/me") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente inv\xE1lida." });
      const orders = Object.values(store.orders).filter((o) => o.guestParticipationId === guestAuth.participation.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const consumptionTotal = orders.filter((o) => o.status !== "CANCELADO").reduce((sum, order) => sum + order.total, 0);
      return json(res, 200, {
        participation: publicParticipation(guestAuth.participation),
        orders,
        consumptionTotal
      });
    }
    if (req.method === "POST" && path === "/guest/join/mock") {
      const body = req.body || {};
      const est = findEstablishmentBySlug(String(body.slug || ""));
      if (!est) return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
      if (otpRequiredForEstablishment(est)) {
        return json(res, 403, { error: "OTP obrigat\xF3rio para este estabelecimento." });
      }
      const tbl = findTableByQr(est.id, String(body.tableToken || ""));
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida." });
      const phoneE164 = normalizePhoneE164(body.phone || "+5511999999999");
      if (!phoneE164) return json(res, 400, { error: "Telefone inv\xE1lido." });
      const result = joinGuestAtTable({
        establishment: est,
        table: tbl,
        phoneE164,
        displayName: body.displayName,
        comandaNumber: body.comandaNumber
      });
      if ("error" in result) return json(res, result.status, { error: result.error });
      setClientCookie(res, result.token);
      return json(res, 200, {
        token: result.token,
        participation: publicParticipation(result.participation),
        message: result.message
      });
    }
    if (req.method === "POST" && path === "/guest/otp/request") {
      const body = req.body || {};
      const est = findEstablishmentBySlug(String(body.slug || ""));
      if (!est) return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
      const tbl = findTableByQr(est.id, String(body.tableToken || ""));
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida." });
      const result = requestOtpChallenge({
        establishment: est,
        table: tbl,
        phoneRaw: String(body.phone || ""),
        purpose: "JOIN"
      });
      if ("error" in result) return json(res, 400, { error: result.error });
      return json(res, 200, {
        challengeId: result.challengeId,
        mockCode: result.mockCode,
        message: "C\xF3digo enviado (mock em desenvolvimento)."
      });
    }
    if (req.method === "POST" && path === "/guest/otp/verify") {
      const body = req.body || {};
      const result = verifyOtpChallenge({
        challengeId: String(body.challengeId || ""),
        code: String(body.code || ""),
        displayName: body.displayName,
        slug: body.slug,
        tableToken: body.tableToken,
        phoneRaw: body.phone,
        comandaNumber: body.comandaNumber
      });
      if ("error" in result) return json(res, 400, { error: result.error });
      setClientCookie(res, result.token);
      return json(res, 200, {
        token: result.token,
        participation: publicParticipation(result.participation)
      });
    }
    if (req.method === "POST" && path === "/guest/logout") {
      revokeClientSession(readGuestToken(req));
      clearClientCookie(res);
      return json(res, 200, { ok: true });
    }
    if (req.method === "GET" && path.startsWith("/menu/")) {
      const parts = path.split("/").filter(Boolean);
      const slug = parts[1];
      const table = parts[2];
      if (!slug || !table) return json(res, 400, { error: "Path inv\xE1lido." });
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
      if (!est.open) return json(res, 403, { error: "Estabelecimento fechado no momento." });
      const tbl = findTableByQr(est.id, table);
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida ou QR expirado." });
      const command = getActiveCommand(tbl);
      const categories = Object.values(store.categories).filter((c) => c.establishmentId === est.id && c.active).sort((a, b) => a.sortOrder - b.sortOrder);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id && p.active);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id);
      const summary = guestTableSummary(est.id, command?.id);
      const rodizio = est.rodizioEnabled ? Object.values(store.rodizios).find((r) => r.establishmentId === est.id && r.active) : null;
      return json(res, 200, {
        establishment: est,
        table: tbl,
        command,
        categories,
        products,
        sectors,
        rodizio,
        ...summary
      });
    }
    if (req.method === "GET" && path === "/orders") {
      const auth = dashboardAuth(req);
      if (!auth || !["OWNER", "MANAGER", "WAITER", "COUNTER"].includes(auth.user.role)) {
        return json(res, 401, { error: "N\xE3o autorizado." });
      }
      const commandId = String(req.query?.commandId || "");
      let orders = Object.values(store.orders).filter((o) => o.establishmentId === auth.establishment.id);
      if (commandId) orders = orders.filter((o) => o.commandId === commandId);
      orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json(res, 200, { orders });
    }
    if (req.method === "POST" && path === "/orders") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente obrigat\xF3ria." });
      if (guestAuth.participation.status !== "OPEN") {
        return json(res, 403, { error: "Sua participa\xE7\xE3o n\xE3o permite novos pedidos." });
      }
      const body = req.body || {};
      if (!body.items?.length) return json(res, 400, { error: "Carrinho vazio." });
      const est = guestAuth.establishment;
      if (!est.open) return json(res, 400, { error: "Estabelecimento indispon\xEDvel." });
      const tbl = store.tables[guestAuth.participation.tableId];
      if (!tbl) return json(res, 404, { error: "Mesa inv\xE1lida." });
      const sectors = Object.fromEntries(
        Object.values(store.sectors).filter((sector) => sector.establishmentId === est.id).map((sector) => [sector.id, { name: sector.name }])
      );
      const resolved = resolveOrderLines(store, est.id, sectors, body.items);
      if (!resolved.ok) return json(res, resolved.status, { error: resolved.error });
      const command = getOrOpenCommand(tbl);
      const participation = store.guestParticipations[guestAuth.participation.id] || guestAuth.participation;
      if (participation.commandId !== command.id) {
        participation.commandId = command.id;
        store.guestParticipations[participation.id] = participation;
        saveStore(store);
      }
      try {
        const order = createOrder({
          establishmentId: est.id,
          table: tbl,
          commandId: command.id,
          guestParticipationId: guestAuth.participation.id,
          items: resolved.items,
          notes: body.notes,
          source: "MESA"
        });
        return json(res, 200, { order, total: order.total });
      } catch (error) {
        const message = error instanceof Error ? error.message : "N\xE3o foi poss\xEDvel criar o pedido.";
        return json(res, 403, { error: message });
      }
    }
    const orderMatch = path.match(/^\/orders\/([^/]+)$/);
    if (orderMatch) {
      const orderId = orderMatch[1];
      if (req.method === "GET") {
        const auth = adminAuth(req);
        if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
        const order = store.orders[orderId];
        if (!order || order.establishmentId !== auth.establishment.id) {
          return json(res, 404, { error: "N\xE3o encontrado" });
        }
        return json(res, 200, { order });
      }
      if (req.method === "PATCH") {
        const auth = validateSession(readBearer(req));
        if (!auth || !["OWNER", "MANAGER", "KITCHEN", "COUNTER", "WAITER"].includes(auth.user.role)) {
          return json(res, 401, { error: "N\xE3o autorizado." });
        }
        const body = req.body || {};
        const order = updateOrderStatus(orderId, body.status, auth.establishment.id);
        if (!order) return json(res, 404, { error: "Pedido n\xE3o encontrado." });
        return json(res, 200, { order });
      }
    }
    if (req.method === "POST" && path === "/auth/login") {
      const body = req.body || {};
      const result = loginUser(String(body.email), String(body.password));
      if (result.error) return json(res, 401, { error: result.error });
      return json(res, 200, {
        token: result.session.token,
        user: publicUser(result.user),
        establishment: result.establishment
      });
    }
    if (req.method === "POST" && path === "/auth/register") {
      const body = req.body || {};
      const operationMode = isOperationMode(body.operationMode) ? body.operationMode : void 0;
      const result = registerEstablishment({
        businessName: String(body.businessName || ""),
        ownerName: String(body.ownerName || ""),
        email: String(body.email || ""),
        password: String(body.password || ""),
        businessType: body.businessType || "restaurante",
        operationMode,
        tableCount: Number(body.tableCount) || 5
      });
      if (result.error) return json(res, 400, { error: result.error });
      return json(res, 201, {
        token: result.session.token,
        user: publicUser(result.user),
        establishment: result.establishment
      });
    }
    if (req.method === "GET" && path === "/auth/me") {
      const auth = validateSession(req.headers.authorization?.replace(/^Bearer\s+/i, ""));
      if (!auth) return json(res, 401, { error: "Sess\xE3o inv\xE1lida." });
      return json(res, 200, {
        user: publicUser(auth.user),
        establishment: auth.establishment
      });
    }
    if (req.method === "POST" && path === "/bill") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente obrigat\xF3ria." });
      const result = requestGuestClosing(guestAuth.participation.id, "TABLE");
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, {
        ok: true,
        closingRequest: result.value.closingRequest,
        scope: "TABLE"
      });
    }
    if (req.method === "POST" && path === "/guest/closing/request") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente inv\xE1lida." });
      const body = req.body || {};
      const scope = body.scope || "TABLE";
      const result = requestGuestClosing(
        guestAuth.participation.id,
        scope,
        body.targetGuestParticipationIds || []
      );
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, {
        closingRequest: result.value.closingRequest,
        participation: publicParticipation(result.value.participation)
      });
    }
    if (req.method === "POST" && path === "/guest/closing/cancel") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente inv\xE1lida." });
      const result = cancelGuestClosing(guestAuth.participation.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, {
        cancelled: result.value.cancelled,
        participation: publicParticipation(result.value.participation)
      });
    }
    if (req.method === "GET" && path === "/guest/closing/status") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente inv\xE1lida." });
      const status = getGuestClosingStatus(guestAuth.participation.id);
      if (!status) return json(res, 404, { error: "Participa\xE7\xE3o n\xE3o encontrada." });
      return json(res, 200, status);
    }
    if (req.method === "GET" && path === "/kds/queue") {
      const auth = kitchenAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const sectorId = String(req.query?.sector || req.query?.sectorId || "");
      if (!sectorId) return json(res, 400, { error: "Setor obrigat\xF3rio." });
      const queue = getKdsQueue(auth.establishment.id, sectorId);
      if (!queue) return json(res, 404, { error: "Setor n\xE3o encontrado." });
      return json(res, 200, queue);
    }
    if (req.method === "GET" && path === "/admin/dashboard") {
      const auth = dashboardAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const est = auth.establishment;
      const stats = dashboardStats(est.id);
      const orders = Object.values(store.orders).filter((o) => o.establishmentId === est.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id && s.active);
      const notifications = Object.values(store.notifications).filter((n) => n.establishmentId === est.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);
      const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
      const categories = Object.values(store.categories).filter((c) => c.establishmentId === est.id);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id);
      return json(res, 200, {
        establishment: est,
        persist: persistStatus(),
        stats,
        orders,
        tables,
        sectors,
        commands,
        notifications,
        categories,
        products
      });
    }
    if (path === "/admin/settings") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "GET") {
        const establishment = getAdminSettings(auth.establishment.id);
        if (!establishment) {
          return json(res, 404, { error: "Estabelecimento n\xE3o encontrado." });
        }
        return json(res, 200, { establishment });
      }
      if (req.method === "PATCH") {
        const result = updateAdminSettings(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { establishment: result.value });
      }
    }
    if (path === "/admin/products") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "GET") {
        return json(res, 200, listAdminProducts(auth.establishment.id));
      }
      if (req.method === "POST") {
        const result = createAdminProduct(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { product: result.value });
      }
    }
    if (path === "/admin/categories") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "GET") {
        return json(res, 200, { categories: listAdminCategories(auth.establishment.id) });
      }
      if (req.method === "POST") {
        const result = createAdminCategory(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { category: result.value });
      }
    }
    const adminCategoryMatch = path.match(/^\/admin\/categories\/([^/]+)$/);
    if (adminCategoryMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminCategory(auth.establishment.id, adminCategoryMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { category: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminCategory(auth.establishment.id, adminCategoryMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { category: result.value });
      }
    }
    if (req.method === "POST" && path === "/admin/media/upload") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const parsed = parseBase64UploadBody(req.body);
      if ("error" in parsed) return json(res, 400, { error: parsed.error });
      const result = await uploadProductImage(auth.establishment.id, parsed);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 201, result);
    }
    if (req.method === "GET" && path === "/admin/operations") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER", "WAITER"]);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      return json(res, 200, listAdminOperations(auth.establishment.id));
    }
    const tableActivateMatch = path.match(/^\/admin\/tables\/([^/]+)\/activate$/);
    if (tableActivateMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER", "WAITER"]);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = activateTable(auth.establishment.id, tableActivateMatch[1], auth.user.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const guestKickMatch = path.match(/^\/admin\/guests\/([^/]+)\/kick$/);
    if (guestKickMatch && req.method === "POST") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = kickGuestParticipation(auth.establishment.id, guestKickMatch[1], auth.user.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const forceClearMatch = path.match(/^\/admin\/tables\/([^/]+)\/force-clear$/);
    if (forceClearMatch && req.method === "POST") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = forceClearTable(auth.establishment.id, forceClearMatch[1], auth.user.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const adminProductMatch = path.match(/^\/admin\/products\/([^/]+)$/);
    if (adminProductMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminProduct(auth.establishment.id, adminProductMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { product: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminProduct(auth.establishment.id, adminProductMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { product: result.value });
      }
    }
    if (path === "/admin/tables") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "GET") {
        return json(res, 200, { tables: listAdminTables(auth.establishment.id) });
      }
      if (req.method === "POST") {
        const result = createAdminTable(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { table: result.value });
      }
    }
    const cockpitMatch = path.match(/^\/admin\/tables\/([^/]+)\/cockpit$/);
    if (cockpitMatch) {
      const auth = staffAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "GET") {
        const cockpit = getTableCockpit(auth.establishment.id, cockpitMatch[1]);
        if (!cockpit) return json(res, 404, { error: "Mesa n\xE3o encontrada." });
        return json(res, 200, cockpit);
      }
    }
    const commandPaymentsMatch = path.match(/^\/admin\/commands\/([^/]+)\/payments$/);
    if (commandPaymentsMatch && req.method === "POST") {
      const auth = staffAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = registerPayment(
        auth.establishment.id,
        commandPaymentsMatch[1],
        req.body,
        auth.user
      );
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 201, result.value);
    }
    const commandSettleMatch = path.match(/^\/admin\/commands\/([^/]+)\/settle$/);
    if (commandSettleMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = settleCommand(auth.establishment.id, commandSettleMatch[1], auth.user);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const commandSplitsMatch = path.match(/^\/admin\/commands\/([^/]+)\/splits$/);
    if (commandSplitsMatch && req.method === "PUT") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = replaceOrderItemSplits(
        auth.establishment.id,
        commandSplitsMatch[1],
        req.body,
        auth.user.id
      );
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const closingConfirmMatch = path.match(/^\/admin\/closing\/([^/]+)\/confirm$/);
    if (closingConfirmMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = confirmClosingRequest(auth.establishment.id, closingConfirmMatch[1], auth.user);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const paymentVoidMatch = path.match(/^\/admin\/payments\/([^/]+)\/void$/);
    if (paymentVoidMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = voidPayment(auth.establishment.id, paymentVoidMatch[1], auth.user);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const notificationReadMatch = path.match(/^\/admin\/notifications\/([^/]+)\/read$/);
    if (notificationReadMatch && req.method === "POST") {
      const auth = staffAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = markNotificationRead(auth.establishment.id, notificationReadMatch[1]);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    if (req.method === "GET" && path === "/admin/integrations") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      ensureIntegrationCatalog(auth.establishment.id);
      return json(res, 200, listIntegrations(auth.establishment.id));
    }
    const integrationConnectMatch = path.match(/^\/admin\/integrations\/([^/]+)\/connect$/);
    if (integrationConnectMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const provider = integrationConnectMatch[1];
      if (req.method === "POST") {
        const body = req.body || {};
        const result = connectIntegration(
          auth.establishment.id,
          provider,
          body.config || {},
          auth.user.id
        );
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, result.value);
      }
      if (req.method === "DELETE") {
        const result = disconnectIntegration(auth.establishment.id, provider, auth.user.id);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, result.value);
      }
    }
    if (req.method === "POST" && path === "/admin/integrations/webhook/test") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      const result = await testWebhookStub(auth.establishment.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }
    const regenerateQrMatch = path.match(/^\/admin\/tables\/([^/]+)\/regenerate-qr$/);
    if (regenerateQrMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "POST") {
        const result = regenerateAdminTableQr(auth.establishment.id, regenerateQrMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
    }
    const adminTableMatch = path.match(/^\/admin\/tables\/([^/]+)$/);
    if (adminTableMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "N\xE3o autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminTable(auth.establishment.id, adminTableMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminTable(auth.establishment.id, adminTableMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { deleted: result.value.id });
      }
    }
    if (req.method === "POST" && path === "/rodizio/round") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sess\xE3o de cliente obrigat\xF3ria." });
      if (guestAuth.participation.status !== "OPEN") {
        return json(res, 403, { error: "Sua participa\xE7\xE3o n\xE3o permite novos pedidos." });
      }
      const body = req.body || {};
      const est = guestAuth.establishment;
      if (!est.rodizioEnabled) return json(res, 400, { error: "Rod\xEDzio indispon\xEDvel." });
      const table = store.tables[guestAuth.participation.tableId];
      if (!table) return json(res, 404, { error: "Mesa inv\xE1lida." });
      const rodizio = store.rodizios[body.rodizioId];
      if (!rodizio || rodizio.establishmentId !== est.id) {
        return json(res, 404, { error: "Rod\xEDzio n\xE3o encontrado." });
      }
      const sectors = Object.fromEntries(
        Object.values(store.sectors).filter((sector) => sector.establishmentId === est.id).map((sector) => [sector.id, { name: sector.name }])
      );
      const resolved = resolveOrderLines(store, est.id, sectors, body.items, {
        unitPriceFor: (product) => {
          if (rodizio.premiumProductIds.includes(product.id)) {
            return product.rodizioPremiumPrice ?? product.price;
          }
          if (rodizio.productIds.includes(product.id)) return 0;
          return product.price;
        }
      });
      if (!resolved.ok) return json(res, resolved.status, { error: resolved.error });
      if (resolved.items.length > rodizio.maxItemsPerRound) {
        return json(res, 400, { error: `M\xE1ximo ${rodizio.maxItemsPerRound} itens por rodada.` });
      }
      const command = getOrOpenCommand(table);
      const round = createRodizioRound({
        establishmentId: est.id,
        table,
        commandId: command.id,
        guestParticipationId: guestAuth.participation.id,
        rodizioId: body.rodizioId,
        items: resolved.items
      });
      return json(res, 200, { round, message: "Rodada enviada para a cozinha." });
    }
    return json(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("[mesaflow] handler error", err);
    return json(res, 500, { error: "Internal error" });
  }
}
//# sourceMappingURL=mesaflow.js.map
