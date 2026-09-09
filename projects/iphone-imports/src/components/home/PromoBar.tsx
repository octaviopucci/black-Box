import Link from "next/link";
import { storeConfig } from "@/config/store";

export function PromoBar() {
  return (
    <div className="bg-brand-yellow py-2.5 text-center">
      <Link
        href="/ofertas"
        className="text-sm font-semibold text-brand-black transition-opacity hover:opacity-80"
      >
        {storeConfig.promoBarMessage}
      </Link>
    </div>
  );
}
