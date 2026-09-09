"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { categories } from "@/data/categories";
import { SearchBar } from "./SearchBar";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[min(320px,85vw)] overflow-y-auto bg-white">
        <div className="flex items-center justify-between border-b border-brand-border p-4">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={onClose} aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <SearchBar onClose={onClose} />
        </div>
        <nav className="px-4 pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-gray">
            Categorias
          </p>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.slug === "ofertas" ? "/ofertas" : `/categoria/${cat.slug}`}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-light"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-brand-border pt-4">
            <Link
              href="/favoritos"
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-light"
            >
              Favoritos
            </Link>
            <Link
              href="/contato"
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-light"
            >
              Contato
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
