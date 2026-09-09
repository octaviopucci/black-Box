import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/data/categories";
import { products } from "@/lib/products";
import { CategoryPageClient } from "@/components/product/CategoryPage";
import { storeConfig } from "@/config/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "iphones" },
    { slug: "smartphones" },
    { slug: "airpods-fones" },
    { slug: "smartwatches" },
    { slug: "capinhas" },
    { slug: "peliculas" },
    { slug: "carregadores" },
    { slug: "cabos" },
    { slug: "fontes" },
    { slug: "power-banks" },
    { slug: "suportes" },
    { slug: "acessorios-carro" },
    { slug: "audio" },
    { slug: "eletronicos" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada" };

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} | ${storeConfig.name}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return <CategoryPageClient category={category} />;
}
