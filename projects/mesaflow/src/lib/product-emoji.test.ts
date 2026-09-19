import assert from "node:assert/strict";
import { pickCategoryEmoji, pickProductEmoji, resolveProductEmoji } from "./product-emoji";

function run() {
  assert.equal(pickCategoryEmoji("X-Burguer"), "🍔");
  assert.equal(pickCategoryEmoji("Refrigerantes"), "🥤");
  assert.equal(pickProductEmoji("X-Burger Bacon"), "🍔");
  assert.equal(pickProductEmoji("Caipirinha de limão"), "🍹");
  assert.equal(pickProductEmoji("Item genérico", "🍟"), "🍟");
  assert.equal(
    resolveProductEmoji({ productName: "Suco de Laranja", categoryName: "Bebidas" }),
    "🧃",
  );
  assert.equal(pickProductEmoji("Mistério"), "🍽️");

  console.log("product-emoji.test.ts OK");
}

run();
