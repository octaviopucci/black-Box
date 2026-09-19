import { id } from "./crypto-utils";
import { FOOD_PRESETS, productImageByName } from "./product-images";
import type { Category, Establishment, MesaFlowStore, Product, ProductAddon, ProductVariant } from "./types";

export const MARCELO_ESTABLISHMENT_ID = "est_marcelo_lanches";
export const MARCELO_ESTABLISHMENT_SLUG = "marcelo-lanches";

const SANDWICH_ADDONS: ProductAddon[] = [
  { id: "ml_a_bacon", name: "Bacon", price: 5 },
  { id: "ml_a_calabresa", name: "Calabresa", price: 5 },
  { id: "ml_a_frango", name: "Frango", price: 5 },
  { id: "ml_a_hamburguer", name: "Hambúrguer", price: 7 },
  { id: "ml_a_mussarela", name: "Mussarela", price: 5 },
  { id: "ml_a_batata_palha", name: "Batata Palha", price: 4 },
  { id: "ml_a_cheddar", name: "Cheddar", price: 5 },
  { id: "ml_a_catupiry", name: "Catupiry", price: 5 },
  { id: "ml_a_ovo", name: "Ovo", price: 3 },
  { id: "ml_a_salsicha", name: "Salsicha", price: 3 },
  { id: "ml_a_milho", name: "Milho", price: 2 },
  { id: "ml_a_tomate", name: "Tomate", price: 2 },
];

function fritasVariants(base: number, withFritas: number): ProductVariant[] {
  return [
    { id: "ml_v_sem_fritas", name: "Sem fritas", priceDelta: 0 },
    { id: "ml_v_com_fritas", name: "Com fritas", priceDelta: withFritas - base },
  ];
}

function sizeVariants(sizes: { id: string; name: string; price: number }[]): ProductVariant[] {
  const base = sizes[0].price;
  return sizes.map((s) => ({ id: s.id, name: s.name, priceDelta: s.price - base }));
}

function flavorVariants(flavors: string[], prefix: string): ProductVariant[] {
  return flavors.map((name, i) => ({
    id: `${prefix}_s${i + 1}`,
    name,
    priceDelta: 0,
  }));
}

type CatalogSlice = {
  categories: Record<string, Category>;
  products: Record<string, Product>;
};

function sandwichProduct(
  establishmentId: string,
  categoryId: string,
  sectorId: string,
  productId: string,
  name: string,
  description: string,
  base: number,
  withFritas: number,
  extra?: Partial<Product>,
): Product {
  return {
    id: productId,
    establishmentId,
    categoryId,
    sectorId,
    name,
    description,
    price: base,
    image: productImageByName(name, name.includes("Dog") ? "burger" : "xsalada"),
    tags: [],
    prepMinutes: 15,
    availability: "AMBOS",
    featured: false,
    active: true,
    variants: fritasVariants(base, withFritas),
    addons: SANDWICH_ADDONS,
    rodizioIncluded: false,
    ...extra,
  };
}

function drinkProduct(
  establishmentId: string,
  categoryId: string,
  sectorId: string,
  productId: string,
  name: string,
  description: string,
  sizes: { id: string; name: string; price: number }[],
  extra?: Partial<Product>,
): Product {
  return {
    id: productId,
    establishmentId,
    categoryId,
    sectorId,
    name,
    description,
    price: sizes[0].price,
    image: productImageByName(name, "bebida"),
    tags: [],
    prepMinutes: 1,
    availability: "VITRINE",
    featured: false,
    active: true,
    variants: sizeVariants(sizes),
    addons: [],
    rodizioIncluded: false,
    ...extra,
  };
}

export function findMarceloEstablishment(store: MesaFlowStore): Establishment | null {
  return (
    Object.values(store.establishments).find(
      (e) =>
        e.slug === MARCELO_ESTABLISHMENT_SLUG ||
        e.slug.includes("marcelo") ||
        e.name.toLowerCase().includes("marcelo"),
    ) ?? null
  );
}

