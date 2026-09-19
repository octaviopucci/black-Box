/**
 * Emoji-first cardápio quando não há foto real — padrão Marcelo Lanches, reutilizável.
 */

const DEFAULT_EMOJI = "🍽️";

type EmojiRule = { emoji: string; keywords: string[] };

const PRODUCT_EMOJI_RULES: EmojiRule[] = [
  { emoji: "🍔", keywords: ["x-burguer", "xburguer", "x burger", "hamburguer", "hamburger", "burger"] },
  { emoji: "🥗", keywords: ["x-salada", "xsalada", "x salada", "salada"] },
  { emoji: "🌭", keywords: ["hot dog", "hotdog", "cachorro-quente", "cachorro quente"] },
  { emoji: "🍕", keywords: ["pizza", "calabresa", "pepperoni", "marguerita", "margherita", "mussarela"] },
  { emoji: "🍟", keywords: ["batata", "fritas", "porcao", "porção", "nuggets", "aneis de cebola"] },
  { emoji: "🥐", keywords: ["pao", "pão", "padaria", "croissant", "cafe da manha"] },
  { emoji: "🌮", keywords: ["taco", "burrito", "mexican"] },
  { emoji: "🌯", keywords: ["wrap", "kebab", "shawarma"] },
  { emoji: "🍗", keywords: ["frango", "galinha", "nugget", "coxa", "asa"] },
  { emoji: "🥩", keywords: ["carne", "picanha", "bife", "file", "filé", "costela", "churrasco"] },
  { emoji: "🥪", keywords: ["sanduiche", "sanduíche", "lanche", "misto", "bauru"] },
  { emoji: "🌭", keywords: ["salsicha", "linguica", "linguiça"] },
  { emoji: "🍱", keywords: ["combo", "executivo", "marmita", "prato"] },
  { emoji: "🍜", keywords: ["macarrao", "macarrão", "lamen", "yakisoba", "sopa"] },
  { emoji: "🍣", keywords: ["sushi", "sashimi", "temaki"] },
  { emoji: "🧃", keywords: ["suco", "vitamina", "smoothie"] },
  { emoji: "🥤", keywords: ["refrigerante", "refri", "coca", "pepsi", "guarana", "guaraná", "sprite", "fanta"] },
  { emoji: "🧋", keywords: ["bubble tea", "milkshake", "shake"] },
  { emoji: "☕", keywords: ["cafe", "café", "cappuccino", "capuccino", "espresso", "expresso", "latte", "mocha"] },
  { emoji: "🍺", keywords: ["chopp", "cerveja", "chop", "heineken", "brahma", "skol"] },
  { emoji: "🍷", keywords: ["vinho", "tinto", "branco", "rose", "rosé"] },
  { emoji: "🍹", keywords: ["caipirinha", "caipiroska", "drink", "coquetel", "mojito"] },
  { emoji: "💧", keywords: ["agua", "água", "mineral"] },
  { emoji: "🍦", keywords: ["sorvete", "acai", "açaí", "gelato", "milk shake"] },
  { emoji: "🍰", keywords: ["bolo", "torta", "brownie", "sobremesa", "doce", "pudim", "flan"] },
  { emoji: "🥟", keywords: ["coxinha", "pastel", "empada", "salgado", "esfiha", "kibe"] },
  { emoji: "🧀", keywords: ["queijo", "catupiry", "cheddar", "mussarela"] },
  { emoji: "🥚", keywords: ["ovo", "omelete", "omelet"] },
  { emoji: "🌽", keywords: ["milho", "pipoca"] },
  { emoji: "🥓", keywords: ["bacon", "presunto", "mortadela"] },
];

const CATEGORY_EMOJI_RULES: EmojiRule[] = [
  { emoji: "🍔", keywords: ["burguer", "hamburguer", "lanche"] },
  { emoji: "🥗", keywords: ["salada"] },
  { emoji: "🌭", keywords: ["hot dog", "hotdog"] },
  { emoji: "🍕", keywords: ["pizza"] },
  { emoji: "🍟", keywords: ["porcao", "porção", "acompanhamento"] },
  { emoji: "🍱", keywords: ["combo", "prato", "executivo"] },
  { emoji: "🧃", keywords: ["suco"] },
  { emoji: "🥤", keywords: ["bebida", "refrigerante", "refri"] },
  { emoji: "🍦", keywords: ["sorvete", "sobremesa", "doce"] },
  { emoji: "☕", keywords: ["cafe", "café"] },
  { emoji: "🍺", keywords: ["bar", "cerveja", "chopp"] },
];

function normalizeLabel(value: string) {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchEmoji(label: string, rules: EmojiRule[]) {
  if (!label) return undefined;
  for (const rule of rules) {
    if (rule.keywords.some((keyword) => label.includes(normalizeLabel(keyword)))) {
      return rule.emoji;
    }
  }
  return undefined;
}

/** Emoji da categoria pelo nome (ex.: "X-Burguer" → 🍔). */
export function pickCategoryEmoji(categoryName?: string | null) {
  if (!categoryName?.trim()) return undefined;
  return matchEmoji(normalizeLabel(categoryName), CATEGORY_EMOJI_RULES);
}

/** Emoji do produto pelo nome; cai no emoji da categoria ou 🍽️. */
export function pickProductEmoji(
  productName?: string | null,
  categoryEmoji?: string | null,
  categoryName?: string | null,
) {
  if (categoryEmoji?.trim()) return categoryEmoji.trim();
  const fromProduct = matchEmoji(normalizeLabel(productName || ""), PRODUCT_EMOJI_RULES);
  if (fromProduct) return fromProduct;
  const fromCategory = pickCategoryEmoji(categoryName);
  if (fromCategory) return fromCategory;
  return DEFAULT_EMOJI;
}

/** Resolve emoji para exibição quando não há foto. */
export function resolveProductEmoji(input: {
  productName: string;
  categoryEmoji?: string | null;
  categoryName?: string | null;
}) {
  return pickProductEmoji(input.productName, input.categoryEmoji, input.categoryName);
}
