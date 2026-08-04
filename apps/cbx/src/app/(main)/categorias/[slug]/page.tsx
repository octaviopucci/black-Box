import { categoryService } from '@/services'
import { CategoryDetailClient } from './category-detail-client'

export function generateStaticParams() {
  return categoryService.list().map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CategoryDetailClient slug={slug} />
}
