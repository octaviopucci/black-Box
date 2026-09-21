import { BRAND_NAME } from "@/lib/brand";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2a2a2a] py-6 text-sm text-muted">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>
          © {year} {BRAND_NAME}
        </p>
        <p>Comanda digital · Pedido na mesa</p>
      </div>
    </footer>
  );
}
