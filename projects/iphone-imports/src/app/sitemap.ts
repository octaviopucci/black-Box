import type { MetadataRoute } from "next";
import { storeConfig } from "@/config/store";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = storeConfig.siteUrl;

  const staticPages = [
    "",
    "/ofertas",
    "/buscar",
    "/carrinho",
    "/checkout",
    "/favoritos",
    "/sobre",
    "/contato",
    "/politica-de-privacidade",
    "/termos",
    "/trocas-e-devolucoes",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryPages = categories
    .filter((c) => c.slug !== "ofertas")
    .map((c) => ({
      url: `${base}/categoria/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const productPages = products.map((p) => ({
    url: `${base}/produto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
