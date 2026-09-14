import { CartProvider } from "@/contexts/cart-context";
import { CustomerApp } from "@/components/customer/customer-app";

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
