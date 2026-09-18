import assert from "node:assert/strict";
import { parseBase64UploadBody } from "./media-upload";

function run() {
  const sample = Buffer.from("hello").toString("base64");
  const parsed = parseBase64UploadBody({
    filename: "foto.jpg",
    contentType: "image/jpeg",
    dataBase64: `data:image/jpeg;base64,${sample}`,
  });
  assert.ok(!("error" in parsed));
  assert.equal(parsed.filename, "foto.jpg");
  assert.equal(parsed.contentType, "image/jpeg");
  assert.equal(parsed.bytes.toString(), "hello");

  const invalid = parseBase64UploadBody(null);
  assert.ok("error" in invalid);
  assert.equal(invalid.error, "Corpo inválido.");

  console.log("media-upload.test.ts OK");
}

run();
