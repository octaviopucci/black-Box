"use client";

import { useCatalog } from "@/components/catalog/CatalogProvider";
import { CategoryCard } from "@/components/home/CategoryCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PromoBanner } from "@/components/home/PromoBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";

export function LiveHome() {
  const { loading, live, products, categories } = useCatalog();

  if (loading) {
    return (
      <div className="container-store py-20 text-center text-brand-muted">
        Carregando catálogo...
      </div>
    );
  }

  const featuredCategories = categories.filter((c) => c.featured).slice(0, 6);
  const saleProducts = products.filter((p) => p.sale).slice(0, 4);
  const iphones = products.filter((p) => p.categorySlug === "iphones").slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const accessories = products
    .filter((p) => ["carregadores", "cabos", "power-banks"].includes(p.categorySlug))
    .slice(0, 4);
  const cases = products.filter((p) => p.categorySlug === "capinhas").slice(0, 4);
  const audio = products
    .filter((p) => ["airpods-fones", "audio"].includes(p.categorySlug))
    .slice(0, 4);
  const watches = products.filter((p) => p.categorySlug === "smartwatches").slice(0, 4);

  return (
    <>
      {live && (
        <div className="border-b border-brand-yellow/20 bg-brand-yellow/5 py-2 text-center text-xs font-medium text-brand-yellow">
          Estoque sincronizado · atualiza automaticamente a cada 15s
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

      <section className="container-store py-14 md:py-20">
        <PromoBanner
          title="Seu iPhone merece acessórios à altura."
          description="Capinhas, películas, carregadores e muito mais."
          ctaLabel="Ver acessórios"
          ctaHref="/categoria/capinhas"
          variant="yellow"
        />
      </section>

      {bestSellers.length > 0 && (
        <section className="section-light py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Mais vendidos" href="/categoria/iphones" />
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}

      {accessories.length > 0 && (
        <section className="section-dark py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Acessórios essenciais" href="/categoria/carregadores" variant="dark" />
            <ProductGrid products={accessories} dark />
          </div>
        </section>
      )}

      {cases.length > 0 && (
        <section className="section-white py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Capinhas" href="/categoria/capinhas" />
            <ProductGrid products={cases} />
          </div>
        </section>
      )}

      {audio.length > 0 && (
        <section className="section-light py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Fones e áudio" href="/categoria/airpods-fones" />
            <ProductGrid products={audio} />
          </div>
        </section>
      )}

      {watches.length > 0 && (
        <section className="section-dark py-14 md:py-20">
          <div className="container-store">
            <SectionHeader title="Smartwatches" href="/categoria/smartwatches" variant="dark" />
            <ProductGrid products={watches} dark />
          </div>
        </section>
      )}

      <section className="container-store pb-14 md:pb-20">
        <PromoBanner
          title="Ofertas que cabem no seu bolso."
          description="Monte seu pedido e consulte condições pelo WhatsApp."
          ctaLabel="Ver ofertas"
          ctaHref="/ofertas"
          variant="dark"
        />
      </section>

      <Testimonials />
      <Newsletter />
    </>
  );
}
