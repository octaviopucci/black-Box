import { CartProvider } from "@/contexts/cart-context";
import { CustomerApp } from "@/components/customer/customer-app";
import { DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    slug: DEMO_ESTABLISHMENT_SLUG,
    table: `mesa-${i + 1}`,
  }));
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string; table: string }>;
}) {
  const { slug, table } = await params;
  return (
    <CartProvider>
      <CustomerApp slug={slug} tableToken={table} />
    </CartProvider>
  );
}
