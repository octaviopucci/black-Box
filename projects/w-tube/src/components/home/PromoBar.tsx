import Link from "next/link";
import { storeConfig } from "@/config/store";
import { ArrowRight } from "lucide-react";

export function PromoBar() {
  return (
    <div className="bg-brand-black py-3">
      <div className="container-store flex items-center justify-center gap-2">
        <Link
          href="/ofertas"
          className="flex items-center gap-2 text-sm font-bold text-brand-purple transition-opacity hover:opacity-80"
        >
          {storeConfig.promoBarMessage}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
