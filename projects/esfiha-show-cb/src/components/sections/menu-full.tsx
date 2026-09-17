"use client";

import { useEffect, useState } from "react";
import { menuCategories, formatPrice } from "@/data/menu";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function MenuFull() {
  const [active, setActive] = useState(menuCategories[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace("cat-", ""));
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    for (const cat of menuCategories) {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) obs.observe(el);
    }

    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-show-paper py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-show-green-dark">
              Preços atualizados
            </p>
            <h2 className="display mt-2 text-4xl text-show-dark md:text-5xl">
              Cardápio detalhado
            </h2>
          </div>
          <a
            href={site.links.delivery}
            target="_blank"
            rel="noopener noreferrer"
            className="display inline-flex w-fit rounded-lg bg-show-green-dark px-6 py-3 text-white"
          >
            Montar pedido no delivery →
          </a>
        </div>

        <div className="sticky top-[72px] z-40 mt-10 -mx-4 bg-show-paper/95 px-4 py-3 backdrop-blur-md md:top-[68px]">
          <div className="flex gap-2 overflow-x-auto menu-scroll">
            {menuCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className={cn(
                  "display shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors",
                  active === cat.id
                    ? "bg-show-dark text-white"
                    : "bg-white text-show-dark ring-1 ring-border hover:bg-secondary"
                )}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-16">
          {menuCategories.map((cat) => (
            <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-36">
              <div className="mb-6 border-b-2 border-show-green pb-4">
                <h3 className="display text-3xl text-show-dark md:text-4xl">{cat.name}</h3>
                {cat.subtitle && (
                  <p className="mt-1 text-show-muted">{cat.subtitle}</p>
                )}
                {cat.fromPrice && (
                  <p className="price mt-2 text-base">
                    a partir de {formatPrice(cat.fromPrice)}
                  </p>
                )}
              </div>

              <ul className="divide-y divide-border rounded-xl bg-white shadow-sm ring-1 ring-border">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-show-dark">{item.name}</p>
                      {item.description && (
                        <p className="mt-0.5 text-sm text-show-muted">{item.description}</p>
                      )}
                    </div>
                    <p className="price shrink-0 text-lg">{formatPrice(item.price)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
