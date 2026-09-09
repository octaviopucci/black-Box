"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { categories } from "@/data/categories";
import { SearchBar } from "./SearchBar";
import { Logo } from "./Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[min(320px,88vw)] overflow-y-auto bg-brand-black text-white">
        <div className="flex items-center justify-between border-b border-brand-border p-4">
          <Logo asLink={false} />
          <button onClick={onClose} aria-label="Fechar menu" className="rounded-lg p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <SearchBar variant="dark" onClose={onClose} />
        </div>
        <nav className="px-4 pb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
            Categorias
          </p>
          <ul className="space-y-0.5">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.slug === "ofertas" ? "/ofertas" : `/categoria/${cat.slug}`}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-brand-yellow/10 hover:text-brand-yellow"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-brand-border pt-4 space-y-0.5">
            <Link href="/favoritos" onClick={onClose} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10">
              Favoritos
            </Link>
            <Link href="/contato" onClick={onClose} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10">
              Contato
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
