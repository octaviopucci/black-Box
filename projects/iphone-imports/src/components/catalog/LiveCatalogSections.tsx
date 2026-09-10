"use client";

import { useLiveCatalog } from "@/hooks/useLiveCatalog";
import { CategoryCard } from "@/components/home/CategoryCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Seções da home que usam catálogo vivo da API (estoque sincronizado). */
export function LiveCatalogSections() {
  const { loading, live, products, categories } = useLiveCatalog();

  if (loading && !live) return null;

  const featuredCategories = categories.filter((c) => c.featured).slice(0, 6);
  const saleProducts = products.filter((p) => p.sale).slice(0, 4);
  const iphones = products.filter((p) => p.categorySlug === "iphones").slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  if (live && products.length === 0) {
    return (
      <section className="section-white py-14">
        <div className="container-store text-center">
          <p className="text-brand-muted">Catálogo ao vivo conectado — aguardando produtos em estoque.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {live && (
        <div className="border-b border-brand-silver/20 bg-brand-silver/5 py-2 text-center text-xs font-medium text-brand-silver">
          Catálogo sincronizado com o estoque · atualiza automaticamente
        </div>
      )}

      {featuredCategories.length > 0 && (
        <section className="section-white py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Encontre o que você precisa" subtitle="Navegue pelas categorias" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {featuredCategories.map((cat) => (
                <CategoryCard key={cat.slug} name={cat.name} slug={cat.slug} image={cat.image} />
              ))}
            </div>
          </div>
        </section>
      )}

      {saleProducts.length > 0 && (
        <section className="section-dark py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Ofertas da semana" href="/ofertas" variant="dark" />
            <ProductGrid products={saleProducts} priorityCount={2} dark />
          </div>
        </section>
      )}

      {iphones.length > 0 && (
        <section className="section-white py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="iPhones em destaque" href="/categoria/iphones" />
            <ProductGrid products={iphones} priorityCount={2} />
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="section-light py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Mais vendidos" href="/categoria/iphones" />
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}
    </>
  );
}
