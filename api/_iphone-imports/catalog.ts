import type {
  CatalogProduct,
  CategoryRecord,
  InventoryUnit,
  OrgDatabase,
  PublicCatalogProduct,
  PublicCatalogResponse,
  StoreSettings,
} from './types'

/** Unidades que contam como estoque disponível no site. */
export function isAvailableUnit(unit: InventoryUnit): boolean {
  return unit.status === 'available'
}

/** Quantidade em estoque de um produto (todas as lojas ou uma loja). */
export function getProductStock(
  inventory: InventoryUnit[],
  productId: string,
  storeId?: string,
): number {
  return inventory.filter(
    (u) =>
      u.productId === productId &&
      isAvailableUnit(u) &&
      (!storeId || u.storeId === storeId),
  ).length
}

/** Estoque por loja física. */
export function getStockByStore(
  inventory: InventoryUnit[],
  productId: string,
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const unit of inventory) {
    if (unit.productId !== productId || !isAvailableUnit(unit)) continue
    counts[unit.storeId] = (counts[unit.storeId] || 0) + 1
  }
  return counts
}

function toPublicProduct(
  product: CatalogProduct,
  category: CategoryRecord | undefined,
  quantity: number,
): PublicCatalogProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: category?.name || 'Geral',
    categorySlug: category?.slug || 'geral',
    brand: product.brand,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    oldPrice: product.oldPrice,
    installment: product.installment,
    images: product.images,
    colors: product.colors,
    storage: product.storage,
    featured: product.featured,
    bestSeller: product.bestSeller,
    new: product.new,
    sale: product.sale,
    stock: quantity > 0,
    stockQuantity: quantity,
    specs: product.specs,
    keywords: product.keywords,
    inBox: product.inBox,
    warranty: product.warranty,
  }
}

/**
 * Catálogo público do site.
 * - Só produtos publicados com estoque > 0 entram na listagem.
 * - Estoque = unidades `available` em lojas ativas.
 */
export function buildPublicCatalog(
  db: OrgDatabase,
  options?: { includeOutOfStock?: boolean },
): PublicCatalogResponse {
  const activeStoreIds = new Set(
    db.stores.filter((s) => s.active).map((s) => s.id),
  )

  const availableInventory = db.inventory.filter(
    (u) => isAvailableUnit(u) && activeStoreIds.has(u.storeId),
  )

  const categoryById = new Map(db.categories.map((c) => [c.id, c]))

  const products: PublicCatalogProduct[] = []

  for (const product of db.products) {
    if (!product.published) continue

    const quantity = getProductStock(availableInventory, product.id)
    const category = categoryById.get(product.categoryId)

    if (quantity > 0 || options?.includeOutOfStock) {
      products.push(toPublicProduct(product, category, quantity))
    }
  }

  const categories = db.categories
    .filter((c) => c.active)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      featured: c.featured,
    }))

  const settings: StoreSettings = db.settings

  return {
    storeName: settings.storeName || db.organization.name,
    storeSlug: db.organization.slug,
    whatsapp: settings.whatsapp,
    hours: settings.hours,
    topBarMessage: settings.topBarMessage,
    promoBarMessage: settings.promoBarMessage,
    categories,
    products,
    generatedAt: new Date().toISOString(),
  }
}

/** Busca produto público por slug (inclui esgotados para página direta). */
export function getPublicProductBySlug(
  db: OrgDatabase,
  slug: string,
): PublicCatalogProduct | null {
  const catalog = buildPublicCatalog(db, { includeOutOfStock: true })
  return catalog.products.find((p) => p.slug === slug) || null
}
