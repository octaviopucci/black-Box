import type { Metadata } from "next";
import { products } from "@/lib/products";
import { LiveProductPage } from "@/components/product/LiveProductPage";
import { getProductBySlug } from "@/lib/products";
import { storeConfig } from "@/config/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = products.map((p) => ({ slug: p.slug }));
  return [...slugs, { slug: "__live__" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: `Produto | ${storeConfig.name}` };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ${storeConfig.name}`,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <LiveProductPage slug={slug} />;
}
