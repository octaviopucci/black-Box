import {
  productRepository,
  categoryRepository,
  userRepository,
  storeRepository,
  companyRepository,
  conversationRepository,
  notificationRepository,
  reviewRepository,
  bannerRepository,
  planRepository,
  addressRepository,
  purchaseRepository,
} from '@/repositories'

/**
 * Mock services layer — mirrors future API service contracts.
 * No network calls. Ready to swap for fetch/Prisma later.
 */
export const productService = {
  list: () => productRepository.findAll(),
  get: (id: string) => productRepository.findById(id),
  byCategory: (categoryId: string) => productRepository.findByCategory(categoryId),
  bySeller: (sellerId: string) => productRepository.findBySeller(sellerId),
  sponsored: () => productRepository.findSponsored(),
  featured: () => productRepository.findFeatured(),
  search: (q: string) => productRepository.search(q),
  related: (id: string) => productRepository.findRelated(id),
  recent: (limit?: number) => productRepository.findRecent(limit),
  mostViewed: (limit?: number) => productRepository.findMostViewed(limit),
}

export const categoryService = {
  list: () => categoryRepository.findAll(),
  getBySlug: (slug: string) => categoryRepository.findBySlug(slug),
  get: (id: string) => categoryRepository.findById(id),
}

export const userService = {
  current: () => userRepository.findCurrent(),
  get: (id: string) => userRepository.findById(id),
  list: () => userRepository.findAll(),
}

export const storeService = {
  list: () => storeRepository.findAll(),
  get: (id: string) => storeRepository.findById(id),
  getBySlug: (slug: string) => storeRepository.findBySlug(slug),
}

export const companyService = {
  list: () => companyRepository.findAll(),
  get: (id: string) => companyRepository.findById(id),
}

export const chatService = {
  conversations: () => conversationRepository.findAll(),
  conversation: (id: string) => conversationRepository.findById(id),
  messages: (conversationId: string) => conversationRepository.findMessages(conversationId),
}

export const notificationService = {
  list: () => notificationRepository.findAll(),
  unreadCount: () => notificationRepository.unreadCount(),
}

export const reviewService = {
  byTarget: (targetId: string) => reviewRepository.findByTarget(targetId),
}

export const contentService = {
  banners: () => bannerRepository.findAll(),
  promotions: () => bannerRepository.findPromotions(),
  plans: () => planRepository.findAll(),
}

export const profileService = {
  addresses: () => addressRepository.findAll(),
  purchases: () => purchaseRepository.findAll(),
  history: () => purchaseRepository.findHistory(),
}
