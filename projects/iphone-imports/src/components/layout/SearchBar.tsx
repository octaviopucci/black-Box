"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2 ? searchProducts(query).slice(0, 6) : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      onClose?.();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar produtos..."
          className="w-full rounded-xl border border-brand-border bg-brand-light py-2.5 pl-10 pr-10 text-sm transition-colors focus:border-brand-black focus:bg-white focus:outline-none"
          aria-label="Buscar produtos"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-lg">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/produto/${product.slug}`}
              onClick={() => {
                setOpen(false);
                onClose?.();
              }}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-light"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-light">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-brand-gray">{formatCurrency(product.price)}</p>
              </div>
            </Link>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full border-t border-brand-border px-4 py-3 text-center text-sm font-semibold text-brand-black hover:bg-brand-light"
          >
            Ver todos os resultados
          </button>
        </div>
      )}
    </div>
  );
}
