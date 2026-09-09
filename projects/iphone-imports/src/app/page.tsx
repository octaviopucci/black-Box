import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { CategoryCard } from "@/components/home/CategoryCard";
import { PromoBanner } from "@/components/home/PromoBanner";
import { PromoBar } from "@/components/home/PromoBar";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categories } from "@/data/categories";
import {
  getSaleProducts,
  getFeaturedProducts,
  getBestSellers,
  products,
} from "@/lib/products";

const featuredCategories = categories.filter((c) => c.featured);

export default function HomePage() {
  const saleProducts = getSaleProducts().slice(0, 4);
  const iphones = products.filter((p) => p.categorySlug === "iphones").slice(0, 4);
  const bestSellers = getBestSellers().slice(0, 4);
  const accessories = products
    .filter((p) =>
      ["carregadores", "cabos", "power-banks"].includes(p.categorySlug)
    )
    .slice(0, 4);
  const cases = products.filter((p) => p.categorySlug === "capinhas").slice(0, 4);
  const audio = products
    .filter((p) => ["airpods-fones", "audio"].includes(p.categorySlug))
    .slice(0, 4);
  const watches = products
    .filter((p) => p.categorySlug === "smartwatches")
    .slice(0, 4);

  return (
    <>
      <Hero />
      <Benefits />
      <PromoBar />

      <section className="py-12 md:py-16">
        <div className="container-store">
          <SectionHeader
            title="Encontre o que você precisa"
            subtitle="Navegue pelas categorias"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {featuredCategories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                image={cat.image}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-light py-12 md:py-16">
        <div className="container-store">
          <SectionHeader title="Ofertas da semana" href="/ofertas" />
          <ProductGrid products={saleProducts} priorityCount={2} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-store">
          <SectionHeader
            title="iPhones em destaque"
            href="/categoria/iphones"
          />
          <ProductGrid products={iphones} />
        </div>
      </section>

      <section className="container-store py-12 md:py-16">
        <PromoBanner
          title="Seu iPhone merece acessórios à altura."
          description="Capinhas, películas, carregadores e muito mais."
          ctaLabel="Ver acessórios"
          ctaHref="/categoria/capinhas"
        />
      </section>

      <section className="py-12 md:py-16">
        <div className="container-store">
          <SectionHeader title="Mais vendidos" href="/categoria/iphones" />
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="bg-brand-light py-12 md:py-16">
        <div className="container-store">
          <SectionHeader
            title="Acessórios essenciais"
            href="/categoria/carregadores"
          />
          <ProductGrid products={accessories} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-store">
          <SectionHeader title="Capinhas" href="/categoria/capinhas" />
          <ProductGrid products={cases} />
        </div>
      </section>

      <section className="bg-brand-light py-12 md:py-16">
        <div className="container-store">
          <SectionHeader title="Fones e áudio" href="/categoria/airpods-fones" />
          <ProductGrid products={audio} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-store">
          <SectionHeader title="Smartwatches" href="/categoria/smartwatches" />
          <ProductGrid products={watches} />
        </div>
      </section>

      <section className="container-store pb-12 md:pb-16">
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
