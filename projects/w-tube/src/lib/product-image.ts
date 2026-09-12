import type { Product } from "@/types";

/** Placeholder quando a imagem do produto falha ou está vazia */
export const PRODUCT_IMAGE_FALLBACK =
  "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-finish-select-lavender-202509_SW_COLOR?wid=800&hei=800&fmt=png-alpha&qlt=90";

export function getPrimaryImage(product: Pick<Product, "images">): string {
  const url = product.images?.find((img) => typeof img === "string" && img.trim().length > 0);
  return url?.trim() || PRODUCT_IMAGE_FALLBACK;
}

/** Mescla catálogo live com estático preservando imagens válidas */
export function mergeProductRecord(staticProduct: Product, liveProduct: Product): Product {
  const liveImages = (liveProduct.images ?? []).filter((img) => img?.trim());
  const staticImages = (staticProduct.images ?? []).filter((img) => img?.trim());

  return {
    ...staticProduct,
    ...liveProduct,
    images: liveImages.length > 0 ? liveImages : staticImages,
  };
}
