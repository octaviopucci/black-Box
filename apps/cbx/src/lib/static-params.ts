import { productService, userService } from '@/services'

/** Static params for meus-anuncios [id] routes — current user products + all products. */
export function productAdStaticParams() {
  const currentUserProducts = productService.bySeller(userService.current().id)
  const allProducts = productService.list()
  const ids = new Set([
    ...currentUserProducts.map((p) => p.id),
    ...allProducts.map((p) => p.id),
  ])
  return Array.from(ids).map((id) => ({ id }))
}
