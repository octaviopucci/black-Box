"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Heart, ShoppingBag, User, ChevronDown, Search } from "lucide-react";
import { storeConfig } from "@/config/store";
import { categories } from "@/data/categories";
import { useCartStore } from "@/store/cart";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  const featuredCategories = categories.filter((c) => c.featured);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-border bg-white/95 backdrop-blur-sm">
        <div className="container-store">
          <div className="flex h-16 items-center gap-4 md:h-[72px]">
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 hover:bg-brand-light lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/"
              className="shrink-0 text-lg font-bold tracking-tight md:text-xl"
            >
              <span className="text-brand-black">{storeConfig.name}</span>
            </Link>

            <div className="hidden flex-1 lg:block lg:max-w-md lg:mx-4">
              <SearchBar />
            </div>

            <nav className="hidden items-center gap-1 lg:flex">
              <div className="relative">
                <button
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-light"
                >
                  Categorias
                  <ChevronDown className="h-4 w-4" />
                </button>
                {megaOpen && (
                  <div
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                    className="absolute left-0 top-full z-50 w-[480px] rounded-2xl border border-brand-border bg-white p-4 shadow-lg"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={
                            cat.slug === "ofertas"
                              ? "/ofertas"
                              : `/categoria/${cat.slug}`
                          }
                          className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-light"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {featuredCategories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.slug}
                  href={
                    cat.slug === "ofertas"
                      ? "/ofertas"
                      : `/categoria/${cat.slug}`
                  }
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-light"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <Link
                href="/buscar"
                className="rounded-lg p-2 hover:bg-brand-light lg:hidden"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </Link>
              <Link
                href="/contato"
                className="hidden rounded-lg p-2 hover:bg-brand-light sm:block"
                aria-label="Atendimento"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/favoritos"
                className="rounded-lg p-2 hover:bg-brand-light"
                aria-label="Favoritos"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <button
                onClick={openCart}
                className="relative rounded-lg p-2 hover:bg-brand-light"
                aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-[10px] font-bold">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
