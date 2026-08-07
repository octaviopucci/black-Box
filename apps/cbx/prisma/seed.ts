import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { categories as mockCategories } from '../src/mocks/categories'
import { products as mockProducts } from '../src/mocks/products'
import { users as mockUsers } from '../src/mocks/users'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding CBX…')

  for (const c of mockCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        icon: c.icon,
        color: c.color,
        image: c.image || '',
        productCount: c.productCount,
      },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        color: c.color,
        image: c.image || '',
        productCount: c.productCount,
      },
    })
  }

  const passwordHash = await bcrypt.hash('cbx123456', 10)

  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { email: u.email.toLowerCase() },
      update: {
        name: u.name,
        phone: u.phone,
        avatar: u.avatar,
        city: u.city,
        state: u.state,
        bio: u.bio,
        verified: u.verified,
        phoneVerified: u.phoneVerified,
        plan: u.plan,
        rating: u.rating,
        reviewCount: u.reviewCount,
        salesCount: u.salesCount,
        adsCount: u.adsCount,
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email.toLowerCase(),
        phone: u.phone,
        avatar: u.avatar,
        city: u.city,
        state: u.state,
        bio: u.bio,
        verified: u.verified,
        phoneVerified: u.phoneVerified,
        plan: u.plan,
        rating: u.rating,
        reviewCount: u.reviewCount,
        salesCount: u.salesCount,
        adsCount: u.adsCount,
        passwordHash,
      },
    })
  }

  for (const p of mockProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice,
        condition: p.condition,
        images: p.images,
        categoryId: p.categoryId,
        sellerId: p.sellerId,
        storeId: p.storeId,
        city: p.city,
        neighborhood: p.neighborhood,
        views: p.views,
        favoritesCount: p.favorites,
        status: p.status,
        sponsored: Boolean(p.sponsored),
        featured: Boolean(p.featured),
        tags: p.tags,
        specs: p.specs,
        lat: p.location.lat,
        lng: p.location.lng,
      },
      create: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice,
        condition: p.condition,
        images: p.images,
        categoryId: p.categoryId,
        sellerId: p.sellerId,
        storeId: p.storeId,
        city: p.city,
        neighborhood: p.neighborhood,
        views: p.views,
        favoritesCount: p.favorites,
        status: p.status,
        sponsored: Boolean(p.sponsored),
        featured: Boolean(p.featured),
        tags: p.tags,
        specs: p.specs,
        lat: p.location.lat,
        lng: p.location.lng,
        createdAt: new Date(p.createdAt),
      },
    })
  }

  console.log('Seed OK.')
  console.log('Login demo: ana.oliveira@gmail.com / cbx123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
