import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#2a2a2a] bg-[#111]">
      <div className="mx-auto flex w-full max-w-[960px] items-center justify-between px-4 py-3">
        <Link href="#topo" className="text-[1.15rem] font-extrabold tracking-wide" aria-label={BRAND_NAME}>
          NA <span className="text-brand">MESA</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin/login"
            className="hidden text-sm font-medium text-muted transition hover:text-ink sm:inline"
          >
            Entrar
          </Link>
          <Link
            href="#planos"
            className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-[#111] transition hover:bg-brand-dark"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </header>
  );
}