export function buildMarceloLanchesCatalog(establishmentId: string, secCozinha: string, secBalcao: string): CatalogSlice {
  const categories: Record<string, Category> = {
    ml_cat_xburguer: {
      id: "ml_cat_xburguer",
      establishmentId,
      name: "X-Burguer",
      emoji: "🍔",
      sortOrder: 1,
      active: true,
    },
    ml_cat_xsalada: {
      id: "ml_cat_xsalada",
      establishmentId,
      name: "X-Salada",
      emoji: "🥗",
      sortOrder: 2,
      active: true,
    },
    ml_cat_hotdog: {
      id: "ml_cat_hotdog",
      establishmentId,
      name: "Hot Dog",
      emoji: "🌭",
      sortOrder: 3,
      active: true,
    },
    ml_cat_porcoes: {
      id: "ml_cat_porcoes",
      establishmentId,
      name: "Porções",
      emoji: "🍟",
      sortOrder: 4,
      active: true,
    },
    ml_cat_combos: {
      id: "ml_cat_combos",
      establishmentId,
      name: "Combos",
      emoji: "🍱",
      sortOrder: 5,
      active: true,
    },
    ml_cat_sucos: {
      id: "ml_cat_sucos",
      establishmentId,
      name: "Sucos",
      emoji: "🧃",
      sortOrder: 6,
      active: true,
    },
    ml_cat_bebidas: {
      id: "ml_cat_bebidas",
      establishmentId,
      name: "Refrigerantes e bebidas",
      emoji: "🥤",
      sortOrder: 7,
      active: true,
    },
    ml_cat_rossi: {
      id: "ml_cat_rossi",
      establishmentId,
      name: "Refrigerantes Rossi",
      emoji: "🥤",
      sortOrder: 8,
      active: true,
    },
    ml_cat_sorvetes: {
      id: "ml_cat_sorvetes",
      establishmentId,
      name: "Sorvetes",
      emoji: "🍦",
      sortOrder: 9,
      active: true,
    },
  };

  const products: Record<string, Product> = {
    // X-Burguer
    ml_p_burguer: sandwichProduct(
      establishmentId,
      "ml_cat_xburguer",
      secCozinha,
      "ml_p_burguer",
      "Burguer",
      "Hambúrguer, mussarela e molho da casa.",
      13,
      16,
    ),
    ml_p_burguer_bacon: sandwichProduct(
      establishmentId,
      "ml_cat_xburguer",
      secCozinha,
      "ml_p_burguer_bacon",
      "Burguer Bacon",
      "Hambúrguer, mussarela, bacon e molho da casa.",
      18,
      21,
    ),
    ml_p_burguer_calabresa: sandwichProduct(
      establishmentId,
      "ml_cat_xburguer",
      secCozinha,
      "ml_p_burguer_calabresa",
      "Burguer Calabresa",
      "Hambúrguer, mussarela, calabresa e molho da casa.",
      18,
      21,
    ),
    ml_p_burguer_frango: sandwichProduct(
      establishmentId,
      "ml_cat_xburguer",
      secCozinha,
      "ml_p_burguer_frango",
      "Burguer Frango",
      "Hambúrguer, mussarela, frango e molho da casa.",
      18,
      21,
    ),
    ml_p_burguer_tudo: sandwichProduct(
      establishmentId,
      "ml_cat_xburguer",
      secCozinha,
      "ml_p_burguer_tudo",
      "Burguer Tudo",
      "Hambúrguer, mussarela, molho da casa, bacon, calabresa, frango, catupiry, cheddar e batata palha.",
      30,
      33,
      { featured: true },
    ),

    // X-Salada
    ml_p_xsalada: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xsalada",
      "X-Salada",
      "Alface, tomate, hambúrguer, mussarela e molho da casa.",
      16,
      19,
    ),
    ml_p_xegg: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xegg",
      "X-Egg",
      "Alface, tomate, hambúrguer, mussarela, ovo e molho da casa.",
      18,
      21,
    ),
    ml_p_xbacon: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xbacon",
      "X-Bacon",
      "Alface, tomate, hambúrguer, mussarela, bacon e molho da casa.",
      20,
      23,
    ),
    ml_p_xcalabresa: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xcalabresa",
      "X-Calabresa",
      "Alface, tomate, hambúrguer, mussarela, calabresa e molho da casa.",
      20,
      23,
    ),
    ml_p_xfrango: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xfrango",
      "X-Frango",
      "Alface, tomate, hambúrguer, mussarela, frango e molho da casa.",
      20,
      23,
    ),
    ml_p_xtudo: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xtudo",
      "X-Tudo",
      "Alface, tomate, hambúrguer, mussarela, bacon, calabresa, frango, ovo, catupiry, cheddar, batata palha e molho da casa.",
      32,
      35,
      { featured: true },
    ),
    ml_p_xguilla: sandwichProduct(
      establishmentId,
      "ml_cat_xsalada",
      secCozinha,
      "ml_p_xguilla",
      "X-Guilla",
      "Alface, tomate, 4 hambúrgueres, mussarela, calabresa, bacon, ovo, catupiry, cheddar, batata palha e molho da casa.",
      45,
      48,
    ),

    // Hot Dog
    ml_p_hotdog_simples: sandwichProduct(
      establishmentId,
      "ml_cat_hotdog",
      secCozinha,
      "ml_p_hotdog_simples",
      "Hot Dog Simples",
      "Salsicha, vinagrete, milho, batata palha e molho da casa.",
      12,
      15,
    ),
    ml_p_hotdog_bacon: sandwichProduct(
      establishmentId,
      "ml_cat_hotdog",
      secCozinha,
      "ml_p_hotdog_bacon",
      "Hot Dog Bacon",
      "Salsicha, vinagrete, milho, bacon, batata palha e molho da casa.",
      15,
      18,
    ),
    ml_p_hotdog_frango: sandwichProduct(
      establishmentId,
      "ml_cat_hotdog",
      secCozinha,
      "ml_p_hotdog_frango",
      "Hot Dog Frango",
      "Salsicha, vinagrete, milho, frango, batata palha e molho da casa.",
      15,
      18,
    ),
    ml_p_hotdog_calabresa: sandwichProduct(
      establishmentId,
      "ml_cat_hotdog",
      secCozinha,
      "ml_p_hotdog_calabresa",
      "Hot Dog Calabresa",
      "Salsicha, vinagrete, milho, calabresa, batata palha e molho da casa.",
      15,
      18,
    ),
    ml_p_hotdog_casa: sandwichProduct(
      establishmentId,
      "ml_cat_hotdog",
      secCozinha,
      "ml_p_hotdog_casa",
      "Hot Dog da Casa",
      "2 salsichas, vinagrete, milho, bacon, calabresa, frango, mussarela, catupiry, cheddar, batata palha e molho da casa.",
      25,
      28,
      { featured: true },
    ),
    ml_p_dog_guilla: sandwichProduct(
      establishmentId,
      "ml_cat_hotdog",
      secCozinha,
      "ml_p_dog_guilla",
      "Dog Guilla",
      "2 pães de hot-dog, 4 salsichas, vinagrete, milho, mussarela, bacon, calabresa, frango, catupiry, cheddar, batata palha e molho da casa.",
      40,
      43,
    ),

    // Porções
    ml_p_fritas_simples: {
      id: "ml_p_fritas_simples",
      establishmentId,
      categoryId: "ml_cat_porcoes",
      sectorId: secCozinha,
      name: "Fritas simples",
      description: "Batata frita crocante.",
      price: 15,
      image: productImageByName("batata", "porcao"),
      tags: [],
      prepMinutes: 12,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: sizeVariants([
        { id: "ml_v_m", name: "Média", price: 15 },
        { id: "ml_v_g", name: "Grande", price: 22 },
      ]),
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_fritas_bacon_cheddar: {
      id: "ml_p_fritas_bacon_cheddar",
      establishmentId,
      categoryId: "ml_cat_porcoes",
      sectorId: secCozinha,
      name: "Fritas com bacon e cheddar",
      description: "Batata frita com bacon e cheddar.",
      price: 26,
      image: productImageByName("batata", "porcao"),
      tags: [],
      prepMinutes: 14,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: sizeVariants([
        { id: "ml_v_m", name: "Média", price: 26 },
        { id: "ml_v_g", name: "Grande", price: 32 },
      ]),
      addons: [],
      rodizioIncluded: false,
    },

    // Combos (Guaraná Rossi 2L grátis)
    ml_p_combo_4_salada: {
      id: "ml_p_combo_4_salada",
      establishmentId,
      categoryId: "ml_cat_combos",
      sectorId: secCozinha,
      name: "4x Salada + Guaraná Rossi 2L",
      description: "4 X-Salada + 1 Guaraná Rossi 2L grátis.",
      price: 60,
      image: FOOD_PRESETS.burger,
      tags: ["combo"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_combo_4_especial: {
      id: "ml_p_combo_4_especial",
      establishmentId,
      categoryId: "ml_cat_combos",
      sectorId: secCozinha,
      name: "4x Especial + Guaraná Rossi 2L",
      description: "4 lanches especiais (Bacon, Frango ou Calabresa) + 1 Guaraná Rossi 2L grátis.",
      price: 75,
      image: FOOD_PRESETS.burger,
      tags: ["combo"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: true,
      active: true,
      variants: flavorVariants(["Bacon", "Frango", "Calabresa"], "ml_combo_esp"),
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_combo_batata_fritas: {
      id: "ml_p_combo_batata_fritas",
      establishmentId,
      categoryId: "ml_cat_combos",
      sectorId: secCozinha,
      name: "3x Batata Palha + 3 Fritas + Guaraná 2L",
      description: "3 lanches com batata palha + 3 porções de fritas + 1 Guaraná Rossi 2L grátis.",
      price: 60,
      image: FOOD_PRESETS.porcao,
      tags: ["combo"],
      prepMinutes: 25,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_combo_4_hotdog_especial: {
      id: "ml_p_combo_4_hotdog_especial",
      establishmentId,
      categoryId: "ml_cat_combos",
      sectorId: secCozinha,
      name: "4 Hot Dog Especial + Guaraná 2L",
      description: "4 hot dogs especiais (Bacon, Frango ou Calabresa) + 1 Guaraná Rossi 2L grátis.",
      price: 58,
      image: productImageByName("Hot Dog", "burger"),
      tags: ["combo"],
      prepMinutes: 22,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: flavorVariants(["Bacon", "Frango", "Calabresa"], "ml_combo_hd_esp"),
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_combo_4_hotdog_simples: {
      id: "ml_p_combo_4_hotdog_simples",
      establishmentId,
      categoryId: "ml_cat_combos",
      sectorId: secCozinha,
      name: "4 Hot Dog Simples + Guaraná 2L",
      description: "4 hot dogs simples + 1 Guaraná Rossi 2L grátis.",
      price: 50,
      image: productImageByName("Hot Dog", "burger"),
      tags: ["combo"],
      prepMinutes: 20,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_combo_3_hotdog_fritas: {
      id: "ml_p_combo_3_hotdog_fritas",
      establishmentId,
      categoryId: "ml_cat_combos",
      sectorId: secCozinha,
      name: "3 Hot Dog Simples + 3 Fritas + Guaraná 2L",
      description: "3 hot dogs simples + 3 porções de fritas + 1 Guaraná Rossi 2L grátis.",
      price: 45,
      image: productImageByName("Hot Dog", "burger"),
      tags: ["combo"],
      prepMinutes: 22,
      availability: "AMBOS",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
    },

    // Sucos
    ml_p_nativo_acai: drinkProduct(
      establishmentId,
      "ml_cat_sucos",
      secBalcao,
      "ml_p_nativo_acai",
      "Nativo Açaí",
      "Suco Nativo Açaí 290ml.",
      [{ id: "ml_v_290", name: "290ml", price: 4 }],
    ),
    ml_p_nativo_uva: drinkProduct(
      establishmentId,
      "ml_cat_sucos",
      secBalcao,
      "ml_p_nativo_uva",
      "Nativo Uva",
      "Suco Nativo Uva 290ml.",
      [{ id: "ml_v_290", name: "290ml", price: 4 }],
    ),
    ml_p_nativo_laranja_acerola: drinkProduct(
      establishmentId,
      "ml_cat_sucos",
      secBalcao,
      "ml_p_nativo_laranja_acerola",
      "Nativo Laranja com Acerola",
      "Suco Nativo Laranja com Acerola 290ml.",
      [{ id: "ml_v_290", name: "290ml", price: 4 }],
    ),
    ml_p_tampico: drinkProduct(
      establishmentId,
      "ml_cat_sucos",
      secBalcao,
      "ml_p_tampico",
      "Tampico",
      "Suco Tampico 450ml.",
      [{ id: "ml_v_450", name: "450ml", price: 6 }],
    ),
    ml_p_del_valle_uva: drinkProduct(
      establishmentId,
      "ml_cat_sucos",
      secBalcao,
      "ml_p_del_valle_uva",
      "Del Valle Uva",
      "Suco Del Valle Uva.",
      [
        { id: "ml_v_1l", name: "1 Litro", price: 8 },
        { id: "ml_v_15l", name: "1,5 Litros", price: 10 },
      ],
    ),
    ml_p_del_valle_laranja: drinkProduct(
      establishmentId,
      "ml_cat_sucos",
      secBalcao,
      "ml_p_del_valle_laranja",
      "Del Valle Laranja",
      "Suco Del Valle Laranja.",
      [
        { id: "ml_v_1l", name: "1 Litro", price: 8 },
        { id: "ml_v_15l", name: "1,5 Litros", price: 10 },
      ],
    ),

    // Refrigerantes e bebidas
    ml_p_coca: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_coca",
      "Coca-Cola",
      "Coca-Cola gelada.",
      [
        { id: "ml_v_350", name: "350ml", price: 6 },
        { id: "ml_v_600", name: "600ml", price: 8 },
        { id: "ml_v_1l", name: "1 Litro", price: 11 },
        { id: "ml_v_2l", name: "2 Litros", price: 15 },
      ],
    ),
    ml_p_fanta_laranja: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_fanta_laranja",
      "Fanta Laranja",
      "Fanta Laranja gelada.",
      [
        { id: "ml_v_350", name: "350ml", price: 6 },
        { id: "ml_v_600", name: "600ml", price: 7 },
        { id: "ml_v_2l", name: "2 Litros", price: 14 },
      ],
    ),
    ml_p_fanta_uva: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_fanta_uva",
      "Fanta Uva",
      "Fanta Uva gelada.",
      [
        { id: "ml_v_350", name: "350ml", price: 6 },
        { id: "ml_v_2l", name: "2 Litros", price: 14 },
      ],
    ),
    ml_p_sprite: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_sprite",
      "Sprite",
      "Sprite gelada.",
      [
        { id: "ml_v_350", name: "350ml", price: 6 },
        { id: "ml_v_2l", name: "2 Litros", price: 14 },
      ],
    ),
    ml_p_tubaina: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_tubaina",
      "Tubaína",
      "Tubaína gelada.",
      [
        { id: "ml_v_350", name: "350ml", price: 4.5 },
        { id: "ml_v_600", name: "600ml", price: 6.5 },
        { id: "ml_v_2l", name: "2 Litros", price: 9 },
      ],
    ),
    ml_p_guarana_kuat: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_guarana_kuat",
      "Guaraná Kuat",
      "Guaraná Kuat gelado.",
      [{ id: "ml_v_2l", name: "2 Litros", price: 13 }],
    ),
    ml_p_cerveja_brahma: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_cerveja_brahma",
      "Cerveja Brahma",
      "Cerveja Brahma 350ml gelada.",
      [{ id: "ml_v_350", name: "350ml", price: 7 }],
    ),
    ml_p_cerveja_skol: drinkProduct(
      establishmentId,
      "ml_cat_bebidas",
      secBalcao,
      "ml_p_cerveja_skol",
      "Cerveja Skol",
      "Cerveja Skol 350ml gelada.",
      [{ id: "ml_v_350", name: "350ml", price: 7 }],
    ),

    // Refrigerantes Rossi
    ml_p_rossi_guarana: drinkProduct(
      establishmentId,
      "ml_cat_rossi",
      secBalcao,
      "ml_p_rossi_guarana",
      "Guaraná Rossi",
      "Garrafinha PET 350ml.",
      [{ id: "ml_v_350", name: "350ml", price: 4.5 }],
    ),
    ml_p_rossi_maca: drinkProduct(
      establishmentId,
      "ml_cat_rossi",
      secBalcao,
      "ml_p_rossi_maca",
      "Rossi Maçã",
      "Garrafinha PET 350ml.",
      [{ id: "ml_v_350", name: "350ml", price: 4.5 }],
    ),
    ml_p_rossi_abacaxi: drinkProduct(
      establishmentId,
      "ml_cat_rossi",
      secBalcao,
      "ml_p_rossi_abacaxi",
      "Rossi Abacaxi",
      "Garrafinha PET 350ml.",
      [{ id: "ml_v_350", name: "350ml", price: 4.5 }],
    ),
    ml_p_rossi_maca_2l: drinkProduct(
      establishmentId,
      "ml_cat_rossi",
      secBalcao,
      "ml_p_rossi_maca_2l",
      "Rossi Maçã Família",
      "Garrafa PET 2 Litros.",
      [{ id: "ml_v_2l", name: "2 Litros", price: 9 }],
    ),
    ml_p_rossi_abacaxi_2l: drinkProduct(
      establishmentId,
      "ml_cat_rossi",
      secBalcao,
      "ml_p_rossi_abacaxi_2l",
      "Rossi Abacaxi Família",
      "Garrafa PET 2 Litros.",
      [{ id: "ml_v_2l", name: "2 Litros", price: 9 }],
    ),
    ml_p_rossi_tubaina_vidro: {
      id: "ml_p_rossi_tubaina_vidro",
      establishmentId,
      categoryId: "ml_cat_rossi",
      sectorId: secBalcao,
      name: "Tubaína Rossi (vidro)",
      description: "Garrafa de vidro. Para consumo no local ou mediante troca de vasilhame.",
      price: 7,
      image: productImageByName("Tubaína", "bebida"),
      tags: [],
      prepMinutes: 1,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: [],
      addons: [],
      rodizioIncluded: false,
    },

    // Sorvetes
    ml_p_sundae: {
      id: "ml_p_sundae",
      establishmentId,
      categoryId: "ml_cat_sorvetes",
      sectorId: secBalcao,
      name: "Sundae",
      description: "Sundae cremoso — escolha o sabor.",
      price: 9.5,
      image: productImageByName("sorvete", "default"),
      tags: [],
      prepMinutes: 3,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: flavorVariants(["Chocolate", "Morango", "Ninho Trufado"], "ml_sundae"),
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_pote_400: {
      id: "ml_p_pote_400",
      establishmentId,
      categoryId: "ml_cat_sorvetes",
      sectorId: secBalcao,
      name: "Pote 400ml",
      description: "Pote de sorvete Fritz Frida 400ml — escolha o sabor.",
      price: 9,
      image: productImageByName("sorvete", "default"),
      tags: [],
      prepMinutes: 2,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: flavorVariants(
        ["Morango", "Chocolate", "Creme", "Leite condensado", "Flocos", "Coco branco", "Abacaxi"],
        "ml_pote400",
      ),
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_pote_200: {
      id: "ml_p_pote_200",
      establishmentId,
      categoryId: "ml_cat_sorvetes",
      sectorId: secBalcao,
      name: "Pote 200ml",
      description: "Pote de sorvete 200ml — escolha o sabor.",
      price: 6,
      image: productImageByName("sorvete", "default"),
      tags: [],
      prepMinutes: 2,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: flavorVariants(["Morango", "Coco branco", "Leite condensado"], "ml_pote200"),
      addons: [],
      rodizioIncluded: false,
    },
    ml_p_picole: {
      id: "ml_p_picole",
      establishmentId,
      categoryId: "ml_cat_sorvetes",
      sectorId: secBalcao,
      name: "Picolé",
      description: "Picolé — escolha o sabor. R$ 2,00 cada.",
      price: 2,
      image: productImageByName("picolé", "default"),
      tags: [],
      prepMinutes: 1,
      availability: "VITRINE",
      featured: false,
      active: true,
      variants: flavorVariants(
        [
          "Abacaxi suíço",
          "Chocolate",
          "Creme holandês",
          "Morango",
          "Leite condensado",
          "Amendoim",
          "Blue",
          "Chiclete",
          "Milho",
          "Uva",
          "Coco branco",
          "Chocolate branco",
        ],
        "ml_picole",
      ),
      addons: [],
      rodizioIncluded: false,
    },
  };

  return { categories, products };
}

function ensureMarceloSectors(store: MesaFlowStore, establishmentId: string) {
  const existing = Object.values(store.sectors).filter((s) => s.establishmentId === establishmentId);
  const cozinha =
    existing.find((s) => s.kind === "COZINHA") ??
    (() => {
      const secId = id("sec_");
      store.sectors[secId] = {
        id: secId,
        establishmentId,
        name: "Cozinha",
        kind: "COZINHA",
        color: "#f97316",
        active: true,
      };
      return store.sectors[secId];
    })();
  const balcao =
    existing.find((s) => s.kind === "BALCAO") ??
    (() => {
      const secId = id("sec_");
      store.sectors[secId] = {
        id: secId,
        establishmentId,
        name: "Balcão",
        kind: "BALCAO",
        color: "#3b82f6",
        active: true,
      };
      return store.sectors[secId];
    })();
  return { cozinha, balcao };
}

export type ApplyMarceloCatalogResult =
  | { ok: true; establishmentId: string; slug: string; categories: number; products: number; created: boolean }
  | { ok: false; error: string };

export function applyMarceloLanchesCatalog(
  store: MesaFlowStore,
  options?: { createIfMissing?: boolean },
): ApplyMarceloCatalogResult {
  let establishment = findMarceloEstablishment(store);
  let created = false;

  if (!establishment && options?.createIfMissing) {
    const now = new Date().toISOString();
    establishment = {
      id: MARCELO_ESTABLISHMENT_ID,
      slug: MARCELO_ESTABLISHMENT_SLUG,
      name: "Marcelo Lanches",
      tagline: "O melhor lanche da cidade e saboroso!",
      logo: "🍔",
      open: true,
      rodizioEnabled: false,
      businessType: "lanchonete",
      operationMode: "a_la_carte",
      settings: {
        currency: "BRL",
        allowEditAfterPrep: false,
        soundNotifications: true,
        minIntervalRodizioSec: 120,
        otpRequired: true,
      },
      plan: "essencial",
      planStartedAt: now,
      platformStatus: "active",
      createdAt: now,
    };
    store.establishments[establishment.id] = establishment;
    created = true;
  }

  if (!establishment) {
    return {
      ok: false,
      error: `Estabelecimento Marcelo Lanches não encontrado (slug esperado: ${MARCELO_ESTABLISHMENT_SLUG}).`,
    };
  }

  const { cozinha, balcao } = ensureMarceloSectors(store, establishment.id);

  for (const catId of Object.keys(store.categories)) {
    if (store.categories[catId].establishmentId === establishment.id) {
      delete store.categories[catId];
    }
  }
  for (const prodId of Object.keys(store.products)) {
    if (store.products[prodId].establishmentId === establishment.id) {
      delete store.products[prodId];
    }
  }

  const catalog = buildMarceloLanchesCatalog(establishment.id, cozinha.id, balcao.id);
  Object.assign(store.categories, catalog.categories);
  Object.assign(store.products, catalog.products);

  return {
    ok: true,
    establishmentId: establishment.id,
    slug: establishment.slug,
    categories: Object.keys(catalog.categories).length,
    products: Object.keys(catalog.products).length,
    created,
  };
}
