import Image from "next/image";
import { asset } from "@/lib/assets";
import { BRAND_NAME } from "@/lib/brand";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2a2a2a] py-8 text-sm text-muted">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Image
          src={asset("/brand/na-mesa-logo-horizontal.png")}
          alt={BRAND_NAME}
          width={140}
          height={36}
          className="h-7 w-auto opacity-90"
        />
        <p>Pedido na mesa · Comanda na cozinha</p>
      </div>
      <p className="mt-4 text-xs">© {year} {BRAND_NAME}</p>
    </footer>
  );
}
